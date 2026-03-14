import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Skeleton,
	Pagination,
	Image as HeroImage,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { fetchAnnouncements } from "@/data/supabase/Customer/Announcements/fetchAnnouncements";
import { Announcement } from "@/model/Announcement";
import { AnnouncementCard } from "@/pages/General/Announcement/AnnouncementCard";
import { XIcon } from "@/components/icons";

interface AnnouncementHistoryModalProps {
	isOpen: boolean;
	onOpenChange: () => void;
}

export function AnnouncementHistoryModal({
	isOpen,
	onOpenChange,
}: AnnouncementHistoryModalProps) {
	const [announcements, setAnnouncements] = useState<Announcement[]>([]);
	const [loading, setLoading] = useState(true);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const pageSize = 5;

	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [isImageOpen, setIsImageOpen] = useState(false);

	useEffect(() => {
		if (isOpen) {
			const load = async () => {
				setLoading(true);
				const { data, total } = await fetchAnnouncements(
					page,
					pageSize,
				);
				setAnnouncements(data || []);
				setTotal(total || 0);
				setLoading(false);
			};
			load();
		}
	}, [isOpen, page]);

	const handleImageClick = (url: string) => {
		setSelectedImage(url);
		setIsImageOpen(true);
	};

	const totalPages = Math.ceil(total / pageSize);

	return (
		<>
			<Modal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				size="3xl"
				scrollBehavior="inside"
				backdrop="blur"
				disableAnimation
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								<p className="text-xl font-bold">
									Announcement History
								</p>
								<p className="text-sm font-normal text-default-500">
									View and manage all previously posted
									announcements.
								</p>
							</ModalHeader>
							<ModalBody className="py-6">
								{loading ? (
									<div className="flex flex-col gap-6">
										{[1, 2].map((i) => (
											<Skeleton
												key={i}
												className="h-40 w-full rounded-xl"
											/>
										))}
									</div>
								) : announcements.length === 0 ? (
									<div className="flex flex-col items-center justify-center py-10 text-default-400">
										<p>No previous announcements.</p>
									</div>
								) : (
									<div className="flex flex-col gap-6">
										{announcements.map((ann) => (
											<AnnouncementCard
												key={ann.announcement_id}
												announcement={ann}
												onImageClick={handleImageClick}
											/>
										))}
									</div>
								)}
							</ModalBody>
							<ModalFooter className="flex justify-between items-center border-t border-divider py-4">
								<div className="flex items-center">
									{totalPages > 1 && (
										<Pagination
											total={totalPages}
											initialPage={1}
											page={page}
											onChange={setPage}
											color="success"
											variant="flat"
											size="sm"
										/>
									)}
								</div>
								<Button
									variant="light"
									onPress={onClose}
									className="font-semibold"
								>
									Close
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>

			{/* Detailed Image Modal */}
			<Modal
				isOpen={isImageOpen}
				onOpenChange={() => setIsImageOpen(false)}
				size="4xl"
				scrollBehavior="inside"
				backdrop="blur"
				hideCloseButton
				className="bg-transparent shadow-none"
			>
				<ModalContent>
					<ModalBody className="p-0 relative flex items-center justify-center">
						<Button
							isIconOnly
							className="absolute top-4 right-4 z-50 bg-background/50 backdrop-blur-md"
							radius="full"
							variant="flat"
							onPress={() => setIsImageOpen(false)}
						>
							<XIcon className="size-6" />
						</Button>
						{selectedImage && (
							<HeroImage
								src={selectedImage}
								alt="Full Preview"
								className="max-h-[85vh] w-auto object-contain rounded-xl"
							/>
						)}
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
}
