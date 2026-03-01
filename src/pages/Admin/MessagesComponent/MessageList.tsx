import { useState, useMemo } from "react";
import {
	Card,
	CardHeader,
	CardBody,
	Input,
	Listbox,
	ListboxItem,
	Avatar,
	Button,
	Skeleton,
} from "@heroui/react";

import { SearchIcon, SoloUserIcon, GroupUserIcon } from "@/components/icons";
import { fetchAllUsers } from "@/data/supabase/Admin/Users/fetchAllUsers";

type RoleFilter = "all" | "Individual" | "Cooperative";

export function MessageList({
	onSelect,
	selectedUserId,
	className,
}: {
	onSelect?: (userId: string, userName: string) => void;
	selectedUserId?: string | null;
	className?: string;
}) {
	const { userProfiles, loading } = fetchAllUsers();
	const [search, setSearch] = useState("");
	const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");

	// Only non-admin users
	const nonAdminUsers = useMemo(
		() => (userProfiles ?? []).filter((u) => u.user_role !== "Admin"),
		[userProfiles],
	);

	const filtered = useMemo(() => {
		let result = nonAdminUsers;
		if (roleFilter !== "all") {
			result = result.filter((u) => u.user_role === roleFilter);
		}
		if (search.trim()) {
			const q = search.toLowerCase();
			result = result.filter(
				(u) =>
					u.user_name.toLowerCase().includes(q) ||
					u.login_user_name.toLowerCase().includes(q),
			);
		}
		return result;
	}, [nonAdminUsers, roleFilter, search]);

	return (
		<Card className={`w-full ${className || "h-full"}`}>
			<CardHeader className="flex gap-3">
				<div className="flex flex-col gap-2 items-center w-full">
					<Input
						className="w-full"
						placeholder="Search for a user"
						startContent={<SearchIcon />}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<div className="flex flex-row items-center gap-2">
						<Button
							startContent={<SoloUserIcon className="w-5" />}
							variant={
								roleFilter === "Individual" ? "solid" : "light"
							}
							size="sm"
							onPress={() =>
								setRoleFilter((p) =>
									p === "Individual" ? "all" : "Individual",
								)
							}
						>
							Individual
						</Button>
						<Button
							startContent={<GroupUserIcon className="w-5" />}
							variant={
								roleFilter === "Cooperative" ? "solid" : "light"
							}
							size="sm"
							onPress={() =>
								setRoleFilter((p) =>
									p === "Cooperative" ? "all" : "Cooperative",
								)
							}
						>
							Cooperative
						</Button>
					</div>
				</div>
			</CardHeader>

			<CardBody className="overflow-y-auto">
				{loading ? (
					<div className="flex flex-col gap-3 p-2">
						{Array.from({ length: 6 }).map((_, i) => (
							<div key={i} className="flex items-center gap-3">
								<Skeleton className="rounded-full w-10 h-10 shrink-0" />
								<div className="flex flex-col gap-1 flex-1">
									<Skeleton className="h-4 w-2/3 rounded-lg" />
									<Skeleton className="h-3 w-1/2 rounded-lg" />
								</div>
							</div>
						))}
					</div>
				) : filtered.length === 0 ? (
					<div className="flex items-center justify-center h-full text-default-400 text-sm">
						No users found
					</div>
				) : (
					<Listbox aria-label="User conversations">
						{filtered.map((u) => (
							<ListboxItem
								key={u.user_id!}
								className={`w-full mb-1 rounded-xl ${
									selectedUserId === u.user_id
										? "bg-default-100"
										: ""
								}`}
								onPress={() =>
									onSelect?.(u.user_id!, u.user_name)
								}
							>
								<div className="flex flex-row gap-3 items-center w-full py-1">
									<Avatar
										className="shrink-0"
										src={
											u.user_profile_img_url || undefined
										}
										name={u.user_name}
									/>
									<div className="flex flex-col items-start w-full min-w-0">
										<span className="font-semibold text-sm truncate w-full">
											{u.user_name}
										</span>
										<span className="text-xs text-default-400 truncate w-full">
											{u.user_role} · @{u.login_user_name}
										</span>
									</div>
								</div>
							</ListboxItem>
						))}
					</Listbox>
				)}
			</CardBody>
		</Card>
	);
}
