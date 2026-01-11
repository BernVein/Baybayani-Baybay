import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import ShopItems from "@/pages/Customer/ShopPage/ShopItems";
import ImageHeader from "./ImageHeader";
import Categories from "./Categories";

type CustomerLayoutContext = {
	searchTerm: string | null;
	setSearchTerm: (term: string | null) => void;
};

export default function Shop() {
	const { searchTerm, setSearchTerm } =
		useOutletContext<CustomerLayoutContext>();

	const [activeCategories, setActiveCategories] = useState<string[]>([]);

	useEffect(() => {
		document.title = "Baybayani | Shop";
	}, []);

	return (
		<div className="p-5 md:p-10 flex flex-col gap-4 md:w-3/4 mx-auto items-center">
			<ImageHeader />

			<Categories
				activeCategories={activeCategories}
				setActiveCategories={setActiveCategories}
			/>

			<ShopItems
				activeCategories={activeCategories}
				searchTerm={searchTerm}
				setActiveCategories={setActiveCategories}
				setSearchTerm={setSearchTerm}
			/>
		</div>
	);
}
