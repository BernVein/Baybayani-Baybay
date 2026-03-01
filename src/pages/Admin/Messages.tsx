import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import { MessageIcon } from "@/components/icons";
import { MessageList } from "@/pages/Admin/MessagesComponent/MessageList";
import { MessageContentDesktop } from "@/pages/Admin/MessagesComponent/MessageContentDesktop";

interface SelectedUser {
	id: string;
	name: string;
}

export default function Messages() {
	const { profile } = useOutletContext<any>();
	const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);

	return (
		<>
			<div className="flex flex-col gap-8 p-4 h-full">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
					<div className="flex flex-row items-center gap-2">
						<MessageIcon className="w-10" />
						<div className="text-3xl font-semibold">Messages</div>
					</div>
					<div className="flex flex-row gap-1 items-center text-muted-foreground">
						<div className="text-base text-default-200">
							Logged in as{" "}
						</div>
						<div className="text-lg font-semibold">
							{profile?.user_name ?? "Admin"}
						</div>
					</div>
				</div>
				<div className="flex flex-row gap-2 flex-1 min-h-0">
					<MessageList
						className={
							selectedUser
								? "hidden sm:flex sm:w-1/3 h-full"
								: "flex w-full sm:w-1/3 h-full"
						}
						selectedUserId={selectedUser?.id ?? null}
						onSelect={(id, name) => setSelectedUser({ id, name })}
					/>
					<MessageContentDesktop
						className={
							selectedUser
								? "flex w-full sm:w-2/3 h-full"
								: "hidden sm:flex sm:w-2/3 h-full"
						}
						selectedUserId={selectedUser?.id ?? null}
						selectedUserName={selectedUser?.name ?? null}
						adminName={profile?.user_name ?? "Admin"}
						onBack={() => setSelectedUser(null)}
					/>
				</div>
			</div>
		</>
	);
}
