import { Outlet } from "react-router-dom";
import { useState, useRef, useEffect, Suspense } from "react";
import { Skeleton } from "@heroui/react";

import { NavbarMobileAdmin } from "@/components/navbar/AdminNav/navbarMobileAdmin";
import { SidebarDesktopAdmin } from "@/components/navbar/AdminNav/sidebarDesktopAdmin";
import { useAuth } from "@/ContextProvider/AuthContext/AuthProvider";
import { AdminFloatingChat } from "@/pages/Admin/Chat/AdminFloatingChat";
import { NotificationAlert } from "@/pages/General/Notification/NotificationAlert";
import { NotificationBell } from "@/pages/General/Notification/NotificationBell";

function AdminPageSkeleton() {
	return (
		<div className="p-5 md:p-8 flex flex-col gap-5 w-full">
			<Skeleton className="h-8 w-1/3 rounded-lg" />
			<div className="flex gap-4">
				<Skeleton className="h-28 w-1/4 rounded-xl" />
				<Skeleton className="h-28 w-1/4 rounded-xl" />
				<Skeleton className="h-28 w-1/4 rounded-xl" />
				<Skeleton className="h-28 w-1/4 rounded-xl" />
			</div>
			<Skeleton className="h-64 w-full rounded-xl" />
			<Skeleton className="h-10 w-2/3 rounded-lg" />
			<Skeleton className="h-10 w-1/2 rounded-lg" />
		</div>
	);
}

export default function AdminLayout() {
	const [searchTerm, setSearchTerm] = useState<string | null>(null);
	const bottomNavRef = useRef<HTMLDivElement>(null);
	const [footerHeight, setFooterHeight] = useState(0);
	const auth = useAuth();
	const user = auth?.user ?? null;
	const profile = auth?.profile ?? null;

	useEffect(() => {
		const updateHeights = () => {
			if (bottomNavRef.current) {
				setFooterHeight(bottomNavRef.current.offsetHeight);
			}
		};

		// Initial measurement
		updateHeights();

		// Observer for dynamic changes
		const observer = new ResizeObserver(updateHeights);

		if (bottomNavRef.current) observer.observe(bottomNavRef.current);

		return () => observer.disconnect();
	}, []);

	return (
		<div className="relative h-[100dvh] w-full bg-background text-foreground overflow-hidden flex flex-col sm:flex-row">
			{/* Sidebar Desktop */}
			<div className="hidden sm:block w-[330px] h-full flex-shrink-0">
				<SidebarDesktopAdmin profile={profile} />
			</div>

			{/* Main Content Area */}
			<main
				className="flex-1 h-full overflow-hidden flex flex-col relative"
				style={{
					paddingBottom: `${footerHeight}px`,
				}}
			>
				<div className="flex-1 h-full w-full overflow-y-auto overflow-x-hidden">
					<Suspense fallback={<AdminPageSkeleton />}>
						<Outlet
							context={{
								searchTerm,
								setSearchTerm,
								user,
								profile,
							}}
						/>
					</Suspense>
				</div>
			</main>

			{/* Bottom Navbar (Mobile Only) */}
			<div
				ref={bottomNavRef}
				className="fixed bottom-0 left-0 w-full z-50 sm:hidden"
			>
				<NavbarMobileAdmin profile={profile} />
			</div>

			{/* Admin Floating Chat Widget */}
			<AdminFloatingChat />

			{/* Floating Notification Bell for Admin (Universal) */}
			<div className="fixed top-24 right-5 z-[45]">
				<div className="bg-content1 rounded-full shadow-lg border border-divider">
					<NotificationBell userId={profile?.user_id ?? null} />
				</div>
			</div>

			{/* In-app Notification Alert */}
			{profile && <NotificationAlert userId={profile.user_id} />}
		</div>
	);
}
