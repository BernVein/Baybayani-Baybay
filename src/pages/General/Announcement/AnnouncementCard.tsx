import {
	Card,
	CardBody,
	CardHeader,
	Image as HeroImage,
	ScrollShadow,
} from "@heroui/react";
import { Announcement } from "@/model/Announcement";

interface AnnouncementCardProps {
	announcement: Announcement;
	onImageClick: (url: string) => void;
}

export function AnnouncementCard({
	announcement,
	onImageClick,
}: AnnouncementCardProps) {
	return (
		<Card
			key={announcement.announcement_id}
			shadow="sm"
			className="border border-divider bg-content1/50 w-full"
		>
			<CardHeader className="flex flex-col items-start px-6 pt-6 gap-1">
				<div className="flex items-center justify-between w-full">
					<h2 className="text-xl font-bold">
						{announcement.announcement_title}
					</h2>
					<span className="text-sm text-default-400">
						{new Date(announcement.created_at).toLocaleDateString(
							"en-PH",
							{
								month: "long",
								day: "numeric",
								year: "numeric",
							},
						)}
					</span>
				</div>
				<p className="text-default-600 mt-2 whitespace-pre-wrap">
					{announcement.announcement_body}
				</p>
			</CardHeader>
			<CardBody className="px-6 pb-6">
				{announcement.images && announcement.images.length > 0 && (
					<ScrollShadow
						orientation="horizontal"
						className="flex gap-4 pb-4"
					>
						{announcement.images.map((img) => (
							<div
								key={img.announcement_image_id}
								className="flex-shrink-0 w-[280px] sm:w-[350px] aspect-square rounded-2xl overflow-hidden border border-divider shadow-sm cursor-zoom-in hover:opacity-90 transition-opacity"
								onClick={() =>
									onImageClick(img.announcement_img_url)
								}
							>
								<HeroImage
									src={img.announcement_img_url}
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
	);
}
