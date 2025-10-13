import {
	Card,
	Chip,
	CardBody,
	CardFooter,
	Image,
	Divider,
} from "@heroui/react";
import { Item } from "@/model/Item";
export default function ItemCard({
	item,
	index,
}: {
	item: Item;
	index: number;
}) {
	const determinePluralText = (stock: number, soldBy: string) => {
		if (stock > 1) {
			return `${stock} ${soldBy}s left`;
		} else {
			return `${stock} ${soldBy} left`;
		}
	};

	return (
		<Card
			isPressable
			key={index}
			shadow="sm"
			onPress={() => console.log("item pressed")}
			className="transform transition-transform duration-300 hover:scale-105 cursor-pointer"
		>
			<CardBody className="overflow-visible p-0">
				<div className="relative">
					<Image
						isZoomed
						alt={item.title}
						className="w-full object-cover h-[140px] rounded-lg shadow-sm"
						src={item.img}
						width="100%"
					/>
					<Chip
						className="absolute top-2 left-2 z-10"
						color="default"
						size="sm"
					>
						Default
					</Chip>
				</div>
			</CardBody>

			<CardFooter className="text-small">
				<div className="flex flex-col w-full">
					{/* Product Name and Price */}
					<div className="flex justify-between w-full flex-col sm:flex-row items-center sm:items-baseline">
						<b>{item.title}</b>
						<p className="text-default-500 flex items-baseline mt-2 sm:mt-0 justify-center sm:justify-start">
							<span className="mr-1">{item.price}</span>
							<span className="font-bold text-sm">
								/ {item.soldBy}
							</span>
						</p>
					</div>

					<Divider className="my-2" />

					<span className="text-left text-xs font-light">
						{item.description.split(" ").slice(0, 10).join(" ")}
						{item.description.split(" ").length > 10 && " ..."}
					</span>

					<Divider className="my-3" />

					<div className="flex justify-between w-full flex-col sm:flex-row sm:items-center">
						<span className="text-xs font-light">
							{determinePluralText(
								Number(item.stocks),
								item.soldBy
							)}
						</span>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
}
