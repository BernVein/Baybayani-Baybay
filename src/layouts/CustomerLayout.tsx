import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/navbar/CustomerNav/navbarDesktop";
import { NavbarMobile } from "@/components/navbar/CustomerNav/navbarMobile";
import { useState } from "react";

export default function CustomerLayout() {
	const [searchTerm, setSearchTerm] = useState<string | null>(null);

	return (
		<div className="relative min-h-screen bg-background text-foreground">
			{/* Top Navbar */}
			<div className="fixed top-0 left-0 w-full z-50">
				<Navbar setSearchTerm={setSearchTerm} />
			</div>

			{/* Page content */}
			<main className="pt-[64px] pb-[64px]">
				<Outlet context={{ searchTerm, setSearchTerm }} />
			</main>

			{/* Bottom Navbar */}
			<div className="fixed bottom-0 left-0 w-full z-50 sm:hidden">
				<NavbarMobile />
			</div>
		</div>
	);
}
