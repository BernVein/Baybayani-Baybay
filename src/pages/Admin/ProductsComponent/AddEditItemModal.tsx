import {
	Button,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
	Divider,
	addToast,
	Skeleton,
} from "@heroui/react";
import { useState, useEffect } from "react";

import { PhotoIcon } from "@/components/icons";
import { ItemInitialDetail } from "@/pages/Admin/ProductsComponent/AddEditItemModalComponent/AddEditVariantModalComponent/ItemInitialDetail";
import { AddEditVariantModal } from "@/pages/Admin/ProductsComponent/AddEditItemModalComponent/AddEditVariantModal";
import { Item } from "@/model/Item";
import { VariantList } from "@/pages/Admin/ProductsComponent/AddEditItemModalComponent/VariantList";
import { CloseWarningModal } from "@/pages/Admin/ProductsComponent/AddEditItemModalComponent/CloseWarningModal";
import { AddVariantButton } from "@/pages/Admin/ProductsComponent/AddEditItemModalComponent/AddVariantButton";
import { AddPhotoModal } from "@/pages/Admin/ProductsComponent/AddEditItemModalComponent/AddPhotoModal";
import { addItem } from "@/data/supabase/Admin/Products/addItem";
import { useFetchItemById } from "@/data/supabase/Customer/Products/useFetchSingleItem";
import { editItemInfo } from "@/data/supabase/Admin/Products/editItemInfo";

