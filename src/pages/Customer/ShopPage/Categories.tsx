import {
	VegetablesOutline,
	FoodGrains24Regular,
	FruitsOutline,
	PoultryLeg,
	Chili,
} from "@/components/icons";
import { ScrollShadow, Button } from "@heroui/react";
import { XIcon } from "@/components/icons";
interface Category {
	name: string;
	icon: React.ReactElement;
}

const cat: Category[] = [
	{ name: "Vegetable", icon: <VegetablesOutline /> },
	{ name: "Grain", icon: <FoodGrains24Regular /> },
	{ name: "Fruit", icon: <FruitsOutline /> },
	{ name: "Poultry", icon: <PoultryLeg /> },
	{ name: "Spice", icon: <Chili /> },
];

interface CategoriesProps {
    activeCategories: string[];
    setActiveCategories: (categories: string[]) => void;
}

export default function Categories({
    activeCategories,
    setActiveCategories,
}: CategoriesProps) {
    return (
		<div className="w-full px-4">
			<p className="text-left md:text-center mb-2 font-semibold">
				Filter Products
			</p>

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
                                    endContent={
                                        activeCategories.includes(item.name) ? (
                                            <XIcon className="size-5" />
                                        ) : null
                                    }
                                    aria-label={item.name}
                                    radius="full"
                                    color={
                                        activeCategories.includes(item.name)
                                            ? "success"
                                            : "default"
                                    }
                                    onPress={() => {
                                        const selected = activeCategories.includes(item.name);
                                        if (selected) {
                                            setActiveCategories(activeCategories.filter((n) => n !== item.name));
                                        } else {
                                            setActiveCategories([...activeCategories, item.name]);
                                        }
                                    }}
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
