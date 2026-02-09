import type { NavigateOptions } from "react-router-dom";

import { ToastProvider } from "@heroui/react";
import { HeroUIProvider } from "@heroui/system";
import { useHref, useNavigate } from "react-router-dom";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import useIsMobile from "./lib/isMobile";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <NextThemesProvider attribute="class" defaultTheme="dark">
      <HeroUIProvider navigate={navigate} useHref={useHref}>
        <ToastProvider
          placement="bottom-center"
          toastOffset={isMobile ? 80 : 0}
          toastProps={{
            timeout: 4000,
            classNames: {
              closeButton:
                "opacity-100 absolute right-4 top-1/2 -translate-y-1/2",
            },
          }}
        />
        {children}
      </HeroUIProvider>
    </NextThemesProvider>
  );
}
