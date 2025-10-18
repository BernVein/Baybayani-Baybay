import { useState, useEffect, useRef } from "react";
import ItemCard from "@/pages/Customer/ShopPage/ItemCard";
import {
	addToast,
	useDisclosure,
	Skeleton,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
} from "@heroui/react";
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

	const toastShown = useRef(false);

	// Show toast if search yields no results (Supabase already filtered)
	useEffect(() => {
		if (loading) return; // wait for items to finish loading

		// If items exist, reset the toast tracker
		if (itemList.length > 0) {
			toastShown.current = false;
			return;
		}

		// Only run if a toast hasn't been shown yet
		if (!toastShown.current) {
			if (searchTerm && itemList.length === 0) {
				// Search term exists but no results
				addToast({
					title: "No results",
					description: `No items found for "${searchTerm}"${
						activeCategory ? ` in ${activeCategory}` : ""
					}. Showing all items instead.`,
					severity: "warning",
					shouldShowTimeoutProgress: true,
				});

				// Fallback: remove category filter but keep the search term
				setActiveCategory(null);
				setSearchTerm(searchTerm);
			} else if (!searchTerm && activeCategory && itemList.length === 0) {
				// Category has no items
				addToast({
					title: "No items in category",
					description: `The selected category "${activeCategory}" has no items. Showing all items instead.`,
					severity: "warning",
					shouldShowTimeoutProgress: true,
				});

				// Reset category
				setActiveCategory(null);
			}

			// Mark toast as shown to prevent repeats
			toastShown.current = true;
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
			<Modal
				isOpen
				onOpenChange={() => {
					/* do nothing */
				}}
			>
				<ModalContent className="max-w-sm">
					<ModalHeader>No Internet Detected</ModalHeader>
					<ModalBody>
						<p className="text-sm text-default-500">
							Unable to load items. Please check your internet
							connection and try again later.
						</p>
					</ModalBody>
					<ModalFooter>
						<Button
							onPress={() => {
								window.location.reload();
							}}
						>
							Retry
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
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
