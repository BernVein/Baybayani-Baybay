import { useEffect, useState, useRef } from "react";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
	Image as HeroImage,
} from "@heroui/react";
import { fetchAnnouncementById } from "@/data/supabase/Customer/Announcements/fetchAnnouncements";
import { Announcement } from "@/model/Announcement";
import { useNavigate } from "react-router-dom";
import { BaybayaniLogo } from "@/components/icons";
import { useNotifications } from "@/ContextProvider/NotificationContext/NotificationProvider";

export function AnnouncementModal() {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const [latestAnn, setLatestAnn] = useState<Announcement | null>(null);
	const { notifications, markAsRead } = useNotifications();
	const navigate = useNavigate();
	const activeNotificationId = useRef<string | null>(null);

	useEffect(() => {
		const checkAnnouncement = async () => {
			// Find the first unread announcement notification
			const announcementNotif = notifications.find(
				(n) => n.type === "announcement" && !n.is_read,
			);

			if (!announcementNotif) {
				setLatestAnn(null);
				return;
			}

			// Avoid re-fetching same announcement ID multiple times if modal is already open
			const announcementId = announcementNotif.data?.announcementId;
			if (!announcementId) return;

			// Store notification ID to mark as read later
			activeNotificationId.current = announcementNotif.notification_id;

			const announcement = await fetchAnnouncementById(announcementId);
			if (announcement) {
				setLatestAnn(announcement);
				onOpen();
			}
		};

		checkAnnouncement();
	}, [notifications, onOpen]);

	const handleSeeMore = () => {
		if (activeNotificationId.current) {
			markAsRead(activeNotificationId.current);
		}
		onClose();
		navigate("/announcements");
	};

	const handleClose = () => {
		if (activeNotificationId.current) {
			markAsRead(activeNotificationId.current);
		}
		onClose();
	};

	if (!latestAnn) return null;

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			backdrop="blur"
			size="md"
			scrollBehavior="inside"
			hideCloseButton
			disableAnimation
		>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1 text-center items-center pt-8">
					<div className="flex items-center gap-2">
						<BaybayaniLogo className="size-8 text-danger" />
						<span className="text-success text-2xl font-bold">
							ANNOUNCEMENT!
						</span>
					</div>

					<h2 className="text-xl">{latestAnn.announcement_title}</h2>
				</ModalHeader>
				<ModalBody className="pb-6">
					<div className="flex flex-col gap-4">
						<p className="text-default-600 line-clamp-4">
							{latestAnn.announcement_body}
						</p>
						{latestAnn.images && latestAnn.images.length > 0 && (
							<div className="rounded-2xl overflow-hidden border border-divider shadow-md">
								<HeroImage
									src={
										latestAnn.images[0].announcement_img_url
									}
									alt="Announcement"
									className="w-full object-cover"
								/>
							</div>
						)}
					</div>
				</ModalBody>
				<ModalFooter className="flex flex-col gap-2 pb-8">
					<Button
						color="success"
						fullWidth
						onPress={handleSeeMore}
						className="font-bold"
					>
						VIEW FULL ANNOUNCEMENT
					</Button>
					<Button
						variant="light"
						fullWidth
						onPress={handleClose}
						className="font-semibold text-default-500"
					>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
