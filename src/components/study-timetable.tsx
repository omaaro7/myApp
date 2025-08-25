"use client";

// src\components\study-timetable.tsx

import * as React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash2, Pencil } from "lucide-react";
import type { Locale } from "@/i18n-config";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface TimetableSlot {
  id: string;
  day: DayKey; // sat..fri
  subject: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  notes?: string;
  createdAt?: Date;
}

type DayKey = 'sat' | 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri';

const dayKeys: DayKey[] = ['sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri'];

const dayOrder: Record<DayKey, number> = {
  sat: 1,
  sun: 2,
  mon: 3,
  tue: 4,
  wed: 5,
  thu: 6,
  fri: 7,
};

export default function StudyTimetable({ lang, dictionary }: { lang: Locale; dictionary: any }) {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = React.useState(true);
  const [slots, setSlots] = React.useState<TimetableSlot[]>([]);

  const [day, setDay] = React.useState<DayKey>("sat");
  const [subject, setSubject] = React.useState<string>("");
  const [startTime, setStartTime] = React.useState<string>("");
  const [endTime, setEndTime] = React.useState<string>("");
  const [notes, setNotes] = React.useState<string>("");
  const [saving, setSaving] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"list" | "table">("table");
  const [expandedDays, setExpandedDays] = React.useState<Set<DayKey>>(new Set());
  const [selectedDay, setSelectedDay] = React.useState<DayKey>('sat');
  const [openDayDialog, setOpenDayDialog] = React.useState(false);

  const [editingSlotId, setEditingSlotId] = React.useState<string | null>(null);
  const [editSubject, setEditSubject] = React.useState("");
  const [editStart, setEditStart] = React.useState("");
  const [editEnd, setEditEnd] = React.useState("");
  const [editNotes, setEditNotes] = React.useState("");
  const [updating, setUpdating] = React.useState(false);

  React.useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const qRef = query(collection(db, "users", user.uid, "timetable"));
    const unsub = onSnapshot(qRef, (snap) => {
      const data = snap.docs.map((d) => {
        const v = d.data() as any;
        return {
          id: d.id,
          day: v.day as DayKey,
          subject: v.subject,
          startTime: v.startTime,
          endTime: v.endTime,
          notes: v.notes ?? "",
          createdAt: v.createdAt?.toDate?.() ?? undefined,
        } as TimetableSlot;
      });
      // Sort by day then time
      data.sort((a, b) => {
        const byDay = (dayOrder[a.day] ?? 100) - (dayOrder[b.day] ?? 100);
        if (byDay !== 0) return byDay;
        return a.startTime.localeCompare(b.startTime);
      });
      setSlots(data);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  const addSlot = async () => {
    if (!user) return;
    if (!subject.trim() || !startTime || !endTime) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "users", user.uid, "timetable"), {
        day,
        subject: subject.trim(),
        startTime,
        endTime,
        notes: notes.trim() || "",
        createdAt: serverTimestamp(),
      });
      setSubject("");
      setStartTime("");
      setEndTime("");
      setNotes("");
    } finally {
      setSaving(false);
    }
  };

  const removeSlot = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "timetable", id));
  };

  const startEdit = (s: TimetableSlot) => {
    setEditingSlotId(s.id);
    setEditSubject(s.subject);
    setEditStart(s.startTime);
    setEditEnd(s.endTime);
    setEditNotes(s.notes ?? "");
  };

  const cancelEdit = () => {
    setEditingSlotId(null);
    setEditSubject("");
    setEditStart("");
    setEditEnd("");
    setEditNotes("");
  };

  const saveEdit = async (slotId: string) => {
    if (!user) return;
    setUpdating(true);
    try {
      await updateDoc(doc(db, "users", user.uid, "timetable", slotId), {
        subject: editSubject.trim(),
        startTime: editStart,
        endTime: editEnd,
        notes: editNotes.trim(),
      });
      cancelEdit();
    } finally {
      setUpdating(false);
    }
  };

  const grouped: Record<DayKey, TimetableSlot[]> = React.useMemo(() => {
    const g: Record<DayKey, TimetableSlot[]> = { sat: [], sun: [], mon: [], tue: [], wed: [], thu: [], fri: [] };
    for (const s of slots) {
      if (!g[s.day]) g[s.day as DayKey] = [] as TimetableSlot[];
      g[s.day as DayKey].push(s);
    }
    // sort each day's slots
    dayKeys.forEach((d) => g[d].sort((a, b) => a.startTime.localeCompare(b.startTime)));
    return g;
  }, [slots]);

  const toggleDay = (d: DayKey) => {
    setExpandedDays(prev => {
      const next = new Set(prev);
      if (next.has(d)) next.delete(d); else next.add(d);
      return next as Set<DayKey>;
    });
  };

  const t = dictionary;

  const renderSlotRow = (s: TimetableSlot) => (
    <div key={s.id} className="flex items-start justify-between rounded-md border p-3">
      {editingSlotId === s.id ? (
        <div className="w-full space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <Input value={editSubject} onChange={(e) => setEditSubject(e.target.value)} />
            <Input type="time" value={editStart} onChange={(e) => setEditStart(e.target.value)} />
            <Input type="time" value={editEnd} onChange={(e) => setEditEnd(e.target.value)} />
            <Input value={editNotes} onChange={(e) => setEditNotes(e.target.value)} placeholder={t.notesPlaceholder} />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => saveEdit(s.id)} disabled={updating}>{t.saveButton}</Button>
            <Button size="sm" variant="outline" onClick={cancelEdit} disabled={updating}>{t.cancelButton}</Button>
          </div>
        </div>
      ) : (
        <div className="flex w-full items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="text-sm font-semibold">
              {s.startTime} - {s.endTime}
            </div>
            <div className="text-sm">{s.subject}</div>
            {s.notes && <div className="text-xs text-muted-foreground">{s.notes}</div>}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => startEdit(s)} aria-label={t.editButton}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => removeSlot(s.id)} aria-label={t.deleteButton}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">{t.dayLabel}</label>
              <Select value={day} onValueChange={(v) => setDay(v as DayKey)}>
                <SelectTrigger>
                  <SelectValue placeholder={t.dayLabel} />
                </SelectTrigger>
                <SelectContent>
                  {dayKeys.map((k) => (
                    <SelectItem key={k} value={k}>{t.days[k]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">{t.subjectLabel}</label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={t.subjectPlaceholder} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t.startLabel}</label>
              <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t.endLabel}</label>
              <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-sm font-medium mb-1">{t.notesLabel}</label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t.notesPlaceholder} />
          </div>
          <div className="mt-4 flex items-center gap-2 rtl:space-x-reverse">
            <Button onClick={addSlot} disabled={saving || !subject || !startTime || !endTime}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin rtl:ml-2 rtl:mr-0" />}
              {t.addSlot}
            </Button>
            <div className="ml-auto rtl:mr-auto rtl:ml-0 flex gap-2">
              <Button variant={viewMode === 'table' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('table')}>
                {t.tableView}
              </Button>
              <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('list')}>
                {t.listView}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{t.listTitle}</CardTitle>
          <CardDescription>{t.listDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : slots.length === 0 ? (
            <p className="text-muted-foreground py-4">{t.empty}</p>
          ) : viewMode === 'list' ? (
            <div className="space-y-4">
              {dayKeys.map((d) => (
                <div key={d} className="rounded-md border">
                  <button onClick={() => toggleDay(d)} className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium">
                    <span>{t.days[d]}</span>
                    <span className="text-muted-foreground">{expandedDays.has(d) ? '−' : '+'}</span>
                  </button>
                  {expandedDays.has(d) && (
                    <div className="px-3 pb-3 space-y-2">
                      {grouped[d].length === 0 ? (
                        <p className="text-muted-foreground text-sm">{t.noDayTasks}</p>
                      ) : (
                        grouped[d].map((s) => (
                          <React.Fragment key={s.id}>{renderSlotRow(s)}</React.Fragment>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.tableDay}</TableHead>
                    <TableHead>{t.tasksCount}</TableHead>
                    <TableHead>{t.actions}</TableHead>
                    <TableHead>{t.overview}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dayKeys.map((d) => {
                    const items = grouped[d];
                    return (
                      <TableRow key={d} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => { setSelectedDay(d); setOpenDayDialog(true); }}>
                        <TableCell className="font-medium">{t.days[d]}</TableCell>
                        <TableCell>
                          {items.length > 0 ? (
                            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                              {items.length} {items.length === 1 ? t.task : t.tasks}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {items.length > 0 ? (
                            <Button variant="ghost" size="sm" className="h-7">
                              {t.viewDetails}
                            </Button>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {items.length > 0 && (
                            <div className="flex -space-x-2 rtl:space-x-reverse">
                              {items.slice(0, 3).map((item, index) => (
                                <div key={item.id} className="relative inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary ring-2 ring-white dark:ring-gray-900">
                                  {item.subject[0]}
                                </div>
                              ))}
                              {items.length > 3 && (
                                <div className="relative inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary ring-2 ring-white dark:ring-gray-900">
                                  +{items.length - 3}
                                </div>
                              )}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <Dialog open={openDayDialog} onOpenChange={setOpenDayDialog}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                      <span>{t.days[selectedDay]}</span>
                      {grouped[selectedDay].length > 0 && (
                        <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
                          {grouped[selectedDay].length} {grouped[selectedDay].length === 1 ? t.task : t.tasks}
                        </span>
                      )}
                    </DialogTitle>
                    <DialogDescription>{t.dayDialogDescription}</DialogDescription>
                  </DialogHeader>
                  {grouped[selectedDay].length === 0 ? (
                    <p className="text-muted-foreground text-sm py-4">{t.noDayTasks}</p>
                  ) : (
                    <div className="space-y-3 mt-4">
                      {grouped[selectedDay].map((s) => (
                        <React.Fragment key={s.id}>{renderSlotRow(s)}</React.Fragment>
                      ))}
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 