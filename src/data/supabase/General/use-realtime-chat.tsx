"use client";

import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/config/supabaseclient";

interface UseRealtimeChatProps {
	roomName: string;
	username: string;
}

export interface ChatMessage {
	id: string;
	content: string;
	user: {
		name: string;
	};
	createdAt: string;
}

const EVENT_MESSAGE_TYPE = "message";

// crypto.randomUUID() requires a secure context (HTTPS/localhost).
// This polyfill uses crypto.getRandomValues which works over plain HTTP too.
function generateUUID(): string {
	if (typeof crypto !== "undefined" && crypto.getRandomValues) {
		const bytes = new Uint8Array(16);
		crypto.getRandomValues(bytes);
		bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
		bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant
		const hex = Array.from(bytes).map((b) =>
			b.toString(16).padStart(2, "0"),
		);
		return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10).join("")}`;
	}
	// Final fallback
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
	});
}

export function useRealtimeChat({ roomName, username }: UseRealtimeChatProps) {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [channel, setChannel] = useState<ReturnType<
		typeof supabase.channel
	> | null>(null);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		const newChannel = supabase.channel(roomName);

		newChannel
			.on("broadcast", { event: EVENT_MESSAGE_TYPE }, (payload) => {
				setMessages((current) => [
					...current,
					payload.payload as ChatMessage,
				]);
			})
			.subscribe(async (status) => {
				if (status === "SUBSCRIBED") {
					setIsConnected(true);
				} else {
					setIsConnected(false);
				}
			});

		setChannel(newChannel);

		return () => {
			supabase.removeChannel(newChannel);
		};
	}, [roomName, username]);

	const sendMessage = useCallback(
		async (content: string) => {
			if (!channel || !isConnected) return;

			const message: ChatMessage = {
				id: generateUUID(),
				content,
				user: {
					name: username,
				},
				createdAt: new Date().toISOString(),
			};

			// Update local state immediately for the sender
			setMessages((current) => [...current, message]);

			await channel.send({
				type: "broadcast",
				event: EVENT_MESSAGE_TYPE,
				payload: message,
			});
		},
		[channel, isConnected, username],
	);

	return { messages, sendMessage, isConnected };
}
