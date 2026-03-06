"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/config/supabaseclient";

export interface ChatMessage {
	id: string;
	content: string;
	user: {
		id: string;
		name: string;
	};
	createdAt: string;
	status?: "sending" | "sent" | "error";
}

interface UseRealtimeChatProps {
	roomId: string; // corresponds to chat_room_id
	userId: string; // current user sending messages
	username: string; // name of the current user
}

export function useRealtimeChat({
	roomId,
	userId,
	username,
}: UseRealtimeChatProps) {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [isConnected, setIsConnected] = useState(false);

	// Load initial messages
	useEffect(() => {
		async function loadMessages() {
			if (!roomId) return;

			const { data, error } = await supabase
				.from("ChatMessage")
				.select(
					`
					chat_message_id,
					message,
					user_id,
					created_at,
					User(user_name)
					`,
				)
				.eq("chat_room_id", roomId)
				.order("created_at", { ascending: true });

			if (error) {
				console.error("Error loading messages:", error);
				return;
			}

			if (data) {
				setMessages(
					data.map(
						(msg: any) =>
							({
								id: msg.chat_message_id,
								content: msg.message,
								user: {
									id: msg.user_id,
									name: msg.User?.user_name || "Unknown",
								},
								createdAt: msg.created_at,
							}) as ChatMessage,
					),
				);
			}
		}

		loadMessages();
	}, [roomId]);

	// Subscribe to realtime database changes
	useEffect(() => {
		if (!roomId) return;

		const channel = supabase
			.channel(`chat-${roomId}`)
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "ChatMessage",
					filter: `chat_room_id=eq.${roomId}`,
				},
				async (payload) => {
					const newMsg = payload.new;

					// Since realtime doesn't join tables, we fetch the username if it's not the current user
					let senderName = username;
					if (newMsg.user_id !== userId) {
						const { data: userData } = await supabase
							.from("User")
							.select("user_name")
							.eq("user_id", newMsg.user_id)
							.single();
						if (userData) senderName = userData.user_name;
					}

					const formattedMsg: ChatMessage = {
						id: newMsg.chat_message_id,
						content: newMsg.message,
						user: {
							id: newMsg.user_id,
							name: senderName,
						},
						createdAt: newMsg.created_at,
					};

					setMessages((prev) => {
						if (prev.some((m) => m.id === formattedMsg.id))
							return prev;
						return [...prev, formattedMsg];
					});
				},
			)
			.subscribe((status) => {
				setIsConnected(status === "SUBSCRIBED");
			});

		return () => {
			supabase.removeChannel(channel);
		};
	}, [roomId, userId, username]);

	// Send a message
	const sendMessage = useCallback(
		async (content: string) => {
			if (!isConnected) return;

			const tempId = `temp-${Date.now()}`;
			const optimisticMsg: ChatMessage = {
				id: tempId,
				content: content,
				user: {
					id: userId,
					name: username,
				},
				createdAt: new Date().toISOString(),
				status: "sending",
			};

			// Add optimistic message
			setMessages((prev) => [...prev, optimisticMsg]);

			const { data, error } = await supabase
				.from("ChatMessage")
				.insert({
					chat_room_id: roomId,
					user_id: userId,
					message: content,
				})
				.select()
				.single();

			if (error) {
				console.error("Failed to send message:", error.message);
				setMessages((prev) =>
					prev.map((m) =>
						m.id === tempId ? { ...m, status: "error" } : m,
					),
				);
			} else if (data) {
				const realId = data.chat_message_id;
				setMessages((prev) => {
					// Check if realtime already added this message
					if (prev.some((m) => m.id === realId)) {
						return prev.filter((m) => m.id !== tempId);
					}
					// Otherwise update the temp message with real data
					return prev.map((m) =>
						m.id === tempId
							? {
									...m,
									id: realId,
									status: "sent",
									createdAt: data.created_at,
								}
							: m,
					);
				});
			}
		},
		[roomId, userId, username, isConnected],
	);

	return { messages, sendMessage, isConnected };
}
