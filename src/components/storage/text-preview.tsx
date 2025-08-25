"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

export function TextPreview({ url }: { url: string }) {
	const [content, setContent] = React.useState<string>("");
	const [loading, setLoading] = React.useState<boolean>(true);
	const [error, setError] = React.useState<string>("");

	React.useEffect(() => {
		let cancelled = false;
		setLoading(true);
		setError("");
		setContent("");
		fetch(url)
			.then(async (res) => {
				if (!res.ok) throw new Error(`Failed to load (${res.status})`);
				const text = await res.text();
				if (!cancelled) setContent(text);
			})
			.catch((e: any) => {
				if (!cancelled) setError(e?.message || "Failed to load content");
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [url]);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64 text-muted-foreground">
				<Loader2 className="h-5 w-5 animate-spin" />
				<span className="ml-2">Loading text…</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-4 rounded-md border bg-muted/30 text-sm text-red-600 dark:text-red-500">
				{error}
			</div>
		);
	}

	return (
		<pre className="whitespace-pre-wrap break-words rounded-md border p-4 max-h-[60vh] overflow-auto text-sm">
			{content}
		</pre>
	);
} 