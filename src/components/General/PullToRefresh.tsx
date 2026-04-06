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
		// Disable if a modal (dialog) is present or body is scroll-locked
		const isModalOpen =
			!!document.querySelector('section[role="dialog"]') ||
			document.body.style.overflow === "hidden";

		if (isModalOpen) {
			startY.current = -1;
			return;
		}

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

			// Prevent browser default pull-to-refresh/scroll ONLY if we've moved enough
			// to committed to our custom pull gesture.
			if (diff > 5 && e.cancelable) {
				e.preventDefault();
			}
		} else {
			// If moving finger up (scrolling down), immediately reset pull distance
			// to allow native scroll to take over without interference.
			if (pullDistance > 0) {
				setPullDistance(0);
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
	const isProduction = process.env.NODE_ENV === "production";
	const enablePull = isAndroid || !isProduction;

	return (
		<div
			ref={containerRef}
			style={{ touchAction: enablePull ? "pan-y" : "auto" }}
			className="relative w-full h-full overflow-y-auto"
			onTouchStart={enablePull ? handleTouchStart : undefined}
			onTouchMove={enablePull ? handleTouchMove : undefined}
			onTouchEnd={enablePull ? handleTouchEnd : undefined}
		>
			{enablePull && (
				<motion.div
					style={{
						height: pullDistance,
						opacity: pullDistance / PULL_THRESHOLD,
					}}
					className="flex items-center justify-center overflow-hidden bg-background/80 backdrop-blur-sm"
				>
					<div className="flex flex-col items-center gap-1">
						<motion.div
							animate={
								isRefreshing ? { rotate: 360 } : { rotate: 0 }
							}
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
			)}
			<motion.div
				animate={{ y: isRefreshing ? 0 : 0 }} // Keep content stable or add slight bounce
				className="relative z-10"
			>
				{children}
			</motion.div>
		</div>
	);
};
