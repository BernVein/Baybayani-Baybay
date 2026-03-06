import { X, Minus, MessageCircle, ChevronLeft, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { Avatar, Skeleton } from "@heroui/react";

import { BaybayaniLogo } from "@/components/icons";
import { RealtimeChat } from "@/data/supabase/General/realtime-chat";
import { useAuth } from "@/ContextProvider/AuthContext/AuthProvider";
import { fetchAllUsers } from "@/data/supabase/Admin/Users/fetchAllUsers";

//  Types
interface SelectedUser {
	id: string;
	name: string;
}

//  User Picker Panel
function UserPickerPanel({
	onSelect,
}: {
	onSelect: (user: SelectedUser) => void;
}) {
	const { userProfiles, loading } = fetchAllUsers();
	const [search, setSearch] = useState("");

	const filtered = useMemo(() => {
		const nonAdmin = (userProfiles ?? []).filter(
			(u) => u.user_role !== "Admin",
		);
		if (!search.trim()) return nonAdmin;
		const q = search.toLowerCase();
		return nonAdmin.filter(
			(u) =>
				u.user_name.toLowerCase().includes(q) ||
				u.login_user_name.toLowerCase().includes(q),
		);
	}, [userProfiles, search]);

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
				</div>
			</div>

			{/* User list */}
			<div className="flex-1 min-h-0 overflow-y-auto px-2 py-2 space-y-0.5">
				{loading ? (
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
				) : filtered.length === 0 ? (
					<div className="flex items-center justify-center h-full text-default-400 text-sm py-8">
						No users found
					</div>
				) : (
					filtered.map((u) => (
						<button
							key={u.user_id}
							className="w-full flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-default-100 transition-colors text-left"
							onClick={() =>
								onSelect({ id: u.user_id!, name: u.user_name })
							}
						>
							<Avatar
								className="shrink-0 size-9"
								src={u.user_profile_img_url || undefined}
								name={u.user_name}
							/>
							<div className="flex flex-col min-w-0">
								<span className="font-semibold text-sm truncate">
									{u.user_name}
								</span>
								<span className="text-xs text-default-400 truncate">
									{u.user_role} · @{u.login_user_name}
								</span>
							</div>
						</button>
					))
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
						<UserPickerPanel onSelect={setSelectedUser} />
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
				</button>
			)}
		</>
	);
}
