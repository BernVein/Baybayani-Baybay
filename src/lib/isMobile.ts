import { useState, useEffect } from "react";

/**
 * True when the viewport is narrower than `breakpoint` px.
 * Default 640 (Tailwind `sm`) = phones. Pass 1024 (Tailwind `lg`) to also
 * treat portrait tablets as compact, e.g. for the admin sidebar.
 */
export default function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false,
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}
