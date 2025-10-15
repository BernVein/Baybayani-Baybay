import { useState, useEffect } from "react";
import ItemCard from "@/pages/Customer/ShopPage/ItemCard";
import { item } from "@/data/items";
import { Pagination } from "@heroui/react";

interface ShopItemsProps {
	activeCategory: string | null;
}

export default function ShopItems({ activeCategory }: ShopItemsProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 8;

	// Reset to page 1 whenever category changes
	useEffect(() => {
		setCurrentPage(1);
	}, [activeCategory]);

	// filter items by active category
	const filteredItems = activeCategory
		? item.filter((i) => i.category === activeCategory)
		: item;

	const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

	const currentItems = filteredItems.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	return (
		<div className="flex flex-col w-full">
			{filteredItems.length > 0 && (
				<div className="gap-5 grid grid-cols-2 sm:grid-cols-4 mt-2 mb-2">
					{currentItems.map((data, index) => (
						<ItemCard
							item={data}
							index={(currentPage - 1) * itemsPerPage + index}
							key={(currentPage - 1) * itemsPerPage + index}
						/>
					))}
				</div>
			)}

			{filteredItems.length === 0 && (
				<p className="text-center text-sm mt-4">
					No items found in this category.
				</p>
			)}

			{filteredItems.length > 0 && (
				<div className="flex justify-center mt-4">
					<Pagination
						initialPage={currentPage}
						total={totalPages}
						onChange={(page) => setCurrentPage(page)}
						color="success"
						showControls
					/>
				</div>
			)}
		</div>
	);
}
