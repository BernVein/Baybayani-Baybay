import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/config/supabaseclient";
import { useAuth } from "@/ContextProvider/AuthContext/AuthProvider";

export const useFetchCustomerUnreadStatus = () => {
	const [hasUnread, setHasUnread] = useState(false);
	const auth = useAuth();
	const user = auth?.user;

	const checkUnread = useCallback(async () => {
		if (!user?.id) return;

		try {
			// Get the room ID for this customer
			const { data: roomData } = await supabase
				.from("ChatRoom")
				.select("chat_room_id")
				.eq("user_id", user.id)
				.maybeSingle();

			if (!roomData) {
				setHasUnread(false);
				return;
			}

			// Check for unread messages NOT from the customer
			const { count, error } = await supabase
				.from("ChatMessage")
				.select("*", { count: "exact", head: true })
				.eq("chat_room_id", roomData.chat_room_id)
				.neq("user_id", user.id)
				.eq("is_read", false);

			if (error) throw error;
			setHasUnread((count ?? 0) > 0);
		} catch (err) {
			console.error("Failed to fetch customer unread status:", err);
		}
	}, [user?.id]);

	useEffect(() => {
		if (!user?.id) return;

		checkUnread();

		// Subscribe to ChatMessage changes for the user's room
		const channelId = Math.random().toString(36).substring(7);
		const channel = supabase
			.channel(`customer-unread-${user.id}-${channelId}`)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "ChatMessage",
				},
				() => {
					checkUnread();
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [user?.id, checkUnread]);

	return { hasUnread, refetch: checkUnread };
};
