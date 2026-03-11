import { X, Minus, MessageCircle } from "lucide-react";
import { useState } from "react";

import { BaybayaniLogo } from "@/components/icons";
import { RealtimeChat } from "@/pages/General/Chat/realtime-chat";
import { useAuth } from "@/ContextProvider/AuthContext/AuthProvider";
import { useFloatingChat } from "@/ContextProvider/FloatingChatContext/FloatingChatContext";
import { useLoginModal } from "@/ContextProvider/LoginModalContext/LoginModalContext";
import { useFetchCustomerUnreadStatus } from "@/data/supabase/Customer/Chat/useFetchCustomerUnreadStatus";
import { supabase } from "@/config/supabaseclient";
import { useEffect } from "react";

export function FloatingChat() {
	const { isOpen, openChat, closeChat } = useFloatingChat();
	const [minimized, setMinimized] = useState(false);
	const auth = useAuth();
	const user = auth?.user ?? null;
	const profile = auth?.profile ?? null;
	const { openLoginModal } = useLoginModal();
	const { hasUnread, refetch: refetchUnread } =
		useFetchCustomerUnreadStatus();

	// Mark messages as read when chat is opened
	useEffect(() => {
		if (isOpen && !minimized && user?.id) {
			const markAsRead = async () => {
				try {
					// Get room ID
					const { data: roomData } = await supabase
						.from("ChatRoom")
						.select("chat_room_id")
						.eq("user_id", user.id)
						.maybeSingle();

					if (roomData) {
						await supabase
							.from("ChatMessage")
							.update({ is_read: true })
							.eq("chat_room_id", roomData.chat_room_id)
							.neq("user_id", user.id)
							.eq("is_read", false);

						refetchUnread();
					}
				} catch (err) {
					console.error("Failed to mark messages as read:", err);
				}
			};
			markAsRead();
		}
	}, [isOpen, minimized, user?.id, refetchUnread, hasUnread]);

	const handleFabClick = () => {
		if (!user) {
			openLoginModal();
			return;
		}
		if (isOpen) {
			closeChat();
			setMinimized(false);
		} else {
			openChat();
			setMinimized(false);
		}
	};

	const username = profile?.user_name ?? "";

	return (
		<>
			{/* Chat Panel */}
			<div
				aria-hidden={!isOpen || minimized}
				className={[
					"fixed bottom-[5.5rem] sm:bottom-6 right-4 sm:right-6 z-[40]",
					"w-[calc(100vw-2rem)] sm:w-[360px]",
					"rounded-2xl overflow-hidden shadow-2xl border border-divider",
					"bg-content1",
					"flex flex-col",
					"transition-all duration-300 origin-bottom-right",
					isOpen && !minimized
						? "opacity-100 scale-100 pointer-events-auto"
						: "opacity-0 scale-95 pointer-events-none",
				].join(" ")}
				style={{ height: "520px" }}
			>
				{/* Panel Header */}
				<div className="flex items-center justify-between px-4 py-3 bg-[#146A38] text-white flex-shrink-0">
					<div className="flex items-center gap-2">
						<BaybayaniLogo className="size-6 brightness-0 invert" />
						<div className="flex flex-col leading-tight">
							<span className="font-bold text-sm">
								Baybayani Support
							</span>
							<span className="text-xs text-green-200">
								Chat with our admin team
							</span>
						</div>
					</div>
					<div className="flex items-center gap-1">
						<button
							aria-label="Minimize chat"
							className="rounded-full p-1 hover:bg-white/20 transition-colors"
							onClick={() => setMinimized(true)}
						>
							<Minus className="size-4" />
						</button>
						<button
							aria-label="Close chat"
							className="rounded-full p-1 hover:bg-white/20 transition-colors"
							onClick={() => {
								closeChat();
								setMinimized(false);
							}}
						>
							<X className="size-4" />
						</button>
					</div>
				</div>

				{/* Chat Body */}
				<div className="flex-1 min-h-0 overflow-hidden flex flex-col">
					{user && username ? (
						<RealtimeChat customerId={user.id} />
					) : (
						<div className="flex items-center justify-center h-full text-default-400 text-sm px-4 text-center">
							Please log in to chat with our support team.
						</div>
					)}
				</div>
			</div>

			{/* Minimized pill */}
			{isOpen && minimized && (
				<button
					className={[
						"fixed bottom-[5.5rem] sm:bottom-6 right-4 sm:right-6 z-[40]",
						"flex items-center gap-2 px-4 py-2 rounded-full shadow-xl",
						"bg-[#146A38] text-white text-sm font-semibold",
						"hover:bg-[#1a8a48] transition-colors duration-200",
						"animate-in fade-in slide-in-from-bottom-2 duration-200",
					].join(" ")}
					onClick={() => setMinimized(false)}
				>
					<MessageCircle className="size-4" />
					Baybayani Support
					{hasUnread && (
						<span className="absolute -top-1 -right-1 flex h-3 w-3">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
						</span>
					)}
				</button>
			)}

			{/* FAB Bubble */}
			{!isOpen && (
				<button
					aria-label="Open support chat"
					className={[
						"fixed bottom-[5.5rem] sm:bottom-6 right-4 sm:right-6 z-[40]",
						"size-14 rounded-full shadow-2xl",
						"bg-[#146A38] text-white",
						"flex items-center justify-center",
						"hover:bg-[#1a8a48] active:scale-95",
						"transition-all duration-200",
						"animate-in fade-in zoom-in-95 duration-300",
					].join(" ")}
					onClick={handleFabClick}
				>
					<MessageCircle className="size-7" />
					{hasUnread && (
						<span className="absolute top-0 right-0 flex h-4 w-4">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
						</span>
					)}
				</button>
			)}
		</>
	);
}
