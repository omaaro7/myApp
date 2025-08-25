"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SettingsDrawer from '@/components/settings-drawer';
import type { Locale } from "@/i18n-config";

interface LandingAuthControlsProps {
	lang: Locale;
	loginText: string;
	signupText: string;
	settingsDictionary?: any;
}

export default function LandingAuthControls({ lang, loginText, signupText, settingsDictionary }: LandingAuthControlsProps) {
	const router = useRouter();
	const [user] = useAuthState(auth);

	const handleLogout = async () => {
		await signOut(auth);
		router.push(`/${lang}`);
	};

	return (
		<div className="flex items-center gap-2">
			<SettingsDrawer dictionary={settingsDictionary || {}} />
			{user ? (
				<>
					<Button variant="secondary" asChild>
						<Link href={`/${lang}/dashboard`}>Dashboard</Link>
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="rounded-full">
								<Avatar>
									<AvatarImage src={user.photoURL ?? 'https://placehold.co/100x100'} alt="User" />
									<AvatarFallback>{user.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
								</Avatar>
								<span className="sr-only">Toggle user menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link href={`/${lang}/profile`}>Profile</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={handleLogout} className="cursor-pointer">Logout</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</>
			) : (
				<>
					<Button variant="ghost" asChild>
						<Link href={`/${lang}/login`}>{loginText}</Link>
					</Button>
					<Button asChild>
						<Link href={`/${lang}/signup`}>{signupText}</Link>
					</Button>
				</>
			)}
		</div>
	);
} 