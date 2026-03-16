import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Capacitor } from "@capacitor/core";

interface PullToRefreshProps {
	onRefresh: () => Promise<void>;
	children: React.ReactNode;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
	onRefresh,
	children,
}) => {
	const [pullDistance, setPullDistance] = useState(0);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const startY = useRef(0);

	const PULL_THRESHOLD = 80;
	const MAX_PULL = 150;

	const handleTouchStart = (e: React.TouchEvent) => {
		if (containerRef.current?.scrollTop === 0) {
			startY.current = e.touches[0].pageY;
		} else {
			startY.current = -1;
		}
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		if (startY.current === -1 || isRefreshing) return;

		const currentY = e.touches[0].pageY;
		const diff = currentY - startY.current;

		if (diff > 0) {
			const damping = 0.5;
			const newDist = Math.min(diff * damping, MAX_PULL);
			setPullDistance(newDist);

			// Prevent scrolling when pulling down
			if (diff > 10 && e.cancelable) {
				e.preventDefault();
			}
		}
	};

	const handleTouchEnd = async () => {
		if (isRefreshing) return;

		if (pullDistance >= PULL_THRESHOLD) {
			setIsRefreshing(true);
			setPullDistance(PULL_THRESHOLD);
			await onRefresh();
			setIsRefreshing(false);
		}

		setPullDistance(0);
		startY.current = -1;
	};

	// Only enable for Android/Mobile Capacitor or if you want it everywhere
	const isAndroid = Capacitor.getPlatform() === "android";

	if (!isAndroid && process.env.NODE_ENV === "production") {
		return <>{children}</>;
	}

	return (
		<div
			ref={containerRef}
			className="relative w-full h-full overflow-y-auto"
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
		>
			<motion.div
				style={{
					height: pullDistance,
					opacity: pullDistance / PULL_THRESHOLD,
				}}
				className="flex items-center justify-center overflow-hidden bg-background/80 backdrop-blur-sm"
			>
				<div className="flex flex-col items-center gap-1">
					<motion.div
						animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
						transition={
							isRefreshing
								? {
										duration: 1,
										repeat: Infinity,
										ease: "linear",
									}
								: {}
						}
					>
						<Loader2
							className={`w-6 h-6 ${isRefreshing ? "text-success" : "text-default-500"}`}
						/>
					</motion.div>
					{pullDistance >= PULL_THRESHOLD && !isRefreshing && (
						<span className="text-xs text-default-500 font-medium animate-pulse">
							Release to refresh
						</span>
					)}
				</div>
			</motion.div>
			<motion.div
				animate={{ y: isRefreshing ? 0 : 0 }} // Keep content stable or add slight bounce
				className="relative z-10"
			>
				{children}
			</motion.div>
		</div>
	);
};
