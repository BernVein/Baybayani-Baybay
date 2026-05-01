import { X, Minus, MessageCircle, ChevronLeft, Search } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Avatar, Skeleton } from "@heroui/react";
import { supabase } from "@/config/supabaseclient";

import { BaybayaniLogo } from "@/components/icons";
import { RealtimeChat } from "@/pages/General/Chat/realtime-chat";
import { useAuth } from "@/ContextProvider/AuthContext/AuthProvider";
import { useFetchAdminChatRooms } from "@/data/supabase/Admin/Chat/useFetchAdminChatRooms";
import { formatDistanceToNow } from "date-fns";

//  Types
interface SelectedUser {
	id: string;
	name: string;
}

//  User Picker Panel
//  User Picker Panel
function UserPickerPanel({
	rooms,
	loading,
	onSelect,
}: {
	rooms: any[] | null;
	loading: boolean;
	onSelect: (user: SelectedUser) => void;
}) {
	const [search, setSearch] = useState("");
	const [discoveredUsers, setDiscoveredUsers] = useState<any[]>([]);
	const [isSearching, setIsSearching] = useState(false);

	const auth = useAuth();
	const currentUserId = auth?.user?.id;

	// Search for users who don't have a room yet
	useEffect(() => {
		if (!search.trim()) {
			setDiscoveredUsers([]);
			setIsSearching(false);
			return;
		}

		setIsSearching(true);
		const delayDebounceFn = setTimeout(async () => {
			try {
				const { data, error } = await supabase
					.from("User")
					.select(
						"user_id, user_name, user_profile_img_url, login_user_name, user_role",
					)
					.or(`user_name.ilike.%${search}%,login_user_name.ilike.%${search}%`)
					.eq("is_soft_deleted", false)
					.neq("user_id", currentUserId || "")
					.limit(5);

				if (error) throw error;

				// Filter out users who already have a room in the 'rooms' list to avoid duplicates
				const existingUserIds = new Set(
					rooms?.map((r) => r.user_id) || [],
				);
				const newUsers = (data || []).filter(
					(u) => !existingUserIds.has(u.user_id),
				);

				setDiscoveredUsers(newUsers);
			} catch (err) {
				console.error("Search failed:", err);
			} finally {
				setIsSearching(false);
			}
		}, 500);

		return () => clearTimeout(delayDebounceFn);
	}, [search, rooms, currentUserId]);

	const filteredRooms = useMemo(() => {
		const items = rooms ?? [];
		if (!search.trim()) return items;
		const q = search.toLowerCase();
		return items.filter(
			(r) =>
				r.user_name.toLowerCase().includes(q) ||
				r.login_user_name.toLowerCase().includes(q),
		);
	}, [rooms, search]);

	const noResults =
		search.trim() &&
		filteredRooms.length === 0 &&
		discoveredUsers.length === 0 &&
		!isSearching;

	return (
		<div className="flex flex-col h-full min-h-0">
			{/* Search bar */}
			<div className="px-3 py-2 border-b border-divider flex-shrink-0">
				<div className="flex items-center gap-2 bg-default-100 rounded-xl px-3 py-1.5">
					<Search className="size-4 text-default-400 shrink-0" />
					<input
						className="bg-transparent flex-1 text-sm outline-none placeholder:text-default-400"
						placeholder="Search users…"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					{isSearching && (
						<div className="size-3 rounded-full border-2 border-success border-t-transparent animate-spin shrink-0" />
					)}
				</div>
			</div>

			{/* User list */}
			<div className="flex-1 min-h-0 overflow-y-auto px-2 py-2 space-y-0.5">
				{loading && rooms === null ? (
					Array.from({ length: 5 }).map((_, i) => (
						<div
							key={i}
							className="flex items-center gap-3 px-2 py-2"
						>
							<Skeleton className="rounded-full size-9 shrink-0" />
							<div className="flex flex-col gap-1 flex-1">
								<Skeleton className="h-3.5 w-2/3 rounded-lg" />
								<Skeleton className="h-3 w-1/2 rounded-lg" />
							</div>
						</div>
					))
				) : noResults ? (
					<div className="flex items-center justify-center h-full text-default-400 text-sm py-8">
						No users found
					</div>
				) : (
					<>
						{/* Existing Rooms */}
						{filteredRooms.map((u) => (
							<button
								key={u.chat_room_id}
								className="w-full flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-default-100 transition-colors text-left group"
								onClick={() =>
									onSelect({
										id: u.user_id!,
										name: u.user_name,
									})
								}
							>
								<div className="relative">
									<Avatar
										className="shrink-0 size-9"
										src={
											u.user_profile_img_url || undefined
										}
										name={u.user_name}
									/>
								</div>
								<div className="flex flex-col min-w-0 flex-1">
									<div className="flex items-center justify-between gap-2">
										<div className="flex items-center gap-2 min-w-0">
											<span className="font-semibold text-sm truncate">
												{u.user_name}
											</span>
											{u.unread_count > 0 && (
												<span className="shrink-0 px-1.5 py-0.5 rounded-full bg-danger/10 text-danger text-[10px] font-bold uppercase tracking-wider">
													Unread
												</span>
											)}
										</div>
										{u.last_message_at && (
											<span className="text-[10px] text-default-400 whitespace-nowrap">
												{formatDistanceToNow(
													new Date(u.last_message_at),
													{ addSuffix: false },
												)
													.replace("about ", "")
													.replace(" minutes", "m")
													.replace(" hours", "h")
													.replace(" days", "d")
													.replace(" minute", "m")
													.replace(" hour", "h")
													.replace(" day", "d")}
											</span>
										)}
									</div>
									<div className="flex items-center justify-between gap-1">
										<span
											className={`text-xs truncate flex-1 ${u.unread_count > 0 ? "text-foreground font-medium" : "text-default-400"}`}
										>
											{u.last_message ||
												"No messages yet"}
										</span>
									</div>
								</div>
							</button>
						))}

						{/* Discovered Users (New Chats) */}
						{discoveredUsers.length > 0 && (
							<div className="mt-2 pt-2 border-t border-divider/50">
								<div className="px-3 py-1 text-[10px] font-bold text-default-400 uppercase tracking-wider">
									Search Results
								</div>
								{discoveredUsers.map((u) => (
									<button
										key={u.user_id}
										className="w-full flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-default-100 transition-colors text-left group"
										onClick={() =>
											onSelect({
												id: u.user_id,
												name: u.user_name,
											})
										}
									>
										<div className="relative">
											<Avatar
												className="shrink-0 size-9"
												src={
													u.user_profile_img_url ||
													undefined
												}
												name={u.user_name}
											/>
										</div>
										<div className="flex flex-col min-w-0 flex-1">
											<div className="flex items-center justify-between gap-2">
												<span className="font-semibold text-sm truncate">
													{u.user_name}
												</span>
												<span className="shrink-0 px-1.5 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-bold uppercase tracking-wider">
													Chat
												</span>
											</div>
											<span className="text-xs text-default-400 truncate">
												{u.user_role} • @
												{u.login_user_name}
											</span>
										</div>
									</button>
								))}
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}

// Main Component
export function AdminFloatingChat() {
	const [isOpen, setIsOpen] = useState(false);
	const [minimized, setMinimized] = useState(false);
	const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);

	const auth = useAuth();
	const profile = auth?.profile ?? null;
	const adminName = profile?.user_name ?? "";
	const { rooms, loading } = useFetchAdminChatRooms();

	const hasUnread = useMemo(() => {
		return rooms?.some((r) => r.unread_count > 0) ?? false;
	}, [rooms]);

	// Mark messages as read when a user is selected or when new messages arrive for selected user (if visible)
	useEffect(() => {
		if (isOpen && !minimized && selectedUser?.id) {
			const room = rooms?.find((r) => r.user_id === selectedUser.id);
			if (room && room.unread_count > 0) {
				const markAsRead = async () => {
					try {
						const { error } = await supabase
							.from("ChatMessage")
							.update({ is_read: true })
							.eq("user_id", selectedUser.id)
							.eq("is_read", false);

						if (error) throw error;
					} catch (err) {
						console.error("Failed to mark messages as read:", err);
					}
				};

				markAsRead();
			}
		}
	}, [selectedUser?.id, rooms, isOpen, minimized]);

	const handleFabClick = () => {
		if (isOpen) {
			setIsOpen(false);
			setMinimized(false);
		} else {
			setIsOpen(true);
			setMinimized(false);
		}
	};

	const handleClose = () => {
		setIsOpen(false);
		setMinimized(false);
		// Don't clear selectedUser so re-opening resumes the last chat
	};

	const panelTitle = selectedUser ? selectedUser.name : "Support Chats";
	const panelSubtitle = selectedUser
		? "Customer"
		: "Select a user to message";

	return (
		<>
			{/*  Chat Panel  */}
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
						{selectedUser ? (
							<button
								aria-label="Back to user list"
								className="rounded-full p-1 hover:bg-white/20 transition-colors mr-0.5"
								onClick={() => setSelectedUser(null)}
							>
								<ChevronLeft className="size-4" />
							</button>
						) : (
							<BaybayaniLogo className="size-6 brightness-0 invert" />
						)}
						<div className="flex flex-col leading-tight">
							<span className="font-bold text-sm">
								{panelTitle}
							</span>
							<span className="text-xs text-green-200">
								{panelSubtitle}
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
							onClick={handleClose}
						>
							<X className="size-4" />
						</button>
					</div>
				</div>

				{/* Panel Body */}
				<div className="flex-1 min-h-0 overflow-hidden flex flex-col">
					{selectedUser && adminName ? (
						<RealtimeChat
							key={selectedUser.id}
							customerId={selectedUser.id}
						/>
					) : selectedUser && !adminName ? (
						<div className="flex items-center justify-center h-full text-default-400 text-sm">
							Connecting…
						</div>
					) : (
						<UserPickerPanel
							rooms={rooms}
							loading={loading}
							onSelect={setSelectedUser}
						/>
					)}
				</div>
			</div>

			{/*  Minimized pill  */}
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
					Support Chats
					{hasUnread && (
						<span className="absolute -top-1 -right-1 flex h-3 w-3">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
						</span>
					)}
				</button>
			)}

			{/*  FAB Bubble  */}
			{!isOpen && (
				<button
					aria-label="Open support chats"
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
