import {
	Card,
	Chip,
	CardBody,
	CardFooter,
	Image,
	Button,
	Divider,
	NumberInput,
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@heroui/react";
import { Item } from "@/model/Item";
import { CartIcon } from "@/components/icons";
export default function ItemCard({
	item,
	index,
}: {
	item: Item;
	index: number;
}) {
	const splitDescription = (text: string) => {
		return text
			.split(" ") // Split the description into words
			.reduce((acc: string[][], word, index) => {
				if (index % 5 === 0) acc.push([]); // Start a new line after 5 words
				acc[acc.length - 1].push(word); // Add word to the current line
				return acc;
			}, [] as string[][])
			.map((line, index) => (
				<div key={index} className="text-sm">
					{line.join(" ")} {/* Join the words to form a line */}
				</div>
			));
	};
	return (
		<Card
			key={index}
			shadow="sm"
			onPress={() => console.log("item pressed")}
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

					{/* Popover for full description */}
					<Popover placement="bottom" size="sm">
						<PopoverTrigger>
							<span className="text-left text-xs font-light">
								{item.description
									.split(" ")
									.slice(0, 10)
									.join(" ")}
								{item.description.split(" ").length > 10 &&
									" ..."}
							</span>
						</PopoverTrigger>
						<PopoverContent>
							<div className="px-1 py-2">
								<div className="text-small font-bold">
									Full Description
								</div>
								<div className="text-tiny">
									{splitDescription(item.description)}
								</div>
							</div>
						</PopoverContent>
					</Popover>

					<Divider className="my-3" />

					<div className="flex justify-between w-full flex-col sm:flex-row sm:items-center">
						<div className="w-full sm:w-1/2">
							<NumberInput
								className="max-w-xs"
								placeholder="Enter quantity"
								size="sm"
								labelPlacement="outside"
							/>
						</div>
						<div className="w-full sm:w-1/2 text-right mt-2 sm:mt-0">
							<span className="text-xs font-light">
								Stocks: {item.stocks} {item.soldBy}s
							</span>
						</div>
					</div>
					<Button
						color="success"
						variant="solid"
						className="w-full mt-3"
					>
						<CartIcon className="size-5 text-white" />
						<p className="text-white">Add to Cart</p>
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
}
