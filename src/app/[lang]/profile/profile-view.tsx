
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import Loader from "@/components/loader";
import * as React from 'react';
import { updateProfile } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

export default function ProfileView() {
    const [user, loading] = useAuthState(auth);
    const { toast } = useToast();

    const [isEditing, setIsEditing] = React.useState(false);
    const [displayName, setDisplayName] = React.useState("");
    const [saving, setSaving] = React.useState(false);

    React.useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || "");
        }
    }, [user]);

    if (loading) {
        return <Loader />;
    }

    if (!user) {
        return <p>Please sign in to view your profile.</p>;
    }

    const onSave = async () => {
        if (!auth.currentUser) return;
        const trimmed = displayName.trim();
        if (!trimmed) {
            toast({ title: "Name is required", variant: "destructive" });
            return;
        }
        try {
            setSaving(true);
            await updateProfile(auth.currentUser, { displayName: trimmed });
            await auth.currentUser.reload();
            toast({ title: "Profile updated" });
            setIsEditing(false);
        } catch (e: any) {
            toast({ title: "Failed to update profile", description: e.message, variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    const onCancel = () => {
        setDisplayName(user.displayName || "");
        setIsEditing(false);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold font-headline">My Profile</h1>
                <p className="text-muted-foreground">
                    View and manage your account details.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>This is your personal information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={user.photoURL ?? "https://placehold.co/100x100"} alt={user.displayName ?? 'User'} />
                            <AvatarFallback>{user.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <h2 className="text-2xl font-semibold">{user.displayName || "Anonymous User"}</h2>
                            <p className="text-muted-foreground">{user.email}</p>
                        </div>
                    </div>

                    {!isEditing ? (
                        <div>
                            <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Name</Button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div>
                                <label className="block text-sm font-medium mb-1">Display Name</label>
                                <Input
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Enter your name"
                                    disabled={saving}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={onSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
                                <Button variant="ghost" onClick={onCancel} disabled={saving}>Cancel</Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
