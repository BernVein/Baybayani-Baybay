import {
	Card,
	Chip,
	CardBody,
	CardFooter,
	Image,
	Divider,
} from "@heroui/react";
import { Item } from "@/model/Item";
import { tagColors, TagType } from "@/model/tagtype";

export default function ItemCard({
	item,
	index,
	onPress,
}: {
	item: Item;
	index: number;
	onPress: () => void;
}) {
	const determinePluralText = (stock: number, soldBy: string) => {
		if (stock > 1) {
			return `${stock} ${soldBy}s left`;
		} else {
			return `${stock} ${soldBy} left`;
		}
	};
	const firstVariant = item.variants?.[0];
	return (
		<Card
			isPressable
			key={index}
			shadow="sm"
			onPress={onPress}
			className="transform transition-transform duration-300 hover:scale-105 cursor-pointer"
		>
			<CardBody className="overflow-visible p-0">
				<div className="relative">
					<Image
						isZoomed
						alt={item.title}
						className="w-full object-cover h-[140px] rounded-lg shadow-sm"
						src={item.img[0]}
						width="100%"
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
			</CardBody>

			<CardFooter className="text-small">
				<div className="flex flex-col w-full ">
					<b className="font-extralight text-center md:text-left text-xs md:text-sm">
						{item.category}
					</b>
					<b className="text-center md:text-left text-lg md:text-xl">
						{item.title}
					</b>

					<div className="flex flex-col w-full text-default-500 space-y-2 mt-2">
						{/* Retail */}
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-start">
							<p>
								<span className="mr-1 font-semibold text-base">
									₱{firstVariant?.price_retail.toFixed(2)} /{" "}
									{item.sold_by}
								</span>
							</p>
							<p className="text-xs sm:text-sm text-default-400 mt-0.5 sm:mt-0">
								for <strong>Retail</strong>
							</p>
						</div>

						{/* Wholesale */}
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-start">
							<p>
								<span className="mr-1 font-semibold text-base">
									₱{firstVariant?.price_wholesale?.toFixed(2)}{" "}
									/ {item.sold_by}
								</span>
							</p>
							<p className="text-xs sm:text-sm text-default-400 mt-0.5 sm:mt-0">
								for <strong>Wholesale</strong>
							</p>
						</div>
					</div>

					<Divider className="my-2" />

					<div className="relative w-full h-[48px] flex items-center">
						{!item.description ||
						item.description.trim().length === 0 ? (
							<p className="w-full text-center text-xs italic text-default-400 opacity-60">
								No description available.
							</p>
						) : (
							<p className="text-left text-xs font-light text-default-500 line-clamp-2">
								{item.description
									.split(" ")
									.slice(0, 10)
									.join(" ")}
								{item.description.split(" ").length > 10 &&
									" ..."}
							</p>
						)}
					</div>

					<Divider className="my-3" />

					<div className="flex justify-between w-full flex-col sm:flex-row sm:items-center">
						<span className="text-xs font-light">
							{determinePluralText(
								Number(firstVariant?.stocks || 0),
								item.sold_by
							)}
						</span>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
}
