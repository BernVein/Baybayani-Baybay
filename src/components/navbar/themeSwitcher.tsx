import { Switch } from "@heroui/react";
import { MoonFilledIcon, SunFilledIcon } from "../icons";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
export default function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);
	if (!mounted) return null;
	const isDark = theme === "dark";
	return (
		<Switch
			isSelected={isDark}
			onValueChange={(checked) => setTheme(checked ? "dark" : "light")}
			color="default"
			size="sm"
			thumbIcon={({ isSelected, className }) =>
				isSelected ? (
					<MoonFilledIcon className={className} />
				) : (
					<SunFilledIcon className={className} />
				)
			}
		/>
	);
}
