import { Card, CardHeader, Avatar, Button } from "@heroui/react";
import { RealtimeChat } from "@/data/supabase/General/realtime-chat";
import { MessageIcon } from "@/components/icons";

export function MessageContentDesktop({
	className,
	onBack,
	selectedUserId,
	selectedUserName,
	adminName,
}: {
	className?: string;
	onBack?: () => void;
	selectedUserId: string | null;
	selectedUserName: string | null;
	adminName: string;
}) {
	if (!selectedUserId || !selectedUserName) {
		return (
			<Card
				className={`${className || "hidden sm:flex sm:w-2/3 h-full"} items-center justify-center`}
			>
				<div className="flex flex-col items-center gap-4 text-default-400">
					<MessageIcon className="w-14 opacity-30" />
					<p className="text-base">
						Select a conversation to start chatting
					</p>
				</div>
			</Card>
		);
	}

	return (
		<Card
			className={`${className || "hidden sm:flex sm:w-2/3"} h-full flex flex-col`}
		>
			<CardHeader className="flex gap-3 shrink-0 border-b border-divider">
				<div className="flex flex-row gap-2 items-center w-full">
					{onBack && (
						<Button
							isIconOnly
							className="sm:hidden"
							variant="light"
							onPress={onBack}
						>
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								strokeWidth={1.5}
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</Button>
					)}
					<div className="flex flex-row justify-between w-full">
						<div className="flex flex-row gap-2 items-center">
							<Avatar name={selectedUserName} />
							<div className="flex flex-col">
								<span className="font-semibold">
									{selectedUserName}
								</span>
								<span className="text-xs text-default-400">
									Customer
								</span>
							</div>
						</div>
					</div>
				</div>
			</CardHeader>

			{/* RealtimeChat fills remaining height */}
			<div className="flex-1 min-h-0">
				<RealtimeChat
					roomName={`user-${selectedUserId}`}
					username={adminName}
				/>
			</div>
		</Card>
	);
}
