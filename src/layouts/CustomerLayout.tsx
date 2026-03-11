import { Outlet } from "react-router-dom";
import { useState, useRef, useEffect, Suspense } from "react";
import { Skeleton } from "@heroui/react";

function CustomerPageSkeleton() {
	return (
		<div className="p-5 md:p-8 flex flex-col gap-5 w-full justify-center items-center">
			<Skeleton className="h-8 w-1/3 rounded-lg" />
			<div className="flex gap-4 flex-wrap">
				<Skeleton className="h-48 w-40 rounded-xl" />
				<Skeleton className="h-48 w-40 rounded-xl" />
				<Skeleton className="h-48 w-40 rounded-xl" />
				<Skeleton className="h-48 w-40 rounded-xl" />
			</div>
			<Skeleton className="h-6 w-2/3 rounded-lg" />
			<Skeleton className="h-6 w-1/2 rounded-lg" />
		</div>
	);
}

import { Navbar } from "@/components/navbar/CustomerNav/navbarDesktop";
import { NavbarMobile } from "@/components/navbar/CustomerNav/navbarMobile";
import { UserProfile } from "@/model/userProfile";
import { User as AuthUser } from "@supabase/supabase-js";
import { FloatingChatProvider } from "@/ContextProvider/FloatingChatContext/FloatingChatContext";
import { FloatingChat } from "@/pages/General/Chat/FloatingChat";
import { NotificationAlert } from "@/pages/General/Notification/NotificationAlert";
import { ClosingTimeProvider } from "@/ContextProvider/ClosingTimeContext/ClosingTimeContext";
import { ClosingTimeBanner } from "@/components/General/ClosingTimeBanner";

export default function CustomerLayout({
	user,
	profile,
	handleSignOut,
}: {
	user: AuthUser | null;
	profile: UserProfile | null;
	handleSignOut: () => Promise<void>;
}) {
	const [searchTerm, setSearchTerm] = useState<string | null>(null);
	const topNavRef = useRef<HTMLDivElement>(null);
	const bottomNavRef = useRef<HTMLDivElement>(null);
	const [navHeight, setNavHeight] = useState(0);
	const [footerHeight, setFooterHeight] = useState(0);
	useEffect(() => {
		const updateHeights = () => {
			if (topNavRef.current) {
				setNavHeight(topNavRef.current.offsetHeight);
			}
			if (bottomNavRef.current) {
				setFooterHeight(bottomNavRef.current.offsetHeight);
			}
		};

		// Initial measurement
		updateHeights();

		// Observer for dynamic changes
		const observer = new ResizeObserver(updateHeights);

		if (topNavRef.current) observer.observe(topNavRef.current);
		if (bottomNavRef.current) observer.observe(bottomNavRef.current);

		return () => observer.disconnect();
	}, []);

	return (
		<ClosingTimeProvider>
			<FloatingChatProvider>
				<div className="relative min-h-screen bg-background text-foreground">
					{/* Top Navbar (+ closing time banner above it) */}
					<div
						ref={topNavRef}
						className="fixed top-0 left-0 w-full z-50"
					>
						<ClosingTimeBanner />
						<Navbar
							user={user}
							profile={profile}
							setSearchTerm={setSearchTerm}
							handleSignOut={handleSignOut}
						/>
					</div>

					{/* Page content */}
					<main
						style={{
							paddingTop: `${navHeight}px`,
							paddingBottom: `${footerHeight}px`,
						}}
					>
						<Suspense fallback={<CustomerPageSkeleton />}>
							<Outlet context={{ searchTerm, setSearchTerm }} />
						</Suspense>
					</main>

					{/* Bottom Navbar */}
					<div
						ref={bottomNavRef}
						className="fixed bottom-0 left-0 w-full z-50 sm:hidden"
					>
						<NavbarMobile
							user={user}
							profile={profile}
							handleSignOut={handleSignOut}
						/>
					</div>

					{/* Floating Chat Widget */}
					<FloatingChat />

					{/* In-app Notification Alert */}
					{user && <NotificationAlert />}
				</div>
			</FloatingChatProvider>
		</ClosingTimeProvider>
	);
}
