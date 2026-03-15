import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/config/supabaseclient";
import { Notification } from "@/model/notification";
import { useNotifications } from "@/ContextProvider/NotificationContext/NotificationProvider";

export function useAllNotifications(
	userId: string | null | undefined,
	page: number,
	pageSize: number,
) {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(false);
	const { refresh: refreshGlobal } = useNotifications();

	const fetchAllNotifications = useCallback(async () => {
		if (!userId) return;

		try {
			setLoading(true);
			const from = (page - 1) * pageSize;
			const to = from + pageSize - 1;

			const { data, count, error } = await supabase
				.from("Notification")
				.select("*", { count: "exact" })
				.eq("user_id", userId)
				.order("created_at", { ascending: false })
				.range(from, to);

			if (error) throw error;

			if (data) {
				setNotifications(data as Notification[]);
			}
			if (count !== null) {
				setTotal(count);
			}
		} catch (error) {
			console.error("Error fetching all notifications:", error);
		} finally {
			setLoading(false);
		}
	}, [userId, page, pageSize]);

	useEffect(() => {
		fetchAllNotifications();
	}, [fetchAllNotifications]);

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
			// Refresh global count in provider
			refreshGlobal();
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
			// Refresh global count in provider
			refreshGlobal();
		} catch (error) {
			console.error("Error marking all notifications as read:", error);
		}
	};

	return {
		notifications,
		total,
		loading,
		markAsRead,
		markAllAsRead,
		refresh: fetchAllNotifications,
	};
}
