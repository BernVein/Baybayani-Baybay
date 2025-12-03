import { useState, useEffect } from "react";
import ShopItems from "@/pages/Customer/ShopPage/ShopItems";
import ImageHeader from "./ImageHeader";
import Categories from "./Categories";

export default function Shop({
    searchTerm,
    setSearchTerm,
}: {
    searchTerm: string | null;
    setSearchTerm: (term: string | null) => void;
}) {
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
