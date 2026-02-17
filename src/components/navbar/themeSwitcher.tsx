import { Switch, Button } from "@heroui/react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

import { MoonFilledIcon, SunFilledIcon } from "../icons";

interface ThemeSwitcherProps {
	isIconOnly?: boolean;
}

export default function ThemeSwitcher({
	isIconOnly = false,
}: ThemeSwitcherProps) {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);
	if (!mounted) return null;

	const isDark = theme === "dark";

	const toggleTheme = () => {
		setTheme(isDark ? "light" : "dark");
	};

	// ICON ONLY MODE
	if (isIconOnly) {
		return (
			<Button
				onPress={toggleTheme}
				variant="light"
				className="w-10 h-10 rounded-full transition-colors"
				startContent={isDark ? <SunFilledIcon /> : <MoonFilledIcon />}
				isIconOnly
			/>
		);
	}

	// NORMAL SWITCH MODE
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