export function AddEditItemModal({
	selectedItemId,
	itemHasVariant,
	isOpen,
	onOpenChange,
}: {
	selectedItemId: string | null;
	itemHasVariant: boolean;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const {
		isOpen: isOpenAddVar,
		onOpen: onOpenAddVar,
		onOpenChange: onOpenChangeAddVar,
	} = useDisclosure();

	const {
		isOpen: isOpenWarning,
		onOpen: onOpenWarning,
		onOpenChange: onOpenChangeWarning,
	} = useDisclosure();

	const {
		isOpen: isOpenPhoto,
		onOpen: onOpenPhoto,
		onOpenChange: onOpenChangePhoto,
	} = useDisclosure();

	const [item, setItem] = useState<Item>({
		item_title: "",
		item_category_id: "",
		item_description: "",
		item_sold_by: "",
		item_tag_id: "",
		item_img: [null, null, null, null],
		item_has_variant: itemHasVariant,
		item_variants: [],
	});

	const { item: fetchedItem, loading: isFetchingItem } =
		useFetchItemById(selectedItemId);
	useEffect(() => {
		if (!selectedItemId) return;
		if (!fetchedItem) return;

		setItem({
			...fetchedItem,
			item_has_variant: itemHasVariant,
		});
	}, [selectedItemId, fetchedItem, itemHasVariant]);

	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isUpdateLoading, setIsUpdateLoading] = useState(false);
	const selectedCount = item.item_img.filter(Boolean).length;

	function validate(): boolean {
		if (!item.item_title.trim()) return false;
		if (!item.item_category_id?.trim()) return false;
		if (!item.item_sold_by.trim()) return false;
		if (selectedCount === 0) return false;

		return true;
	}

	useEffect(() => {
		if (!isOpen) return;

		setIsSubmitted(false);

		if (!selectedItemId) {
			setItem({
				item_title: "",
				item_category_id: "",
				item_description: "",
				item_sold_by: "",
				item_tag_id: "",
				item_img: [null, null, null, null],
				item_has_variant: itemHasVariant,
				item_variants: [],
			});
		}
	}, [isOpen, selectedItemId, itemHasVariant]);

	const isItemPristine = () => {
		const defaultItem: Item = {
			item_title: "",
			item_category_id: "",
			item_description: "",
			item_sold_by: "",
			item_tag_id: "",
			item_img: [null, null, null, null],
			item_variants: [],
		};

		const isDefaultItem =
			item.item_title === defaultItem.item_title &&
			item.item_category_id === defaultItem.item_category_id &&
			item.item_description === defaultItem.item_description &&
			item.item_sold_by === defaultItem.item_sold_by &&
			item.item_tag_id === defaultItem.item_tag_id &&
			item.item_variants.length === 0;

		const noImages = item.item_img.every((img) => img === null);

		return isDefaultItem && noImages;
	};
	const [isAddLoading, setIsAddLoading] = useState(false);

	const handleUpdateItem = async () => {
		if (!item.item_id) {
			console.error("Item ID is missing");
			return;
		}

		setIsUpdateLoading(true);
		const result = await editItemInfo(item.item_id, item);

		if (result.success) {
			addToast({
				title: "Success",
				description: "Item has been successfully updated.",
				timeout: 3000,
				severity: "success",
				color: "success",
				shouldShowTimeoutProgress: true,
			});
		} else {
			addToast({
				title: "Error",
				description: "An error occurred while updating the item.",
				timeout: 3000,
				severity: "danger",
				color: "danger",
				shouldShowTimeoutProgress: true,
			});
		}

		setIsUpdateLoading(false);
	};

	const handleAddItem = async () => {
		setIsSubmitted(true);
		setIsAddLoading(true);
		if (!validate()) {
			setIsAddLoading(false);
			addToast({
				title: "Invalid",
				description: "Please fill in all required fields.",
				timeout: 3000,
				severity: "danger",
				color: "danger",
				shouldShowTimeoutProgress: true,
			});

			return;
		}

		const result = await addItem(item);

		if (result.success) {
			addToast({
				title: "Item Added",
				description: `Item ${item.item_title} has been successfully added.`,
				timeout: 3000,
				severity: "success",
				color: "success",
				shouldShowTimeoutProgress: true,
			});
			onOpenChange(false);
			setIsAddLoading(false);
		} else {
			addToast({
				title: "Invalid",
				description:
					String(result.error) ||
					"An error occurred while adding the item.",
				timeout: 3000,
				severity: "danger",
				color: "danger",
				shouldShowTimeoutProgress: true,
			});
			setIsAddLoading(false);
		}
	};

	const normalizedImages: (File | string | null)[] = [
		...item.item_img,
		...Array(4 - item.item_img.length).fill(null),
	].slice(0, 4);

	return (
		<>
			<Modal
				disableAnimation
				isDismissable={false}
				isOpen={isOpen}
				scrollBehavior="inside"
				size="xl"
				onOpenChange={(open) => {
					if (!open) {
						if (!isItemPristine()) {
							onOpenWarning();
						} else {
							onOpenChange(false);
						}
					} else {
						onOpenChange(true);
					}
				}}
			>
				<ModalContent>
					<>
						<ModalHeader className="flex flex-col gap-1">
							<div className="flex flex-col gap-2">
								<span className="text-lg font-semibold">
									{selectedItemId ? "Edit Item" : "Add Item"}{" "}
									<span className="font-extrabold">
										{itemHasVariant
											? "with variant"
											: "without variant"}
									</span>
								</span>
								{!selectedItemId && (
									<span className="text-sm text-default-500 italic">
										Changes here are temporary. The item
										will be officially added only when you
										click the{" "}
										<span className="text-success-500 font-semibold">
											Add Item
										</span>{" "}
										button below.
									</span>
								)}
							</div>
						</ModalHeader>
						<ModalBody>
							<span className="text-lg font-semibold">
								{selectedItemId ? "Edit" : "Add"} Item Details
							</span>
							{isFetchingItem ? (
								<div className="flex flex-col gap-4">
									{/* Item Details Skeleton */}
									<div className="flex flex-col gap-3 mt-4">
										<div className="flex w-full gap-3">
											<Skeleton className="h-13 w-1/2 rounded-lg" />
											<Skeleton className="h-13 w-1/2 rounded-lg" />
										</div>

										<Skeleton className="h-13 w-full rounded-lg" />

										<div className="flex w-full gap-3">
											<Skeleton className="h-13 w-1/2 rounded-lg" />
											<Skeleton className="h-13 w-1/2 rounded-lg" />
										</div>
									</div>

									{/* Photo Button Skeleton */}
									<Skeleton className="h-12 w-full mt-2 rounded-lg" />
									{itemHasVariant && (
										/* Variant List Skeleton */
										<div className="flex flex-col gap-3 pr-2">
											{Array.from({ length: 2 }).map(
												(_, index) => (
													<div key={index}>
														{/* Card Header Skeleton */}
														<div className="flex justify-between items-start p-3">
															<div className="flex flex-col gap-1 w-full">
																<Skeleton className="h-5 w-1/3" />
																<Skeleton className="h-3 w-1/4" />
															</div>
															<div className="flex gap-2 ml-auto">
																<Skeleton className="h-8 w-8 rounded-full" />
																<Skeleton className="h-8 w-8 rounded-full" />
															</div>
														</div>

														<Divider />

														{/* Card Body Skeleton */}
														<div className="py-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
															<Skeleton className="h-4 w-full" />
															<Skeleton className="h-4 w-full" />
															<Skeleton className="h-4 w-full" />
															<Skeleton className="h-4 w-full" />
															<Skeleton className="h-4 w-full" />
															<Skeleton className="h-4 w-full" />
															<Skeleton className="h-4 w-full" />
															<Skeleton className="h-4 w-full" />
														</div>
													</div>
												),
											)}
										</div>
									)}
								</div>
							) : (
								<div className="flex flex-col">
									<ItemInitialDetail
										isSubmitted={isSubmitted}
										item={item}
										setItem={setItem}
									/>

									<div className="flex flex-col gap-3 mt-2">
										<Button
											className="w-full gap-1"
											color={
												isSubmitted &&
												selectedCount === 0
													? "danger"
													: "default"
											}
											startContent={
												<PhotoIcon className="w-5" />
											}
											onPress={onOpenPhoto}
										>
											{isSubmitted && selectedCount === 0
												? "Photo is required"
												: "Add Photos"}
											{selectedCount > 0 &&
												`(${selectedCount})`}
											<span className="text-red-500">
												*
											</span>
										</Button>
										{selectedItemId && (
											<Button
												color="success"
												isDisabled={!validate()}
												isLoading={
													selectedItemId
														? isUpdateLoading
														: isAddLoading
												}
												onPress={
													selectedItemId
														? handleUpdateItem
														: handleAddItem
												}
											>
												Update Item Details
											</Button>
										)}

										{(itemHasVariant ||
											item.item_variants.length ===
												0) && (
											<AddVariantButton
												item={item}
												itemHasVariant={itemHasVariant}
												setIsSubmitted={setIsSubmitted}
												validate={validate}
												onOpenAddVar={onOpenAddVar}
											/>
										)}
									</div>

									{itemHasVariant && (
										<>
											<Divider className="my-4" />
											<p className="text-base font-semibold mb-2">
												Variant List{" "}
												{item.item_variants.length
													? `(${item.item_variants.length})`
													: ""}
											</p>
										</>
									)}
									<div className="flex flex-col gap-3 pr-2">
										<VariantList
											isEditDB={
												selectedItemId ? true : false
											}
											isFetchingItem={isFetchingItem}
											item={item}
											itemHasVariant={itemHasVariant}
											setItem={setItem}
										/>
									</div>
								</div>
							)}
						</ModalBody>
						<ModalFooter className="justify-between items-center">
							<span className="text-sm text-default-500 italic">
								<span className="text-red-500">*</span> Required
								field
							</span>

							<div className="flex gap-2">
								<Button
									color="danger"
									variant="light"
									onPress={() => {
										if (!isItemPristine()) onOpenWarning();
										else onOpenChange(false);
									}}
								>
									Cancel
								</Button>
								{!selectedItemId && (
									<Button
										color="success"
										isDisabled={!validate()}
										isLoading={
											selectedItemId
												? isUpdateLoading
												: isAddLoading
										}
										onPress={
											selectedItemId
												? handleUpdateItem
												: handleAddItem
										}
									>
										{selectedItemId
											? "Update Item"
											: "Add Item"}
									</Button>
								)}
							</div>
						</ModalFooter>
					</>
				</ModalContent>
			</Modal>
			<AddEditVariantModal
				isEditDB={selectedItemId ? true : false}
				defaultVariant={null}
				isOpenAddVar={isOpenAddVar}
				itemHasVariant={itemHasVariant}
				itemUnitOfMeasure={item.item_sold_by}
				onAddEditVariant={(newVariant) =>
					setItem((prev) => ({
						...prev,
						item_variants: [
							...prev.item_variants,
							{
								...newVariant,
								variant_name: itemHasVariant
									? newVariant.variant_name
									: prev.item_title,
							},
						],
					}))
				}
				onOpenChangeAddVar={onOpenChangeAddVar}
			/>
			<CloseWarningModal
				isOpenWarning={isOpenWarning}
				onConfirmClose={() => {
					onOpenChange(false);
				}}
				onOpenChangeWarning={onOpenChangeWarning}
			/>
			<AddPhotoModal
				images={normalizedImages}
				isOpen={isOpenPhoto}
				setImages={(newImages) => {
					setItem((prev) => {
						const resolved =
							typeof newImages === "function"
								? newImages(prev.item_img)
								: newImages;

						return {
							...prev,
							item_img: [
								...resolved,
								...Array(4 - resolved.length).fill(null),
							].slice(0, 4) as Item["item_img"],
						};
					});
				}}
				onOpenChange={onOpenChangePhoto}
			/>
		</>
	);
}
