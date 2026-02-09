import { Switch } from "@heroui/react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

import { MoonFilledIcon, SunFilledIcon } from "../icons";
export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const isDark = theme === "dark";

  return (
    <Switch
      color="default"
      isSelected={isDark}
      size="sm"
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <MoonFilledIcon className={className} />
        ) : (
          <SunFilledIcon className={className} />
        )
      }
      onValueChange={(checked) => setTheme(checked ? "dark" : "light")}
    />
  );
}
