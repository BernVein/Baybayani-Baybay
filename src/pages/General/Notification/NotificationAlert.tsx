"use client";

import { useEffect, useState, useRef } from "react";
import { Alert, Button } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useNotifications } from "@/ContextProvider/NotificationContext/NotificationProvider";
import { X } from "lucide-react";
import { Notification } from "@/model/notification";
import { useNavigate } from "react-router-dom";

export function NotificationAlert() {
	const { notifications } = useNotifications();
	const [activeAlert, setActiveAlert] = useState<Notification | null>(null);
	const lastSeenId = useRef<string | null>(null);
	const navigate = useNavigate();

	const handleAlertClick = () => {
		if (activeAlert?.type === "announcement") {
			navigate("/announcements");
			setActiveAlert(null);
		}
	};

	useEffect(() => {
		if (notifications.length > 0) {
			const latest = notifications[0];

			// Only show alert if it's new and we haven't seen it in this session yet
			// and if it's less than 30 seconds old (avoid old ones popping on refresh)
			const isRecent =
				new Date().getTime() - new Date(latest.created_at).getTime() <
				30000;

			if (
				isRecent &&
				!latest.is_read &&
				latest.notification_id !== lastSeenId.current
			) {
				lastSeenId.current = latest.notification_id;
				setActiveAlert(latest);
				const timer = setTimeout(() => setActiveAlert(null), 8000);
				return () => clearTimeout(timer);
			}
		}
	}, [notifications]);

	return (
		<div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 pointer-events-none">
			<AnimatePresence>
				{activeAlert && (
					<motion.div
						initial={{ opacity: 0, y: -20, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						className="pointer-events-auto"
					>
						<Alert
							title={activeAlert.title}
							description={activeAlert.body}
							variant="flat"
							className="shadow-lg border-divider backdrop-blur-md bg-background/80 cursor-pointer"
							onClick={handleAlertClick}
							endContent={
								<Button
									isIconOnly
									size="sm"
									variant="light"
									onClick={(e) => {
										e.stopPropagation();
										setActiveAlert(null);
									}}
								>
									<X className="size-4" />
								</Button>
							}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
