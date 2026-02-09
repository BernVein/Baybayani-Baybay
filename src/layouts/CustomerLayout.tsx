import { Outlet } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import { Navbar } from "@/components/navbar/CustomerNav/navbarDesktop";
import { NavbarMobile } from "@/components/navbar/CustomerNav/navbarMobile";

export default function CustomerLayout() {
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
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Top Navbar */}
      <div ref={topNavRef} className="fixed top-0 left-0 w-full z-50">
        <Navbar setSearchTerm={setSearchTerm} />
      </div>

      {/* Page content */}
      <main
        style={{
          paddingTop: `${navHeight}px`,
          paddingBottom: `${footerHeight}px`,
        }}
      >
        <Outlet context={{ searchTerm, setSearchTerm }} />
      </main>

      {/* Bottom Navbar */}
      <div
        ref={bottomNavRef}
        className="fixed bottom-0 left-0 w-full z-50 sm:hidden"
      >
        <NavbarMobile />
      </div>
    </div>
  );
}
