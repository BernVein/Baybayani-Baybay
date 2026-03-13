import { useEffect, useState } from "react";
import {
	Card,
	CardBody,
	CardHeader,
	Image as HeroImage,
	Button,
	ScrollShadow,
	Modal,
	ModalContent,
	ModalBody,
	useDisclosure,
	Skeleton,
} from "@heroui/react";
import { fetchAnnouncements } from "@/data/supabase/Customer/Announcements/fetchAnnouncements";
import { Announcement } from "@/model/Announcement";
import { MegaphoneIcon, LeftArrow, XIcon } from "@/components/icons";
import { useNavigate } from "react-router-dom";

export default function CustomerAnnouncements() {
	const [announcements, setAnnouncements] = useState<Announcement[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const navigate = useNavigate();

	useEffect(() => {
		const load = async () => {
			setLoading(true);
			const { data } = await fetchAnnouncements(1, 100); // Load all for now as it's 1 per date
			setAnnouncements(data || []);
			setLoading(false);
		};
		load();
	}, []);

	const handleImageClick = (url: string) => {
		setSelectedImage(url);
		onOpen();
	};

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
					{[1].map((i) => (
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
				<div className="flex flex-col gap-10">
					{announcements.map((ann) => (
						<Card
							key={ann.announcement_id}
							shadow="sm"
							className="border border-divider bg-content1/50"
						>
							<CardHeader className="flex flex-col items-start px-6 pt-6 gap-1">
								<div className="flex items-center justify-between w-full">
									<h2 className="text-xl font-bold">
										{ann.announcement_title}
									</h2>
									<span className="text-sm text-default-400">
										{new Date(
											ann.created_at,
										).toLocaleDateString("en-PH", {
											month: "long",
											day: "numeric",
											year: "numeric",
										})}
									</span>
								</div>
								<p className="text-default-600 mt-2 whitespace-pre-wrap">
									{ann.announcement_body}
								</p>
							</CardHeader>
							<CardBody className="px-6 pb-6">
								{ann.images && ann.images.length > 0 && (
									<ScrollShadow
										orientation="horizontal"
										className="flex gap-4 pb-4"
									>
										{ann.images.map((img) => (
											<div
												key={img.announcement_image_id}
												className="flex-shrink-0 w-[280px] sm:w-[350px] aspect-square rounded-2xl overflow-hidden border border-divider shadow-sm cursor-zoom-in hover:opacity-90 transition-opacity"
												onClick={() =>
													handleImageClick(
														img.announcement_img_url,
													)
												}
											>
												<HeroImage
													src={
														img.announcement_img_url
													}
													alt="Announcement"
													className="w-full h-full object-cover"
													removeWrapper
												/>
											</div>
										))}
									</ScrollShadow>
								)}
							</CardBody>
						</Card>
					))}
				</div>
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
