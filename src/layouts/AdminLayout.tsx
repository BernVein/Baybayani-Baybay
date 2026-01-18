import { Outlet, useLocation } from "react-router-dom";
import { NavbarMobileAdmin } from "@/components/navbar/AdminNav/navbarMobileAdmin";
import { useState } from "react";
import { SidebarDesktopAdmin } from "@/components/navbar/AdminNav/sidebarDesktopAdmin";

export default function AdminLayout() {
	const [searchTerm, setSearchTerm] = useState<string | null>(null);
	const { pathname } = useLocation();

	const isDashboard = pathname.includes("/dashboard");

	return (
		<div
			className={`relative bg-background text-foreground ${
				isDashboard ? "min-h-screen" : "fixed inset-0 overflow-hidden"
			}`}
		>
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
