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
import ItemInfoModal from "./ItemInfoModal/ItemInfoModalIndex";
import { Item } from "@/model/Item";
import { useFetchItem } from "@/data/supabase/useFetchItem";
interface ShopItemsProps {
	activeCategory: string | null;
	searchTerm: string | null;
	setActiveCategory: (category: string | null) => void;
	setSearchTerm: (term: string | null) => void;
}
import { XIcon } from "@/components/icons";
export default function ShopItems({
	activeCategory,
	searchTerm,
	setActiveCategory,
	setSearchTerm,
}: ShopItemsProps) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [selectedItem, setSelectedItem] = useState<Item | null>(null);
	const hasFetchedOnce = useRef(false);

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

		// Reset toast if items exist
		if (itemList.length > 0) {
			hasFetchedOnce.current = true;
			toastShown.current = false;
			return;
		}
		if (!hasFetchedOnce.current) return;
		// Only run if a toast hasn't been shown yet
		if (!toastShown.current) {
			// CASE 3: Search term exists but no items at all (any category)
			if (searchTerm && itemList.length === 0 && !activeCategory) {
				addToast({
					title: "No items found",
					description: `No items found for "${searchTerm}" in any category. Showing all items instead.`,
					severity: "warning",
					shouldShowTimeoutProgress: true,
				});

				// Reset everything
				setActiveCategory(null);
				setSearchTerm(null);
			}
			// CASE 2: Search term exists but no items in current category
			else if (searchTerm && itemList.length === 0 && activeCategory) {
				addToast({
					title: "No results",
					description: `No items found for "${searchTerm}" in ${activeCategory}.`,
					severity: "warning",
					shouldShowTimeoutProgress: true,
				});

				// Remove category filter, keep search term
				setActiveCategory(null);
				setSearchTerm(searchTerm);
			}
			// CASE 1: Category exists but has no items
			else if (!searchTerm && activeCategory && itemList.length === 0) {
				addToast({
					title: "No items in category",
					description: `${activeCategory} has no items. Showing all items instead.`,
					severity: "warning",
					shouldShowTimeoutProgress: true,
				});

				// Reset category
				setActiveCategory(null);
			}

			toastShown.current = true; // mark toast as shown
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
				{searchTerm && searchTerm.trim() !== "" && (
					<>
						<div className="flex flex-row mb-5 gap-3 items-center">
							<div className="text-2xl">
								Search Results for "{searchTerm}"
								{activeCategory &&
									activeCategory.trim() !== "" &&
									` in ${activeCategory}`}
							</div>
							<Button
								color="danger"
								onPress={() => {
									setActiveCategory(null);
									setSearchTerm(null);
								}}
								startContent={<XIcon className="size-5" />}
								size="sm"
								isIconOnly
							/>
						</div>
					</>
				)}

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
