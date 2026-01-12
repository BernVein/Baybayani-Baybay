import { Outlet } from "react-router-dom";
import { NavbarMobile } from "@/components/navbar/AdminNav/navbarMobileAdmin";
import { useState } from "react";
import { SidebarDesktopAdmin } from "@/components/navbar/AdminNav/sidebarDesktopAdmin";

export default function AdminLayout() {
	const [searchTerm, setSearchTerm] = useState<string | null>(null);

	return (
		<div className="relative min-h-screen bg-background text-foreground">
			<div className="fixed left-0 h-full z-40 hidden sm:block">
				<SidebarDesktopAdmin />
			</div>

			{/* Page content */}
			<main className="pt-8 pb-[64px] pl-[250px]">
				<Outlet context={{ searchTerm, setSearchTerm }} />
			</main>

			{/* Bottom Navbar */}
			<div className="fixed bottom-0 left-0 w-full z-50 sm:hidden">
				<NavbarMobile />
			</div>
		</div>
	);
}
