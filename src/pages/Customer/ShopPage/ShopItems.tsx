import { useState, useEffect } from "react";
import ItemCard from "@/pages/Customer/ShopPage/ItemCard";
import { item } from "@/data/items";

interface ShopItemsProps {
	activeCategory: string | null;
	searchTerm: string | null;
}

export default function ShopItems({
	activeCategory,
	searchTerm,
}: ShopItemsProps) {
	const itemsPerLoad = 8;
	const [visibleItems, setVisibleItems] = useState(itemsPerLoad);

	useEffect(
		() => setVisibleItems(itemsPerLoad),
		[activeCategory, searchTerm]
	);

	const filteredItems = item
		.filter((i) => !activeCategory || i.category === activeCategory)
		.filter(
			(i) =>
				!searchTerm ||
				i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				i.category.toLowerCase().includes(searchTerm.toLowerCase())
		);

	const currentItems = filteredItems.slice(0, visibleItems);

	useEffect(() => {
		const handleScroll = () => {
			if (
				window.innerHeight + window.scrollY >=
				document.documentElement.scrollHeight - 100
			) {
				setVisibleItems((prev) =>
					Math.min(prev + itemsPerLoad, filteredItems.length)
				);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [filteredItems.length]);

	return (
		<div className="flex flex-col w-full">
			{currentItems.length > 0 ? (
				<div className="gap-5 grid grid-cols-2 sm:grid-cols-4 mt-2 mb-2">
					{currentItems.map((data, index) => (
						<ItemCard item={data} index={index} key={index} />
					))}
				</div>
			) : (
				<p className="text-center text-sm mt-4">No item/s found.</p>
			)}
		</div>
	);
}
