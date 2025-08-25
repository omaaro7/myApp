"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import type { Locale } from "@/i18n-config";

export default function RedirectIfAuthed({ lang }: { lang: Locale }) {
	const router = useRouter();
	const [user, loading] = useAuthState(auth);

	useEffect(() => {
		if (!loading && user) {
			router.replace(`/${lang}/dashboard`);
		}
	}, [user, loading, router, lang]);

	return null;
} 