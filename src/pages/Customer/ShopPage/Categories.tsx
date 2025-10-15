import {
	VegetablesOutline,
	FoodGrains24Regular,
	FruitsOutline,
	PoultryLeg,
	Chili,
} from "@/components/icons";
import { ScrollShadow, Button } from "@heroui/react";
import { useState } from "react";

interface Category {
	name: string;
	icon: React.ReactElement;
}

const cat: Category[] = [
	{ name: "Vegetables", icon: <VegetablesOutline /> },
	{ name: "Grains", icon: <FoodGrains24Regular /> },
	{ name: "Fruits", icon: <FruitsOutline /> },
	{ name: "Poultry", icon: <PoultryLeg /> },
	{ name: "Spices", icon: <Chili /> },
];

export default function Categories() {
	const [activeCategory, setActiveCategory] = useState<string | null>(null);

	return (
		<div className="w-full px-4">
			<p className="text-left md:text-center">Filter Products</p>

			<ScrollShadow
				orientation="horizontal"
				className="w-full scroll-smooth p-2"
			>
				<div className="flex justify-center items-center gap-5 sm:gap-10 min-w-max mx-auto snap-x snap-mandatory">
					{cat.map((item) => (
						<div
							key={item.name}
							className="flex items-center flex-shrink-0"
						>
							<div className="flex flex-col items-center flex-shrink-0 snap-center">
								<Button
									startContent={item.icon}
									aria-label={item.name}
									radius="full"
									color={
										activeCategory === item.name
											? "success"
											: "default"
									}
									onPress={() =>
										setActiveCategory((prev) =>
											prev === item.name
												? null
												: item.name
										)
									}
								>
									{item.name}
								</Button>
							</div>
						</div>
					))}
				</div>
			</ScrollShadow>
		</div>
	);
}
