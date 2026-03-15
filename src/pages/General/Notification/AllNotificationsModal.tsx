import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Pagination,
	Skeleton,
	Listbox,
	ListboxItem,
} from "@heroui/react";
import { useState } from "react";
import { useAllNotifications } from "@/data/supabase/General/Notification/useAllNotifications";
import { Notification } from "@/model/notification";
import { Bell, CheckCircle2 } from "lucide-react";

interface AllNotificationsModalProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	userId: string | null | undefined;
}

export function AllNotificationsModal({
	isOpen,
	onOpenChange,
	userId,
}: AllNotificationsModalProps) {
	const [page, setPage] = useState(1);
	const pageSize = 10;
	const { notifications, total, loading, markAsRead, markAllAsRead } =
		useAllNotifications(userId, page, pageSize);

	const totalPages = Math.ceil(total / pageSize);

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			size="2xl"
			scrollBehavior="inside"
			backdrop="blur"
			disableAnimation
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							<div className="flex items-center justify-between w-full pr-6">
								<div>
									<h2 className="text-xl font-bold">
										All Notifications
									</h2>
								</div>
								{notifications.some((n) => !n.is_read) && (
									<Button
										size="sm"
										variant="flat"
										color="success"
										onPress={() => markAllAsRead()}
										startContent={
											<CheckCircle2 className="size-4" />
										}
									>
										Mark all as read
									</Button>
								)}
							</div>
						</ModalHeader>
						<ModalBody className="p-0">
							{loading ? (
								<div className="flex flex-col gap-2 p-4">
									{[1, 2, 3, 4, 5].map((i) => (
										<Skeleton
											key={i}
											className="h-20 w-full rounded-xl"
										/>
									))}
								</div>
							) : notifications.length === 0 ? (
								<div className="flex flex-col items-center justify-center py-20 text-default-400">
									<Bell className="size-12 mb-4 opacity-20" />
									<p className="font-medium">
										No notifications found
									</p>
								</div>
							) : (
								<Listbox
									aria-label="All notifications list"
									variant="flat"
									onAction={(key) =>
										markAsRead(key as string)
									}
									className="p-2"
								>
									{notifications.map(
										(notif: Notification) => (
											<ListboxItem
												key={notif.notification_id}
												className={`${
													!notif.is_read
														? "bg-success-50 dark:bg-success-900/10"
														: ""
												} py-4 px-4 my-1 rounded-xl transition-all hover:bg-default-100`}
												description={
													<div className="flex flex-col gap-1 mt-1">
														<p className="text-sm text-default-500">
															{notif.body}
														</p>
														<p className="text-[10px] text-default-400 font-medium">
															{new Date(
																notif.created_at,
															).toLocaleString(
																"en-PH",
																{
																	month: "long",
																	day: "numeric",
																	year: "numeric",
																	hour: "2-digit",
																	minute: "2-digit",
																},
															)}
														</p>
													</div>
												}
												title={
													<div className="flex items-center justify-between">
														<span
															className={`text-base ${
																!notif.is_read
																	? "font-bold text-success-700 dark:text-success-400"
																	: "font-semibold"
															}`}
														>
															{notif.title}
														</span>
														{!notif.is_read && (
															<div className="size-2 rounded-full bg-success animate-pulse" />
														)}
													</div>
												}
											/>
										),
									)}
								</Listbox>
							)}
						</ModalBody>
						<ModalFooter className="flex justify-between items-center py-4">
							<div className="flex items-center">
								{totalPages > 1 && (
									<Pagination
										total={totalPages}
										page={page}
										onChange={setPage}
										color="success"
										variant="flat"
										size="sm"
										showControls
										loop
									/>
								)}
							</div>
							<Button
								variant="light"
								onPress={onClose}
								color="danger"
							>
								Close
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
