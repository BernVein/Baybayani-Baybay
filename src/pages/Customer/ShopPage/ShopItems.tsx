import { useState, useEffect, useRef } from "react";
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
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
} from "@heroui/react";

import ItemCard from "@/pages/Customer/ShopPage/ItemCard";
import ItemInfoModal from "@/pages/Customer/ShopPage/ItemInfoModal/ItemInfoModalIndex";
import { useFetchItemCardItems } from "@/data/supabase/Customer/Products/useFetchItemCardItems";

interface ShopItemsProps {
	activeCategories: string[];
	searchTerm: string | null;
	setActiveCategories: (categories: string[]) => void;
	setSearchTerm: (term: string | null) => void;
	sortOption: string;
	setSortOption: (option: string) => void;
}
import { XIcon, SortIcon } from "@/components/icons";
export default function ShopItems({
	activeCategories,
	searchTerm,
	setActiveCategories,
	setSearchTerm,
	sortOption,
	setSortOption,
}: ShopItemsProps) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
	const hasFetchedOnce = useRef(false);

	// Use the hook to fetch items from Supabase
	const { items, loadMore, hasMore, error, loading } = useFetchItemCardItems(
		activeCategories,
		searchTerm,
		sortOption,
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
		if (items.length > 0) {
			hasFetchedOnce.current = true;
			toastShown.current = false;

			return;
		}
		if (!hasFetchedOnce.current) return;
		// Only run if a toast hasn't been shown yet
		if (!toastShown.current) {
			// CASE 3: Search term exists but no items at all (any category)
			if (
				searchTerm &&
				items.length === 0 &&
				activeCategories.length === 0
			) {
				addToast({
					title: "No items found",
					description: `No items found for "${searchTerm}" in any category. Showing all items instead.`,
					severity: "warning",
					shouldShowTimeoutProgress: true,
				});

				// Reset everything
				setActiveCategories([]);
				setSearchTerm(null);
			}
			// CASE 2: Search term exists but no items in current category
			else if (
				searchTerm &&
				items.length === 0 &&
				activeCategories.length > 0
			) {
				addToast({
					title: "No results",
					description: `No items found for "${searchTerm}" in selected categories.`,
					severity: "warning",
					shouldShowTimeoutProgress: true,
				});

				// Remove category filter, keep search term
				setActiveCategories([]);
				setSearchTerm(searchTerm);
			}
			// CASE 1: Category exists but has no items
			else if (
				!searchTerm &&
				activeCategories.length > 0 &&
				items.length === 0
			) {
				addToast({
					title: "No items in category",
					description: `Selected categories have no items. Showing all items instead.`,
					severity: "warning",
					color: "warning",
					shouldShowTimeoutProgress: true,
				});

				// Reset category
				setActiveCategories([]);
			}

			toastShown.current = true; // mark toast as shown
		}
	}, [
		loading,
		items,
		searchTerm,
		activeCategories,
		setActiveCategories,
		setSearchTerm,
	]);

	if (error) {
		return (
			<Modal
				backdrop="blur"
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
				<div className="flex flex-row justify-between items-center mb-4">
					<div className="flex flex-row gap-3 items-center">
						{searchTerm && searchTerm.trim() !== "" && (
							<>
								<div className="text-xl md:text-2xl">
									Results for "{searchTerm}"
								</div>
								<Button
									isIconOnly
									color="danger"
									size="sm"
									variant="flat"
									startContent={<XIcon className="size-4" />}
									onPress={() => {
										setActiveCategories([]);
										setSearchTerm(null);
									}}
								/>
							</>
						)}
					</div>

					<Dropdown>
						<DropdownTrigger>
							<Button
								variant="flat"
								startContent={<SortIcon className="size-4" />}
								className="font-medium"
							>
								Sort By
							</Button>
						</DropdownTrigger>
						<DropdownMenu
							aria-label="Sort options"
							disallowEmptySelection
							selectionMode="single"
							selectedKeys={new Set([sortOption])}
							onSelectionChange={(keys) => {
								const selected = Array.from(keys)[0] as string;
								setSortOption(selected);
							}}
						>
							<DropdownItem key="name_asc">
								Name (A-Z)
							</DropdownItem>
							<DropdownItem key="name_desc">
								Name (Z-A)
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>

				<div className="gap-5 grid grid-cols-2 sm:grid-cols-4 mt-2 mb-2">
					{/* Real items */}
					{items.map((item) => (
						<ItemCard
							key={item.item_id}
							index={0}
							item_category={item.item_category}
							item_first_img={item.item_first_img}
							item_first_variant_retail_price={
								item.item_first_variant_retail_price
							}
							item_sold_by={item.item_sold_by}
							item_tag={item.item_tag ?? null}
							item_title={item.item_title}
							onPress={() => {
								setSelectedItemId(item.item_id);
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
							</div>
						))}
				</div>
			</div>

			<ItemInfoModal
				isOpen={isOpen}
				itemId={selectedItemId}
				onOpenChange={onOpenChange}
			/>
		</>
	);
}
