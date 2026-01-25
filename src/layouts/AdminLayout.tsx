import { Outlet } from "react-router-dom";
import { NavbarMobileAdmin } from "@/components/navbar/AdminNav/navbarMobileAdmin";
import { useState, useRef, useEffect } from "react";
import { SidebarDesktopAdmin } from "@/components/navbar/AdminNav/sidebarDesktopAdmin";

export default function AdminLayout() {
    const [searchTerm, setSearchTerm] = useState<string | null>(null);
    const bottomNavRef = useRef<HTMLDivElement>(null);
    const [footerHeight, setFooterHeight] = useState(0);

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
                <SidebarDesktopAdmin />
            </div>

            {/* Main Content Area */}
            <main
                className="flex-1 h-full overflow-hidden flex flex-col relative"
                style={{
                    paddingBottom: `${footerHeight}px`,
                }}
            >
                <div className="flex-1 h-full w-full overflow-y-auto overflow-x-hidden">
                    <Outlet context={{ searchTerm, setSearchTerm }} />
                </div>
            </main>

            {/* Bottom Navbar (Mobile Only) */}
            <div
                ref={bottomNavRef}
                className="fixed bottom-0 left-0 w-full z-50 sm:hidden"
            >
                <NavbarMobileAdmin />
            </div>
        </div>
    );
}
