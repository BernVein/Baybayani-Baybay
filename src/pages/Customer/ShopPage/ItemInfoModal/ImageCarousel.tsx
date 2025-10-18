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
					alt={item.item_title || "Sample Item"}
					src={mainImg}
					isZoomed={!isMobile}
					width={300}
				/>
				{item.item_tag && (
					<Chip
						className="absolute top-2 left-2 z-10"
						color={tagColors[item.item_tag as TagType] || "default"}
						size="sm"
					>
						{item.item_tag}
					</Chip>
				)}
			</div>
			{item.item_img.length > 1 && (
				<div className="flex gap-2 mt-2">
					{item.item_img.map((url, index) => (
						<Image
							key={index}
							alt={item.item_title || "Sample Item"}
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
