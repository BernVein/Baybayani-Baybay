import { useEffect, useState } from "react";
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
import { fetchLatestAnnouncement } from "@/data/supabase/Customer/Announcements/fetchAnnouncements";
import { Announcement } from "@/model/Announcement";
import { useNavigate } from "react-router-dom";
import { BaybayaniLogo } from "@/components/icons";

export function AnnouncementModal() {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [latestAnn, setLatestAnn] = useState<Announcement | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const checkAnnouncement = async () => {
			const latest = await fetchLatestAnnouncement();
			if (!latest) return;

			// Check if this announcement was already seen today
			const lastSeenId = localStorage.getItem(
				"last_seen_announcement_id",
			);
			const lastSeenDate = localStorage.getItem(
				"last_seen_announcement_date",
			);
			const today = new Date().toLocaleDateString();

			if (
				lastSeenId === latest.announcement_id &&
				lastSeenDate === today
			) {
				return;
			}

			setLatestAnn(latest);
			onOpen();
		};

		// Check on mount (app open/layout load)
		checkAnnouncement();
	}, [onOpen]);

	const handleSeeMore = () => {
		if (latestAnn) {
			localStorage.setItem(
				"last_seen_announcement_id",
				latestAnn.announcement_id,
			);
			localStorage.setItem(
				"last_seen_announcement_date",
				new Date().toLocaleDateString(),
			);
		}
		onOpenChange();
		navigate("/announcements");
	};

	const handleClose = () => {
		if (latestAnn) {
			localStorage.setItem(
				"last_seen_announcement_id",
				latestAnn.announcement_id,
			);
			localStorage.setItem(
				"last_seen_announcement_date",
				new Date().toLocaleDateString(),
			);
		}
		onOpenChange();
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
