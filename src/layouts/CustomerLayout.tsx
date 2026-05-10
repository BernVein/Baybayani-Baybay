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

import { ClosingTimeBanner } from "@/components/General/ClosingTimeBanner";
import { AnnouncementModal } from "@/pages/Customer/Announcement/AnnouncementModal";
import { useClosingCancellations } from "@/data/supabase/Customer/Orders/useClosingCancellations";
import { ClosingCancellationModal } from "@/pages/Customer/OrdersPage/Components/ClosingCancellationModal";
import { PullToRefresh } from "@/components/General/PullToRefresh";

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
	const [refreshKey, setRefreshKey] = useState(0);
	const [navHeight, setNavHeight] = useState(0);
	const [footerHeight, setFooterHeight] = useState(0);
	const { cancelledOrders, markAsRead } = useClosingCancellations(user?.id);

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

			<FloatingChatProvider>
				<div className="relative h-[100dvh] w-full bg-background text-foreground overflow-hidden flex flex-col">
					{/* Top Navbar (+ closing time banner above it) */}
					<div ref={topNavRef} className="w-full z-50 flex-shrink-0">
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
							height: `calc(100dvh - ${navHeight + footerHeight}px)`,
						}}
						className="flex-1 overflow-hidden relative"
					>
						<PullToRefresh
							onRefresh={async () => {
								setRefreshKey((prev) => prev + 1);
								await new Promise((resolve) => setTimeout(resolve, 500));
							}}
						>
							<Suspense fallback={<CustomerPageSkeleton />}>
								<div key={refreshKey} className="h-full w-full">
									<Outlet
										context={{ searchTerm, setSearchTerm }}
									/>
								</div>
							</Suspense>
						</PullToRefresh>
					</main>

					{/* Bottom Navbar */}
					<div
						ref={bottomNavRef}
						className="w-full z-50 sm:hidden flex-shrink-0"
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

					{/* Announcement Modal (trigger on open) */}
					{user && <AnnouncementModal />}

					{/* Closing Cancellation Modal */}
					{user && (
						<ClosingCancellationModal
							isOpen={cancelledOrders.length > 0}
							cancelledOrders={cancelledOrders}
							onDismiss={markAsRead}
						/>
					)}
				</div>
			</FloatingChatProvider>

	);
}
