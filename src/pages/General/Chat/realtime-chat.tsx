import { Send } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { ChatMessageItem } from "@/pages/General/Chat/chat-message";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import {
	useRealtimeChat,
	type ChatMessage,
} from "@/data/supabase/General/Chat/use-realtime-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/ContextProvider/AuthContext/AuthProvider";
import { supabase } from "@/config/supabaseclient";

interface RealtimeChatProps {
	customerId: string;
	onMessage?: (messages: ChatMessage[]) => void;
	messages?: ChatMessage[];
}

/**
 * Realtime chat component
 * @param customerId - The ID of the customer (user_id) to chat with.
 * @param onMessage - The callback function to handle the messages.
 * @param messages - The messages to display in the chat.
 * @returns The chat component
 */
export const RealtimeChat = ({
	customerId,
	onMessage,
	messages: initialMessages = [],
}: RealtimeChatProps) => {
	const { containerRef, scrollToBottom } = useChatScroll();
	const auth = useAuth();
	const user = auth?.user ?? null;
	const profile = auth?.profile ?? null;

	const [resolvedRoomId, setResolvedRoomId] = useState<string | null>(null);
	const [isResolving, setIsResolving] = useState(true);

	// Resolve or create ChatRoom for this customer
	useEffect(() => {
		async function resolveRoom() {
			if (!customerId) return;
			setIsResolving(true);

			try {
				// Try to find existing room for this customer
				const { data: existingRoom, error: fetchError } = await supabase
					.from("ChatRoom")
					.select("chat_room_id")
					.eq("user_id", customerId)
					.maybeSingle();

				if (fetchError) throw fetchError;

				if (existingRoom) {
					setResolvedRoomId(existingRoom.chat_room_id);
				} else {
					// Create new room if it doesn't exist
					const { data: newRoom, error: createError } = await supabase
						.from("ChatRoom")
						.insert({ user_id: customerId })
						.select("chat_room_id")
						.single();

					if (createError) throw createError;
					if (newRoom) setResolvedRoomId(newRoom.chat_room_id);
				}
			} catch (err) {
				console.error("Failed to resolve chat room:", err);
			} finally {
				setIsResolving(false);
			}
		}

		resolveRoom();
	}, [customerId]);

	const {
		messages: realtimeMessages,
		sendMessage,
		isConnected,
		hasMore,
		isLoadingMore,
		loadMoreMessages,
	} = useRealtimeChat({
		roomId: resolvedRoomId || "",
		userId: user?.id || "",
		username: profile?.user_name || "Unknown",
	});

	const [newMessage, setNewMessage] = useState("");

	// Merge realtime messages with initial messages
	const allMessages = useMemo(() => {
		const mergedMessages = [...initialMessages, ...realtimeMessages];
		// Remove duplicates based on message id
		const uniqueMessages = mergedMessages.filter(
			(message, index, self) =>
				index === self.findIndex((m) => m.id === message.id),
		);
		// Sort by creation date
		const sortedMessages = uniqueMessages.sort((a, b) =>
			(a.createdAt || "").localeCompare(b.createdAt || ""),
		);

		return sortedMessages;
	}, [initialMessages, realtimeMessages]);

	useEffect(() => {
		if (onMessage) {
			onMessage(allMessages);
		}
	}, [allMessages, onMessage]);

	// Keep track of scroll position when loading more messages
	const handleLoadMore = useCallback(async () => {
		if (!containerRef.current) return;

		const container = containerRef.current;
		const scrollHeightBefore = container.scrollHeight;
		const scrollTopBefore = container.scrollTop;

		await loadMoreMessages();

		// After messages are added, wait for render then adjust scroll
		requestAnimationFrame(() => {
			if (containerRef.current) {
				const scrollHeightAfter = containerRef.current.scrollHeight;
				const heightDiff = scrollHeightAfter - scrollHeightBefore;
				containerRef.current.scrollTop = scrollTopBefore + heightDiff;
			}
		});
	}, [loadMoreMessages, containerRef]);

	useEffect(() => {
		// Only auto-scroll to bottom if we are near the bottom or it's the initial load
		// and NOT during load more (handled by handleLoadMore)
		if (!isLoadingMore) {
			scrollToBottom();
		}
	}, [allMessages.length, scrollToBottom, isLoadingMore]);

	const handleSendMessage = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			if (!newMessage.trim() || !isConnected || !resolvedRoomId) return;

			sendMessage(newMessage);
			setNewMessage("");
		},
		[newMessage, isConnected, sendMessage, resolvedRoomId],
	);

	if (isResolving) {
		return (
			<div className="flex items-center justify-center h-full text-muted-foreground text-sm">
				Initializing chat...
			</div>
		);
	}

	if (!resolvedRoomId) {
		return (
			<div className="flex items-center justify-center h-full text-danger text-sm">
				Failed to establish chat connection.
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full min-h-0 w-full bg-background text-foreground antialiased">
			{/* Messages */}
			<div
				ref={containerRef}
				className="flex-1 overflow-y-auto p-4 space-y-4"
			>
				{hasMore && (
					<div className="flex justify-center py-2">
						<Button
							variant="ghost"
							size="sm"
							className="text-xs text-muted-foreground hover:text-success"
							onClick={handleLoadMore}
							disabled={isLoadingMore}
						>
							{isLoadingMore
								? "Loading older messages..."
								: "Load Previous Messages"}
						</Button>
					</div>
				)}

				{allMessages.length === 0 && !hasMore ? (
					<div className="text-center text-sm text-muted-foreground">
						No messages yet. Start the conversation!
					</div>
				) : null}
				<div className="space-y-1">
					{allMessages.map((message, index) => {
						const prevMessage =
							index > 0 ? allMessages[index - 1] : null;
						const showHeader =
							!prevMessage ||
							prevMessage.user.name !== message.user.name;

						return (
							<div
								key={message.id}
								className="animate-in fade-in slide-in-from-bottom-4 duration-300"
							>
								<ChatMessageItem
									message={message}
									isOwnMessage={message.user.id === user?.id}
									showHeader={showHeader}
								/>
							</div>
						);
					})}
				</div>
			</div>

			<form
				onSubmit={handleSendMessage}
				className="flex w-full gap-2 border-t border-border p-4"
			>
				<Input
					className={cn(
						"rounded-full bg-background text-sm transition-all duration-300",
						isConnected && newMessage.trim()
							? "w-[calc(100%-36px)]"
							: "w-full",
					)}
					type="text"
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					placeholder="Type a message..."
					disabled={!isConnected}
				/>
				{isConnected && newMessage.trim() && (
					<Button
						className="aspect-square rounded-full bg-success text-success-foreground hover:bg-success/80 animate-in fade-in slide-in-from-right-4 duration-300"
						type="submit"
						disabled={!isConnected}
					>
						<Send className="size-4" />
					</Button>
				)}
			</form>
		</div>
	);
};
