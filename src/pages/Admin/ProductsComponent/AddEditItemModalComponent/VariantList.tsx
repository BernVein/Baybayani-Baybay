import {
	Card,
	CardHeader,
	CardBody,
	Divider,
	Button,
	useDisclosure,
} from "@heroui/react";
import { useState } from "react";

import { TrashIcon, PlusIcon, MinusIcon, PencilIcon } from "@/components/icons";
import { Item } from "@/model/Item";
import { DeleteVariantModal } from "@/pages/Admin/ProductsComponent/AddEditItemModalComponent/VariantListComponent/DeleteVariantModal";
import { AddEditVariantModal } from "@/pages/Admin/ProductsComponent/AddEditItemModalComponent/AddEditVariantModal";
import { EditStockDetailModal } from "@/pages/Admin/ProductsComponent/AddEditItemModalComponent/EditStockDetailModal";
import { SoftDeleteConfirmationModal } from "@/pages/Admin/ProductsComponent/AddEditItemModalComponent/SoftDeleteConfirmationModal";
import { softDeleteVariant } from "@/data/supabase/Admin/Products/softDeleteVariant";
import { addToast } from "@heroui/react";

export function VariantList({
	isEditDB,
	isFetchingItem,
	itemHasVariant,
	item,
	setItem,
	onRefetchVariants,
}: {
	isEditDB?: boolean;
	isFetchingItem: boolean;
	itemHasVariant: boolean;
	item: Item;
	setItem: React.Dispatch<React.SetStateAction<Item>>;
	onRefetchVariants?: () => void;
}) {
	const {
		isOpen: isOpenDeleteVar,
		onOpen: onOpenDeleteVar,
		onOpenChange: onOpenChangeDeleteVar,
	} = useDisclosure();
	const {
		isOpen: isOpenAddVar,
		onOpen: onOpenAddVar,
		onOpenChange: onOpenChangeAddVar,
	} = useDisclosure();
	const {
		isOpen: isOpenEditStock,
		onOpen: onOpenEditStock,
		onOpenChange: onOpenChangeEditStock,
	} = useDisclosure();

	const [selectedVarIndex, setSelectedVarIndex] = useState<number | null>(
		null,
	);
	const [editStockKey, setEditStockKey] = useState<
		"edit-stock-gain" | "edit-stock-loss" | null
	>(null);
	const [selectedVarName, setSelectedVarName] = useState<string | null>(null);

	const {
		isOpen: isOpenSoftDeleteConfirm,
		onOpen: onOpenSoftDeleteConfirm,
		onOpenChange: onOpenChangeSoftDeleteConfirm,
	} = useDisclosure();
	const [isDeleteLoading, setIsDeleteLoading] = useState(false);

	const onConfirmDeleteVariant = async () => {
		if (selectedVarIndex === null) return;
		const variant = item.item_variants[selectedVarIndex];
		if (!variant.variant_id) return;

		setIsDeleteLoading(true);
		const result = await softDeleteVariant(variant.variant_id);
		if (result.success) {
			addToast({
				title: "Success",
				description: "Variant deleted successfully.",
				timeout: 3000,
				color: "success",
				shouldShowTimeoutProgress: true,
			});
			setItem((prev) => {
				const variants = [...prev.item_variants];
				variants.splice(selectedVarIndex, 1);
				return { ...prev, item_variants: variants };
			});
		} else {
			addToast({
				title: "Error",
				description: result.error || "Failed to delete variant.",
				timeout: 3000,
				color: "danger",
				shouldShowTimeoutProgress: true,
			});
		}
		setIsDeleteLoading(false);
		onOpenChangeSoftDeleteConfirm();
	};

	return (
		<>
			{item.item_variants.length === 0 && itemHasVariant ? (
				<p className="text-sm text-default-400 italic text-center py-4">
					No variants added yet.
				</p>
			) : (
				item.item_variants.map((v, index) => (
					<Card key={index} className="shadow-sm">
						<CardHeader className="flex flex-row justify-between items-start">
							<div className="flex flex-col">
								<h4 className="text-large font-bold flex flex-col min-w-0">
									{itemHasVariant ? (
										<div className="flex flex-col min-w-0">
											<span className="truncate block">
												{v.variant_name ||
													"Default Variant"}
											</span>
											<p className="text-tiny text-default-400 truncate">
												Variant {index + 1}
											</p>
											<div className="flex gap-1"></div>
										</div>
									) : (
										<>
											{isEditDB
												? "Latest Item Info"
												: "Item Additional Info"}
										</>
									)}
									<span className="text-default-500 text-sm truncate">
										{isEditDB ? "Current Stocks" : "Stocks"}
										:{" "}
										{v.variant_stock_latest_movement
											.effective_stocks != null
											? v.variant_stock_latest_movement.effective_stocks.toLocaleString()
											: "0"}{" "}
										{item.item_sold_by}s{" "}
									</span>
								</h4>
							</div>
							<div className="ml-auto flex flex-row gap-2">
								{!isEditDB && (
									<Button
										isIconOnly
										className="ml-auto"
										size="sm"
										isLoading={isFetchingItem}
										startContent={
											<PencilIcon className="w-5" />
										}
										onPress={() => {
											setSelectedVarIndex(index);
											setSelectedVarName(
												v.variant_name ?? null,
											);
											onOpenAddVar();
										}}
									/>
								)}

								{isEditDB && (
									<>
										<Button
											isIconOnly
											className="ml-auto"
											size="sm"
											startContent={
												<PlusIcon className="w-5" />
											}
											onPress={() => {
												setSelectedVarIndex(index);
												setEditStockKey(
													"edit-stock-gain",
												);
												onOpenEditStock();
											}}
										/>
										<Button
											isIconOnly
											className="ml-auto"
											size="sm"
											startContent={
												<MinusIcon className="w-5" />
											}
											onPress={() => {
												setSelectedVarIndex(index);
												setEditStockKey(
													"edit-stock-loss",
												);
												onOpenEditStock();
											}}
										/>
										<Button
											isIconOnly
											className="ml-auto"
											size="sm"
											startContent={
												<PencilIcon className="w-5" />
											}
											onPress={() => {
												setSelectedVarIndex(index);
												setSelectedVarName(
													v.variant_name ?? null,
												);
												onOpenAddVar();
											}}
										/>
									</>
								)}
								{item.item_variants.length > 2 && (
									<Button
										isIconOnly
										className="ml-auto"
										color="danger"
										size="sm"
										startContent={
											<TrashIcon className="w-5" />
										}
										onPress={() => {
											setSelectedVarIndex(index);
											setSelectedVarName(
												v.variant_name ?? null,
											);
											if (isEditDB) {
												onOpenSoftDeleteConfirm();
											} else {
												onOpenDeleteVar();
											}
										}}
									/>
								)}
							</div>
						</CardHeader>
						<Divider />
						<CardBody>
							<div
								className={`text-sm grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 ${
									isEditDB ? "mb-3" : ""
								}`}
							>
								<div className="flex justify-between items-center gap-2 min-w-0">
									<span className="text-default-500 whitespace-nowrap">
										Low Stock Alert:
									</span>
									<span className="font-medium truncate">
										{v.variant_low_stock_threshold?.toLocaleString()}{" "}
										{item.item_sold_by}s
									</span>
								</div>
								<div className="flex justify-between items-center gap-2 min-w-0">
									<span className="text-default-500 whitespace-nowrap">
										Retail Price:
									</span>
									<span className="font-medium truncate">
										{v.variant_price_retail != null
											? `₱${v.variant_price_retail.toLocaleString(
													"en-PH",
													{
														minimumFractionDigits: 2,
														maximumFractionDigits: 2,
													},
												)}`
											: "N/A"}
									</span>
								</div>
								<div className="flex justify-between items-center gap-2 min-w-0">
									<span className="text-default-500 whitespace-nowrap">
										Wholesale Price:
									</span>
									{v.variant_price_wholesale != null &&
									v.variant_price_wholesale > 0 ? (
										<span className="font-medium truncate">
											₱
											{v.variant_price_wholesale.toLocaleString(
												"en-PH",
												{
													minimumFractionDigits: 2,
													maximumFractionDigits: 2,
												},
											)}
										</span>
									) : (
										<span className="text-xs italic text-default-400 whitespace-nowrap">
											N/A
										</span>
									)}
								</div>
								<div className="flex justify-between items-center gap-2 min-w-0">
									<span className="text-default-500 whitespace-nowrap">
										Wholesale Min Qty:
									</span>
									{v.variant_wholesale_item != null &&
									v.variant_wholesale_item > 0 ? (
										<span className="font-medium truncate">
											{v.variant_wholesale_item.toLocaleString()}{" "}
											{item.item_sold_by}s
										</span>
									) : (
										<span className="text-xs italic text-default-400 whitespace-nowrap">
											N/A
										</span>
									)}
								</div>
							</div>
							{isEditDB && (
								<div>
									<p className="text-base text-default-600 italic">
										Latest Stock Modification Details:
									</p>
								</div>
							)}
							<div className="py-1 text-sm grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
								<div className="flex justify-between items-center gap-2 min-w-0">
									<span className="text-default-500 whitespace-nowrap">
										{v.variant_stock_latest_movement
											.stock_adjustment_type === "Loss"
											? "Stock Loss Date"
											: "Date Delivered"}
									</span>
									<span className="font-medium truncate">
										{v.variant_stock_latest_movement
											.stock_adjustment_type === "Loss"
											? v.variant_stock_latest_movement
													.stock_change_date
												? new Date(
														v.variant_stock_latest_movement.stock_change_date,
													).toLocaleDateString(
														"en-US",
														{
															month: "short",
															day: "2-digit",
															year: "numeric",
														},
													)
												: "N/A"
											: v.variant_stock_latest_movement
														.stock_delivery_date
												? new Date(
														v.variant_stock_latest_movement.stock_delivery_date,
													).toLocaleDateString(
														"en-US",
														{
															month: "short",
															day: "2-digit",
															year: "numeric",
														},
													)
												: "N/A"}
									</span>
								</div>
								<div className="flex justify-between items-center gap-2 min-w-0">
									<span className="text-default-500 whitespace-nowrap">
										{v.variant_stock_latest_movement
											.stock_adjustment_type === "Loss"
											? "Total Amount Loss"
											: "Total Buying Price"}
									</span>
									<span className="font-medium truncate">
										{v.variant_stock_latest_movement
											.stock_adjustment_amount != null
											? `₱${v.variant_stock_latest_movement.stock_adjustment_amount.toLocaleString(
													"en-PH",
													{
														minimumFractionDigits: 2,
														maximumFractionDigits: 2,
													},
												)}`
											: "N/A"}
									</span>
								</div>
								<div className="flex justify-between items-center gap-2 min-w-0">
									<span className="text-default-500 whitespace-nowrap">
										{v.variant_stock_latest_movement
											?.stock_adjustment_type === "Loss"
											? "Deducted Stocks:"
											: "Added Stocks:"}
									</span>
									<span className="font-medium truncate">
										{v.variant_stock_movements?.length ===
										1 ? (
											<span className="italic text-default-500">
												Recently Added
											</span>
										) : v.variant_stock_latest_movement
												?.stock_change_count != null ? (
											`${v.variant_stock_latest_movement.stock_change_count} ${item.item_sold_by}${v.variant_stock_latest_movement.stock_change_count > 1 ? "s" : ""}`
										) : (
											"N/A"
										)}
									</span>
								</div>

								<div className="flex justify-between items-center gap-2 min-w-0">
									<span className="text-default-500 whitespace-nowrap">
										{v.variant_stock_latest_movement
											.stock_adjustment_type === "Loss"
											? "Reason for Loss"
											: "Supplier"}
									</span>
									<span className="font-medium truncate text-right">
										{v.variant_stock_latest_movement
											.stock_adjustment_type === "Loss"
											? v.variant_stock_latest_movement
													.stock_loss_reason
											: v.variant_stock_latest_movement
													.stock_supplier}
									</span>
								</div>
							</div>
						</CardBody>
					</Card>
				))
			)}
			<DeleteVariantModal
				isOpenDeleteVar={isOpenDeleteVar}
				itemHasVariant={itemHasVariant}
				selectedVarIndex={selectedVarIndex}
				selectedVarName={selectedVarName}
				setItem={setItem}
				setSelectedVarIndex={setSelectedVarIndex}
				onOpenChangeDeleteVar={onOpenChangeDeleteVar}
			/>
			<SoftDeleteConfirmationModal
				isLoading={isDeleteLoading}
				isOpen={isOpenSoftDeleteConfirm}
				name={selectedVarName || "Variant"}
				title="Delete Variant"
				type="Variant"
				onConfirm={onConfirmDeleteVariant}
				onOpenChange={onOpenChangeSoftDeleteConfirm}
			/>

			{isOpenEditStock &&
				selectedVarIndex !== null &&
				editStockKey !== null && (
					<EditStockDetailModal
						editKey={editStockKey}
						itemUnitOfMeasure={item.item_sold_by}
						variant={item.item_variants[selectedVarIndex]}
						isOpenEditStock={isOpenEditStock}
						onOpenChangeEditStock={onOpenChangeEditStock}
						onUpdateLastestStockMovement={(updatedMovement) => {
							if (selectedVarIndex === null) return;

							setItem((prev) => {
								const updatedVariants = [...prev.item_variants];

								updatedVariants[selectedVarIndex] = {
									...updatedVariants[selectedVarIndex],
									variant_stock_latest_movement:
										updatedMovement,
								};

								return {
									...prev,
									item_variants: updatedVariants,
								};
							});

							if (onRefetchVariants) onRefetchVariants();
						}}
					/>
				)}
			<AddEditVariantModal
				isEditDB={isEditDB}
				defaultVariant={
					selectedVarIndex !== null
						? item.item_variants[selectedVarIndex]
						: null
				}
				isOpenAddVar={isOpenAddVar}
				itemHasVariant={itemHasVariant}
				itemUnitOfMeasure={item.item_sold_by}
				onAddEditVariant={(newVariant) => {
					if (selectedVarIndex !== null) {
						// edit existing variant
						setItem((prev) => {
							const variants = [...prev.item_variants];

							variants[selectedVarIndex] = newVariant;

							return { ...prev, item_variants: variants };
						});
					} else {
						// add new variant
						setItem((prev) => ({
							...prev,
							item_variants: [
								...prev.item_variants,
								{
									...newVariant,
									name: itemHasVariant
										? newVariant.variant_name
										: prev.item_title,
								},
							],
						}));
					}
				}}
				onOpenChangeAddVar={onOpenChangeAddVar}
			/>
		</>
	);
}
