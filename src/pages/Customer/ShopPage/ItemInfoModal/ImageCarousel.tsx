import { Image, Chip } from "@heroui/react";
import { Item } from "@/model/Item";
import { tagColors, TagType } from "@/model/tagtype";

export default function ImageCarousel({
	item,
	mainImg,
	setMainImg,
	isMobile,
}: {
	item: Item;
	mainImg: string;
	setMainImg: (url: string) => void;
	isMobile: boolean;
}) {
	return (
		<>
			<div className="relative">
				<Image
					alt={item.title || "Sample Item"}
					src={mainImg}
					isZoomed={!isMobile}
					width={300}
				/>
				{item.tag && (
					<Chip
						className="absolute top-2 left-2 z-10"
						color={tagColors[item.tag as TagType] || "default"}
						size="sm"
					>
						{item.tag}
					</Chip>
				)}
			</div>
			{item.img.length > 1 && (
				<div className="flex gap-2 mt-2">
					{item.img.map((url, index) => (
						<Image
							key={index}
							alt={item.title || "Sample Item"}
							src={url}
							onClick={() => setMainImg(url)}
							width={url === mainImg ? 65 : 70} // smaller width if selected
							isZoomed={!isMobile}
						/>
					))}
				</div>
			)}
		</>
	);
}
