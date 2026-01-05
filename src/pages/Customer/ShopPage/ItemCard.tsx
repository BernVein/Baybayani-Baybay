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
	const firstVariant = item.item_variants?.[0];
	return (
		<Card
			isPressable
			key={index}
			shadow="sm"
			onPress={onPress}
			className="transform transition-transform duration-300 hover:scale-105 cursor-pointer shadow-sm border border-default-200 rounded-2xl"
		>
			<CardBody className="overflow-visible p-0">
				<div className="relative">
					<Image
						isZoomed
						alt={item.item_title}
						className="w-full object-cover h-[140px] rounded-lg shadow-sm"
						src={item.item_img[0]}
						width="100%"
					/>
					{item.item_tag && (
						<Chip
							className="absolute top-2 left-2 z-10"
							color={
								tagColors[item.item_tag as TagType] || "default"
							}
							size="sm"
						>
							{item.item_tag}
						</Chip>
					)}
				</div>
			</CardBody>

			<CardFooter className="text-small items-start">
				<div className="flex flex-col w-full items-center lg:items-start">
					<b className="font-extralight text-center lg:text-left text-xs lg:text-sm">
						{item.item_category}
					</b>
					<b className="text-center lg:text-left text-base lg:text-xl">
						{item.item_title}
					</b>

					<div className="flex flex-col w-full text-default-500 space-y-2 mt-2">
						{/* Retail */}
						<div className="flex flex-col lg:flex-row lg:items-center lg:justify-start">
							<p>
								<span className="mr-1 font-semibold text-base">
									₱
									{firstVariant?.variant_price_retail.toFixed(
										2
									)}{" "}
								</span>
							</p>
							<p className="text-xs lg:text-sm text-default-400 mt-0.5 lg:mt-0">
								for <strong>Retail</strong>
							</p>
						</div>

						{/* Wholesale */}
						<div className="flex flex-col lg:flex-row lg:items-center lg:justify-start">
							{firstVariant?.variant_price_wholesale != null ? (
								<>
									<p>
										<span className="mr-1 font-semibold text-base">
											₱
											{firstVariant.variant_price_wholesale.toFixed(
												2
											)}
										</span>
									</p>
									<p className="text-xs lg:text-sm text-default-400 mt-0.5 lg:mt-0">
										for <strong>Wholesale</strong>
									</p>
								</>
							) : (
								<div className="flex flex-col lg:flex-row lg:items-center lg:justify-start">
									<p>
										<span className="mr-1 text-default-400 text-base">
											Wholesale
										</span>
									</p>
									<p className="text-xs lg:text-base text-default-400 mt-0.5 lg:mt-0">
										not available
									</p>
								</div>
							)}
						</div>
					</div>

					<Divider className="my-2" />

					<div className="relative w-full h-[48px] flex items-center">
						{!item.item_description ||
						item.item_description.trim().length === 0 ? (
							<p className="w-full text-center text-xs italic text-default-400 opacity-60">
								No description available.
							</p>
						) : (
							<p className="text-left text-xs font-light text-default-500 line-clamp-2">
								{item.item_description
									.split(" ")
									.slice(0, 10)
									.join(" ")}
								{item.item_description.split(" ").length > 10 &&
									" ..."}
							</p>
						)}
					</div>

					<Divider className="my-3" />

					<div className="flex justify-between w-full flex-col lg:flex-row lg:items-center">
						<span className="text-xs font-light">
							{determinePluralText(
								Number(firstVariant?.variant_stocks || 0),
								item.item_sold_by
							)}
						</span>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
}
