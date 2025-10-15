import { useState } from "react";
import ShopItems from "@/pages/Customer/ShopPage/ShopItems";
import ImageHeader from "./ImageHeader";
import Categories from "./Categories";

export default function Shop({ searchTerm }: { searchTerm: string | null }) {
	const [activeCategory, setActiveCategory] = useState<string | null>("");
	return (
		<div className="p-5 sm:p-10 flex flex-col gap-4 md:w-3/4 mx-auto items-center">
			<ImageHeader />
			<Categories
				activeCategory={activeCategory}
				setActiveCategory={setActiveCategory}
			/>
			<ShopItems
				activeCategory={activeCategory}
				searchTerm={searchTerm}
			/>
		</div>
	);
}
