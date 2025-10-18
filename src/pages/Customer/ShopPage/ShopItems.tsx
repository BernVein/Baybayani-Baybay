import { useState, useEffect } from "react";
import ItemCard from "@/pages/Customer/ShopPage/ItemCard";
import { addToast, useDisclosure, Skeleton } from "@heroui/react";
import ItemInfoModal from "./ItemInfoModal/ItemInfoModal";
import { Item } from "@/model/Item";
import { useFetchItem } from "@/data/supabase/useFetchItem";

interface ShopItemsProps {
	activeCategory: string | null;
	searchTerm: string | null;
	setActiveCategory: (category: string | null) => void;
	setSearchTerm: (term: string | null) => void;
}

export default function ShopItems({
	activeCategory,
	searchTerm,
	setActiveCategory,
	setSearchTerm,
}: ShopItemsProps) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [selectedItem, setSelectedItem] = useState<Item | null>(null);

	// Use the hook to fetch items from Supabase
	const { itemList, loadMore, hasMore, fetchError, loading } = useFetchItem(
		activeCategory,
		searchTerm
	);

	// Infinite scroll: call loadMore() when near bottom
	useEffect(() => {
		const handleScroll = () => {
			if (
				window.innerHeight + window.scrollY >=
				document.documentElement.scrollHeight - 100
			) {
				if (hasMore) loadMore();
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [hasMore, loadMore]);

	// Show toast if search yields no results (Supabase already filtered)
	useEffect(() => {
		console.log("itemList:", itemList);

		if (!loading && itemList.length === 0) {
			if (searchTerm) {
				// User searched but no results
				addToast({
					title: "No results",
					description: `No items found for "${searchTerm}".`,
					severity: "warning",
					shouldShowTimeoutProgress: true,
				});

				// Reset category and retry search
				setActiveCategory(null);
				setSearchTerm(searchTerm);
			} else if (activeCategory) {
				// Category has no items
				addToast({
					title: "No items in category",
					description: `The selected category ${activeCategory} has no items. Showing all items.`,
					shouldShowTimeoutProgress: true,
				});

				setActiveCategory(null);
			}

			console.log("Done");
		}
	}, [
		loading,
		itemList,
		searchTerm,
		activeCategory,
		setActiveCategory,
		setSearchTerm,
	]);

	if (fetchError) {
		return (
			<div className="text-red-500 text-center mt-10">
				Error loading items: {fetchError}
			</div>
		);
	}

	return (
		<>
			<div className="flex flex-col w-full">
				<div className="gap-5 grid grid-cols-2 sm:grid-cols-4 mt-2 mb-2">
					{/* Real items */}
					{itemList.map((item) => (
						<ItemCard
							key={item.item_id}
							item={item}
							index={0}
							onPress={() => {
								setSelectedItem(item);
								onOpen();
							}}
						/>
					))}

					{/* Skeleton items */}
					{loading &&
						Array.from({ length: 8 }).map((_, index) => (
							<div
								key={`skeleton-${index}`}
								className="flex flex-col gap-2"
							>
								<Skeleton className="h-[140px] w-full rounded-lg" />{" "}
								{/* Image */}
								<Skeleton className="h-4 w-1/2 rounded" />{" "}
								{/* Category */}
								<Skeleton className="h-5 w-full rounded" />{" "}
								{/* Title */}
								<Skeleton className="h-4 w-3/4 rounded" />{" "}
								{/* Price Retail */}
								<Skeleton className="h-4 w-1/2 rounded" />{" "}
								{/* Price Wholesale */}
								<Skeleton className="h-12 w-full rounded" />{" "}
								{/* Description */}
								<Skeleton className="h-4 w-1/3 rounded" />{" "}
								{/* Stock */}
							</div>
						))}
				</div>
			</div>

			<ItemInfoModal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				item={selectedItem as Item}
			/>
		</>
	);
}
