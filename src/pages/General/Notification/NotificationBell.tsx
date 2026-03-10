import {
	Badge,
	Button,
	Popover,
	PopoverContent,
	PopoverTrigger,
	ScrollShadow,
	Divider,
	Listbox,
	ListboxItem,
	Spinner,
} from "@heroui/react";
import { Bell, LogIn } from "lucide-react";
import { useNotifications } from "@/ContextProvider/NotificationContext/NotificationProvider";
import { useLoginModal } from "@/ContextProvider/LoginModalContext/LoginModalContext";
import { Notification } from "@/model/notification";

export function NotificationBell({
	userId,
}: {
	userId: string | null | undefined;
}) {
	const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
		useNotifications();
	const { openLoginModal } = useLoginModal();

	const isGuest = !userId;

	return (
		<Popover placement="bottom-end" showArrow shadow="md">
			<PopoverTrigger>
				<Button
					isIconOnly
					variant="light"
					radius="full"
					className="relative"
				>
					<Badge
						color="danger"
						content={unreadCount > 0 ? unreadCount : null}
						isInvisible={unreadCount === 0}
						shape="circle"
						size="sm"
					>
						<Bell className="size-6" />
					</Badge>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[300px] p-0">
				<div className="flex flex-col w-full">
					<div className="flex items-center justify-between px-4 py-3 border-b border-divider">
						<span className="text-sm font-semibold">
							Notifications
						</span>
						{unreadCount > 0 && (
							<Button
								size="sm"
								variant="light"
								color="success"
								onPress={markAllAsRead}
							>
								Mark all as read
							</Button>
						)}
					</div>

					<ScrollShadow className="max-h-[400px]">
						{isGuest ? (
							<div className="flex flex-col items-center justify-center p-8 text-center">
								<LogIn className="size-8 mb-4 text-default-400 opacity-20" />
								<p className="text-sm font-semibold mb-1">
									Stay Updated
								</p>
								<p className="text-xs text-default-400 mb-4">
									Please log in to view your orders and shop
									notifications.
								</p>
								<Button
									color="success"
									size="sm"
									onPress={openLoginModal}
								>
									Log In
								</Button>
							</div>
						) : loading ? (
							<div className="flex justify-center p-8">
								<Spinner color="success" size="sm" />
							</div>
						) : notifications.length === 0 ? (
							<div className="flex flex-col items-center justify-center p-8 text-default-400">
								<Bell className="size-8 mb-2 opacity-20" />
								<p className="text-xs">No notifications yet</p>
							</div>
						) : (
							<Listbox
								aria-label="Notifications list"
								onAction={(key) => markAsRead(key as string)}
								variant="flat"
							>
								{notifications.map((notif: Notification) => (
									<ListboxItem
										key={notif.notification_id}
										className={`${
											!notif.is_read
												? "bg-success-50 dark:bg-success-900/10"
												: ""
										} py-3`}
										description={
											<div className="flex flex-col gap-1">
												<p className="text-xs text-default-500 line-clamp-2">
													{notif.body}
												</p>
												<p className="text-[10px] text-default-400">
													{new Date(
														notif.created_at,
													).toLocaleString("en-PH", {
														month: "short",
														day: "numeric",
														hour: "2-digit",
														minute: "2-digit",
													})}
												</p>
											</div>
										}
										title={
											<div className="flex items-center justify-between">
												<span
													className={`text-sm ${
														!notif.is_read
															? "font-bold"
															: "font-semibold"
													}`}
												>
													{notif.title}
												</span>
												{!notif.is_read && (
													<div className="size-2 rounded-full bg-success" />
												)}
											</div>
										}
									/>
								))}
							</Listbox>
						)}
					</ScrollShadow>
					<Divider />
					<div className="p-2">
						<Button
							fullWidth
							variant="light"
							size="sm"
							className="text-xs"
						>
							View all notifications
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
