import { Outlet, useLocation } from "react-router-dom";
import { NavbarMobileAdmin } from "@/components/navbar/AdminNav/navbarMobileAdmin";
import { useState, useEffect } from "react";
import { SidebarDesktopAdmin } from "@/components/navbar/AdminNav/sidebarDesktopAdmin";
import useIsMobile from "@/lib/isMobile";

export default function AdminLayout() {
	const [searchTerm, setSearchTerm] = useState<string | null>(null);
	const location = useLocation();
	const isDashboard = location.pathname.toLowerCase().includes("dashboard");
	const isMobile = useIsMobile();

	useEffect(() => {
		if (isMobile && !isDashboard) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isMobile, isDashboard]);

	return (
		<div className="relative min-h-screen bg-background text-foreground">
			<div className="fixed left-0 w-full h-full hidden sm:block">
				<SidebarDesktopAdmin />
			</div>

			{/* Page content */}
			<main className="sm:pl-[330px] mb-20 sm:mb-0">
				<Outlet context={{ searchTerm, setSearchTerm }} />
			</main>

			{/* Bottom Navbar */}
			<div className="fixed bottom-0 left-0 w-full z-50 sm:hidden">
				<NavbarMobileAdmin />
			</div>
		</div>
	);
}
