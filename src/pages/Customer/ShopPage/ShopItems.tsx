import { useState, useEffect } from "react";
import ItemCard from "@/pages/Customer/ShopPage/ItemCard";
import { item } from "@/data/items";
import { addToast, useDisclosure } from "@heroui/react";
import ItemInfoModal from "./ItemInfoModal/ItemInfoModal";
import { Item } from "@/model/Item";
interface ShopItemsProps {
	activeCategory: string | null;
	searchTerm: string | null;
	setActiveCategory: (category: string | null) => void;
}

export default function ShopItems({
	activeCategory,
	searchTerm,
	setActiveCategory,
}: ShopItemsProps) {
	const itemsPerLoad = 8;
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [, setVisibleItems] = useState(itemsPerLoad);
	const [selectedItem, setSelectedItem] = useState<Item | null>(null);

	const [currentItems, setCurrentItems] = useState(
		item.slice(0, itemsPerLoad)
	);

	// Update visible items only if filteredItems exist
	useEffect(() => {
		const filteredItems = item
			.filter((i) => !activeCategory || i.category === activeCategory)
			.filter(
				(i) =>
					!searchTerm ||
					i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					i.category.toLowerCase().includes(searchTerm.toLowerCase())
			);

		if (filteredItems.length === 0) {
			// Show toast
			if (searchTerm && !activeCategory) {
				addToast({
					title: "No results",
					description: `No items found for "${searchTerm}".`,
					severity: "warning",
					shouldShowTimeoutProgress: true,
				});
				setActiveCategory(null);
			} else if (searchTerm && activeCategory) {
				addToast({
					title: "No items in this category",
					description: `No items match "${searchTerm}" in "${activeCategory}".`,
					severity: "warning",
					shouldShowTimeoutProgress: true,
				});
				setActiveCategory(null);
			}
			return;
		}

		// Update visible items & current items
		setVisibleItems(itemsPerLoad);
		setCurrentItems(filteredItems.slice(0, itemsPerLoad));
	}, [activeCategory, searchTerm]);

	// Infinite scroll
	useEffect(() => {
		const handleScroll = () => {
			const filteredItems = item
				.filter((i) => !activeCategory || i.category === activeCategory)
				.filter(
					(i) =>
						!searchTerm ||
						i.title
							.toLowerCase()
							.includes(searchTerm.toLowerCase()) ||
						i.category
							.toLowerCase()
							.includes(searchTerm.toLowerCase())
				);

			if (filteredItems.length === 0) return;

			if (
				window.innerHeight + window.scrollY >=
				document.documentElement.scrollHeight - 100
			) {
				setVisibleItems((prev) => {
					const nextVisible = Math.min(
						prev + itemsPerLoad,
						filteredItems.length
					);
					setCurrentItems(filteredItems.slice(0, nextVisible));
					return nextVisible;
				});
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [activeCategory, searchTerm]);

	return (
		<>
			<div className="flex flex-col w-full">
				{currentItems.length > 0 && (
					<div className="gap-5 grid grid-cols-2 sm:grid-cols-4 mt-2 mb-2">
						{currentItems.map((data, index) => (
							<ItemCard
								item={data}
								index={index}
								key={index}
								onPress={() => {
									setSelectedItem(data); // store clicked item
									onOpen(); // open modal
								}}
							/>
						))}
					</div>
				)}
			</div>
			<ItemInfoModal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				item={selectedItem as Item}
			/>
		</>
	);
}
