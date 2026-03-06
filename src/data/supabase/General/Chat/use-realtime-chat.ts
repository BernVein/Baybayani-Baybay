"use client";

import { useCallback, useEffect, useState } from "react";
import { App as CapacitorApp } from "@capacitor/app";

import { supabase } from "@/config/supabaseclient";

export interface ChatMessage {
	id: string;
	content: string;
	user: { id: string; name: string };
	createdAt: string;
	status?: "sending" | "sent" | "error";
}

interface UseRealtimeChatProps {
	roomId: string;
	userId: string;
	username: string;
}

export function useRealtimeChat({
	roomId,
	userId,
	username,
}: UseRealtimeChatProps) {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [isConnected, setIsConnected] = useState(false);
	const [isFocused, setIsFocused] = useState(true);

	// App focus listener
	useEffect(() => {
		let isMounted = true;

		const setupListener = async () => {
			const listener = await CapacitorApp.addListener(
				"appStateChange",
				(state) => {
					if (isMounted) setIsFocused(state.isActive);
				},
			);

			return listener;
		};

		let savedListener: any;

		setupListener().then((l) => (savedListener = l));

		return () => {
			isMounted = false;
			if (savedListener) {
				savedListener.remove().catch(() => {});
			}
		};
	}, []);

	// Load initial messages
	useEffect(() => {
		if (!roomId) return;

		const loadMessages = async () => {
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
					data.map((msg: any) => ({
						id: msg.chat_message_id,
						content: msg.message,
						user: {
							id: msg.user_id,
							name: msg.User?.user_name || "Unknown",
						},
						createdAt: msg.created_at,
					})),
				);
			}
		};

		loadMessages();
	}, [roomId]);

	// Subscribe to realtime
	useEffect(() => {
		if (!roomId) return;

		let isMounted = true;
		let channelHandle: any;

		const setupChannel = async () => {
			const channel = supabase.channel(`chat-${roomId}`).on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "ChatMessage",
					filter: `chat_room_id=eq.${roomId}`,
				},
				async (payload) => {
					const newMsg = payload.new;

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
						user: { id: newMsg.user_id, name: senderName },
						createdAt: newMsg.created_at,
					};

					setMessages((prev) => {
						if (prev.some((m) => m.id === formattedMsg.id))
							return prev;

						return [...prev, formattedMsg];
					});
				},
			);

			await channel.subscribe();
			if (!isMounted) {
				await supabase.removeChannel(channel).catch(() => {});
			}
			channelHandle = channel;
			setIsConnected(true);
		};

		setupChannel();

		return () => {
			isMounted = false;
			if (channelHandle)
				supabase.removeChannel(channelHandle).catch(() => {});
		};
	}, [roomId, userId, username]);

	// Send message
	const sendMessage = useCallback(
		async (content: string) => {
			if (!isConnected) return;

			const tempId = `temp-${Date.now()}`;
			const optimisticMsg: ChatMessage = {
				id: tempId,
				content,
				user: { id: userId, name: username },
				createdAt: new Date().toISOString(),
				status: "sending",
			};

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
				setMessages((prev) =>
					prev.map((m) =>
						m.id === tempId ? { ...m, status: "error" } : m,
					),
				);
				console.error("Failed to send message:", error.message);
			} else if (data) {
				const realId = data.chat_message_id;

				setMessages((prev) => {
					if (prev.some((m) => m.id === realId))
						return prev.filter((m) => m.id !== tempId);

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

				// Focus is managed natively by FCM (it doesn't show system notifications if foregrounded)
				try {
					const { data: roomData } = await supabase
						.from("ChatRoom")
						.select("user_id")
						.eq("chat_room_id", roomId)
						.single();

					if (roomData) {
						const customerId = roomData.user_id;
						let recipients: string[] = [];

						if (userId === customerId) {
							// Sender is Customer. Notify Admins.
							const { data: admins } = await supabase
								.from("User")
								.select("user_id")
								.in("user_role", ["Admin"]);

							if (admins) {
								recipients = admins.map((a: any) => a.user_id);
							}
						} else {
							// Sender is Admin. Notify Customer.
							recipients = [customerId];
						}

						for (const recipientId of recipients) {
							await fetch(
								"https://mnitpbgrbldkrhlzmnpy.supabase.co/functions/v1/send-push-notification",
								{
									method: "POST",
									headers: {
										"Content-Type": "application/json",
										apikey: import.meta.env
											.VITE_SUPABASE_ANON_KEY,
										Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
									},
									body: JSON.stringify({
										userId: recipientId,
										title: username,
										body: content,
										data: { roomId, type: "chat_message" },
									}),
								},
							).catch((e) =>
								console.error("Failed to send push:", e),
							);
						}
					}
				} catch (err) {
					console.error("Error sending push notifications:", err);
				}
			}
		},
		[roomId, userId, username, isConnected, isFocused],
	);

	return { messages, sendMessage, isConnected };
}
