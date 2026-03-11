import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/config/supabaseclient";

export interface ChatRoomListItem {
	chat_room_id: string;
	user_id: string;
	user_name: string;
	user_profile_img_url: string | null;
	login_user_name: string;
	user_role: string;
	last_message: string | null;
	last_message_at: string | null;
	unread_count: number;
}

export const useFetchAdminChatRooms = () => {
	const [rooms, setRooms] = useState<ChatRoomListItem[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchRooms = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			// Fetch all chat rooms with user info
			const { data: roomsData, error: roomsError } = await supabase.from(
				"ChatRoom",
			).select(`
					chat_room_id,
					user_id,
					User (
						user_name,
						user_profile_img_url,
						login_user_name,
						user_role
					)
				`);

			if (roomsError) throw roomsError;

			if (!roomsData) {
				setRooms([]);
				return;
			}

			// Fetch latest message and unread count for each room
			const finalRooms = await Promise.all(
				roomsData.map(async (room: any) => {
					const { data: lastMessages } = await supabase
						.from("ChatMessage")
						.select("message, created_at")
						.eq("chat_room_id", room.chat_room_id)
						.order("created_at", { ascending: false })
						.limit(1);

					const { count: unreadCount } = await supabase
						.from("ChatMessage")
						.select("*", { count: "exact", head: true })
						.eq("chat_room_id", room.chat_room_id)
						.eq("user_id", room.user_id) // Message from the customer
						.eq("is_read", false);

					return {
						chat_room_id: room.chat_room_id,
						user_id: room.user_id,
						user_name: room.User?.user_name || "Unknown",
						user_profile_img_url:
							room.User?.user_profile_img_url || null,
						login_user_name:
							room.User?.login_user_name || "unknown",
						user_role: room.User?.user_role || "User",
						last_message: lastMessages?.[0]?.message || null,
						last_message_at: lastMessages?.[0]?.created_at || null,
						unread_count: unreadCount || 0,
					};
				}),
			);

			// Sort by last_message_at descending
			finalRooms.sort((a, b) => {
				const timeA = a.last_message_at
					? new Date(a.last_message_at).getTime()
					: 0;
				const timeB = b.last_message_at
					? new Date(b.last_message_at).getTime()
					: 0;
				return timeB - timeA;
			});

			setRooms(finalRooms);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchRooms();

		// Real-time subscription to ChatMessage table to update list, band aid fix
		const channelId = Math.random().toString(36).substring(7);
		const channel = supabase
			.channel(`admin-chat-list-updates-${channelId}`)
			.on(
				"postgres_changes",
				{ event: "*", schema: "public", table: "ChatMessage" },
				() => {
					fetchRooms();
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [fetchRooms]);

	return { rooms, loading, error, refetch: fetchRooms };
};
