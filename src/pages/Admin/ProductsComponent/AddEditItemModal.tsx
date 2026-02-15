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
import {
	UpdateConfirmationModal,
	ChangeDetail,
} from "@/pages/Admin/ProductsComponent/AddEditItemModalComponent/UpdateConfirmationModal";
import { useFetchCategories } from "@/data/supabase/useFetchCategories";
import { useFetchTags } from "@/data/supabase/useFetchTags";
import { AddEditItemModalSkeleton } from "@/components/skeletons/Admin/Products/AddEditItemModalSkeleton";

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

	const {
		isOpen: isOpenUpdateConfirm,
		onOpen: onOpenUpdateConfirm,
		onOpenChange: onOpenChangeUpdateConfirm,
	} = useDisclosure();

	const { categories } = useFetchCategories();
	const { tags } = useFetchTags();

	const [changes, setChanges] = useState<ChangeDetail[]>([]);
	const [localBaseline, setLocalBaseline] = useState<Item | null>(null);

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

		const initializedItem = {
			...fetchedItem,
			item_has_variant: itemHasVariant,
		};

		setItem(initializedItem);
		setLocalBaseline(initializedItem);
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

		if (!validate()) {
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

		const newChanges: ChangeDetail[] = [];

		if (fetchedItem) {
			if (item.item_title !== fetchedItem.item_title) {
				newChanges.push({
					field: "Item Name",
					oldValue: fetchedItem.item_title,
					newValue: item.item_title,
				});
			}

			if (item.item_category_id !== fetchedItem.item_category_id) {
				const oldCat = categories.find(
					(c) => c.category_id === fetchedItem.item_category_id,
				)?.category_name;
				const newCat = categories.find(
					(c) => c.category_id === item.item_category_id,
				)?.category_name;

				newChanges.push({
					field: "Category",
					oldValue: oldCat || "N/A",
					newValue: newCat || "N/A",
				});
			}

			if (item.item_description !== fetchedItem.item_description) {
				newChanges.push({
					field: "Description",
					oldValue: fetchedItem.item_description || "N/A",
					newValue: item.item_description || "N/A",
				});
			}

			if (item.item_sold_by !== fetchedItem.item_sold_by) {
				newChanges.push({
					field: "Unit of Measure",
					oldValue: fetchedItem.item_sold_by,
					newValue: item.item_sold_by,
				});
			}

			if (item.item_tag_id !== fetchedItem.item_tag_id) {
				const oldTag = tags.find(
					(t) => t.tag_id === fetchedItem.item_tag_id,
				)?.tag_name;
				const newTag = tags.find(
					(t) => t.tag_id === item.item_tag_id,
				)?.tag_name;

				newChanges.push({
					field: "Tag",
					oldValue: oldTag || "None",
					newValue: newTag || "None",
				});
			}

			// For images and variants, we can show a simplified diff
			if (
				JSON.stringify(item.item_img) !==
				JSON.stringify(fetchedItem.item_img)
			) {
				newChanges.push({
					field: "Photos",
					oldValue: "Original photos",
					newValue: "Updated photos",
				});
			}
		}

		setChanges(newChanges);
		onOpenUpdateConfirm();
	};

	const isItemChanged = (): boolean => {
		if (!localBaseline) return false;

		// Basic fields
		if (item.item_title !== localBaseline.item_title) return true;
		if (item.item_category_id !== localBaseline.item_category_id)
			return true;
		if (item.item_description !== localBaseline.item_description)
			return true;
		if (item.item_sold_by !== localBaseline.item_sold_by) return true;
		if (item.item_tag_id !== localBaseline.item_tag_id) return true;

		// Images
		if (
			JSON.stringify(item.item_img) !==
			JSON.stringify(localBaseline.item_img)
		)
			return true;

		return false;
	};

	const onConfirmUpdate = async () => {
		if (!item.item_id) return;

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
			setLocalBaseline(item);
			onOpenChangeUpdateConfirm();
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
								<AddEditItemModalSkeleton
									itemHasVariant={itemHasVariant}
								/>
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
												isDisabled={
													!validate() ||
													!isItemChanged()
												}
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
				itemId={item.item_id}
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
			<UpdateConfirmationModal
				changes={changes}
				isLoading={isUpdateLoading}
				isOpen={isOpenUpdateConfirm}
				onConfirm={onConfirmUpdate}
				onOpenChange={onOpenChangeUpdateConfirm}
			/>
		</>
	);
}
