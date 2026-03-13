import { useEffect, useState } from "react";
import {
	Button,
	Modal,
	ModalContent,
	ModalBody,
	useDisclosure,
	Skeleton,
	Pagination,
	Image as HeroImage,
} from "@heroui/react";
import { fetchAnnouncements } from "@/data/supabase/Customer/Announcements/fetchAnnouncements";
import { Announcement } from "@/model/Announcement";
import { MegaphoneIcon, LeftArrow, XIcon } from "@/components/icons";
import { useNavigate } from "react-router-dom";
import { AnnouncementCard } from "@/components/Announcements/AnnouncementCard";

export default function CustomerAnnouncements() {
	const [announcements, setAnnouncements] = useState<Announcement[]>([]);
	const [loading, setLoading] = useState(true);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const pageSize = 5;
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const navigate = useNavigate();

	useEffect(() => {
		const load = async () => {
			setLoading(true);
			const { data, total } = await fetchAnnouncements(page, pageSize);
			setAnnouncements(data || []);
			setTotal(total || 0);
			setLoading(false);
		};
		load();
	}, [page]);

	const handleImageClick = (url: string) => {
		setSelectedImage(url);
		onOpen();
	};

	const totalPages = Math.ceil(total / pageSize);

	if (loading) {
		return (
			<div className="max-w-5xl mx-auto p-5 md:p-8 flex flex-col gap-8 pb-10">
				{/* Header */}
				<div className="flex items-center gap-4">
					<Skeleton className="w-10 h-10 rounded-full" />
					<div className="flex flex-col gap-2">
						<Skeleton className="h-6 w-48 rounded-lg" />
						<Skeleton className="h-4 w-64 rounded-lg" />
					</div>
				</div>

				{/* Announcement Cards */}
				<div className="flex flex-col gap-10">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="border border-divider bg-content1/50 rounded-xl p-6 flex flex-col gap-4"
						>
							{/* Title row */}
							<div className="flex justify-between items-center">
								<Skeleton className="h-6 w-56 rounded-lg" />
								<Skeleton className="h-4 w-24 rounded-lg" />
							</div>

							{/* Body */}
							<div className="flex flex-col gap-2">
								<Skeleton className="h-4 w-full rounded-lg" />
								<Skeleton className="h-4 w-full rounded-lg" />
								<Skeleton className="h-4 w-4/5 rounded-lg" />
							</div>

							{/* Image gallery */}
							<div className="flex gap-4 overflow-hidden">
								{[1, 2].map((img) => (
									<Skeleton
										key={img}
										className="w-[280px] sm:w-[350px] aspect-square rounded-2xl"
									/>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-5xl mx-auto p-5 md:p-8 flex flex-col gap-8 pb-10">
			<div className="flex items-center gap-4">
				<Button
					isIconOnly
					variant="light"
					onPress={() => navigate(-1)}
					radius="full"
				>
					<LeftArrow className="size-6" />
				</Button>
				<div className="flex flex-col">
					<h1 className="text-2xl font-bold flex items-center gap-2">
						<MegaphoneIcon className="size-8 text-success" />
						Announcements
					</h1>
					<p className="text-default-500 text-sm">
						Price updates and announcements.
					</p>
				</div>
			</div>

			{announcements.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-20 text-default-400">
					<MegaphoneIcon className="size-16 mb-4 opacity-10" />
					<p>No announcements yet.</p>
				</div>
			) : (
				<>
					<div className="flex flex-col gap-10">
						{announcements.map((ann) => (
							<AnnouncementCard
								key={ann.announcement_id}
								announcement={ann}
								onImageClick={handleImageClick}
							/>
						))}
					</div>

					{totalPages > 1 && (
						<div className="flex justify-center mt-8">
							<Pagination
								total={totalPages}
								initialPage={1}
								page={page}
								onChange={setPage}
								color="success"
								variant="flat"
								showControls
							/>
						</div>
					)}
				</>
			)}

			<Modal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
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
							onPress={onOpenChange}
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
		</div>
	);
}
