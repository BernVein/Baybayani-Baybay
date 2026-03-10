import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
	useRef,
} from "react";
import { supabase } from "@/config/supabaseclient";
import { Notification } from "@/model/notification";
import { useAuth } from "@/ContextProvider/AuthContext/AuthProvider";

interface NotificationContextType {
	notifications: Notification[];
	unreadCount: number;
	loading: boolean;
	markAsRead: (notificationId: string) => Promise<void>;
	markAllAsRead: () => Promise<void>;
	refresh: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
	undefined,
);

export function NotificationProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const auth = useAuth();
	const userId = auth?.user?.id;

	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const [loading, setLoading] = useState(true);
	const channelRef = useRef<any>(null);

	const fetchNotifications = useCallback(async () => {
		if (!userId) {
			setNotifications([]);
			setUnreadCount(0);
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			const { data, error } = await supabase
				.from("Notification")
				.select("*")
				.eq("user_id", userId)
				.order("created_at", { ascending: false })
				.limit(20);

			if (error) throw error;

			if (data) {
				setNotifications(data as Notification[]);
				const unread = data.filter((n) => !n.is_read).length;
				setUnreadCount(unread);
			}
		} catch (error) {
			console.error("Error in fetchNotifications:", error);
		} finally {
			setLoading(false);
		}
	}, [userId]);

	useEffect(() => {
		if (!userId) {
			setNotifications([]);
			setUnreadCount(0);
			setLoading(false);
			return;
		}

		let isMounted = true;

		// Initial fetch
		fetchNotifications();

		// Use a unique channel name per session to ensure clean subscription
		const channelName = `notifications-${userId}-${Math.floor(Math.random() * 1000)}`;

		const channel = supabase
			.channel(channelName)
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "Notification",
					filter: `user_id=eq.${userId}`,
				},
				(payload) => {
					if (!isMounted) return;

					const newNotif = payload.new as Notification;

					setNotifications((prev) => {
						const exists = prev.some(
							(n) =>
								n.notification_id === newNotif.notification_id,
						);
						if (exists) return prev;
						return [newNotif, ...prev.slice(0, 19)];
					});
					setUnreadCount((prev) => prev + 1);
				},
			)
			.subscribe((status, err) => {
				if (err) {
					console.error(
						`[NotificationProvider] Subscription error for user: ${userId}`,
						err,
					);
				}

				// re-fetch on subscription to ensure sync
				if (status === "SUBSCRIBED" && isMounted) {
					fetchNotifications();
				}
			});

		channelRef.current = channel;

		return () => {
			isMounted = false;
			if (channelRef.current) {
				supabase.removeChannel(channelRef.current);
				channelRef.current = null;
			}
		};
	}, [userId, fetchNotifications]);

	const markAsRead = async (notificationId: string) => {
		try {
			const { error } = await supabase
				.from("Notification")
				.update({ is_read: true })
				.eq("notification_id", notificationId);

			if (error) throw error;

			setNotifications((prev) =>
				prev.map((n) =>
					n.notification_id === notificationId
						? { ...n, is_read: true }
						: n,
				),
			);
			setUnreadCount((prev) => Math.max(0, prev - 1));
		} catch (error) {
			console.error("Error marking notification as read:", error);
		}
	};

	const markAllAsRead = async () => {
		if (!userId) return;

		try {
			const { error } = await supabase
				.from("Notification")
				.update({ is_read: true })
				.eq("user_id", userId)
				.eq("is_read", false);

			if (error) throw error;

			setNotifications((prev) =>
				prev.map((n) => ({ ...n, is_read: true })),
			);
			setUnreadCount(0);
		} catch (error) {
			console.error("Error marking all notifications as read:", error);
		}
	};

	return (
		<NotificationContext.Provider
			value={{
				notifications,
				unreadCount,
				loading,
				markAsRead,
				markAllAsRead,
				refresh: fetchNotifications,
			}}
		>
			{children}
		</NotificationContext.Provider>
	);
}

export const useNotifications = () => {
	const context = useContext(NotificationContext);
	if (context === undefined) {
		throw new Error(
			"useNotifications must be used within a NotificationProvider",
		);
	}
	return context;
};
