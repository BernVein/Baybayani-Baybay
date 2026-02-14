import {
	Card,
	CardHeader,
	CardBody,
	Divider,
	Button,
	useDisclosure,
	Dropdown,
	DropdownTrigger,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
} from "@heroui/react";
import { useState } from "react";

import { PencilIcon, TrashIcon } from "@/components/icons";
import { Item } from "@/model/Item";
import { DeleteVariantModal } from "@/pages/Admin/ProductsComponent/AddEditItemModalComponent/VariantListComponent/DeleteVariantModal";
import { AddEditVariantModal } from "@/pages/Admin/ProductsComponent/AddEditItemModalComponent/AddEditVariantModal";
import { EditStockDetailModal } from "@/pages/Admin/ProductsComponent/AddEditItemModalComponent/EditStockDetailModal";

export function VariantList({
	isEditDB,
	isFetchingItem,
	itemHasVariant,
	item,
	setItem,
}: {
	isEditDB?: boolean;
	isFetchingItem: boolean;
	itemHasVariant: boolean;
	item: Item;
	setItem: React.Dispatch<React.SetStateAction<Item>>;
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
								<h4 className="text-large font-bold">
									{itemHasVariant ? (
										<>
											{v.variant_name ||
												"Default Variant"}
											<p className="text-tiny text-default-400">
												Variant {index + 1}
											</p>
										</>
									) : (
										<>
											{isEditDB
												? "Latest Item Info"
												: "Item Additional Info"}

											{isEditDB && (
												<p className="text-tiny text-default-400 italic">
													Stocks details is edited in
													separate fields
												</p>
											)}
										</>
									)}
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
									<Dropdown>
										<DropdownTrigger>
											<Button
												isIconOnly
												className="ml-auto"
												size="sm"
												isLoading={isFetchingItem}
												startContent={
													<PencilIcon className="w-5" />
												}
											/>
										</DropdownTrigger>
										<DropdownMenu aria-label="Static Actions">
											<DropdownSection
												showDivider
												title="Stock Details"
											>
												<DropdownItem
													key="edit-stock-gain"
													onClick={() => {
														setSelectedVarIndex(
															index,
														);
														setEditStockKey(
															"edit-stock-gain",
														);
														onOpenEditStock();
													}}
												>
													Stock Gain
												</DropdownItem>
												<DropdownItem
													key="edit-stock-loss"
													onClick={() => {
														setSelectedVarIndex(
															index,
														);
														setEditStockKey(
															"edit-stock-loss",
														);
														onOpenEditStock();
													}}
												>
													Stock Loss
												</DropdownItem>
											</DropdownSection>
											<DropdownSection title="Variant Details">
												<DropdownItem
													key="edit-variant"
													onPress={() => {
														setSelectedVarIndex(
															index,
														);
														setSelectedVarName(
															v.variant_name ??
																null,
														);
														onOpenAddVar();
													}}
												>
													Edit Variant
												</DropdownItem>
											</DropdownSection>
										</DropdownMenu>
									</Dropdown>
								)}

								<Button
									isIconOnly
									className="ml-auto"
									color="danger"
									size="sm"
									startContent={<TrashIcon className="w-5" />}
									onPress={() => {
										setSelectedVarIndex(index);
										setSelectedVarName(
											v.variant_name ?? null,
										);
										onOpenDeleteVar();
									}}
								/>
							</div>
						</CardHeader>
						<Divider />
						<CardBody>
							<span className="text-default-500 text-sm italic">
								Latest Stock Modification:{" "}
								<span className="font-bold">
									{v.variant_stock_latest_movement
										.stock_adjustment_type === "Loss" ? (
										<span className="text-danger">
											Deducted{" "}
											{
												v.variant_stock_latest_movement
													.stock_change_count
											}{" "}
											{item.item_sold_by}s
										</span>
									) : (
										<span className="text-success">
											Added{" "}
											{
												v.variant_stock_latest_movement
													.stock_change_count
											}{" "}
											{item.item_sold_by}s
										</span>
									)}
								</span>
							</span>
							<div className="py-2 text-sm grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
								<div className="flex justify-between">
									<span className="text-default-500">
										{isEditDB ? "Current Stocks" : "Stocks"}
										:
									</span>
									<span className="font-medium">
										{v.variant_stock_latest_movement
											.effective_stocks != null
											? v.variant_stock_latest_movement.effective_stocks.toLocaleString()
											: "0"}{" "}
										{item.item_sold_by}s
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-default-500">
										{v.variant_stock_latest_movement
											.stock_adjustment_type === "Loss"
											? "Stock Loss Date"
											: "Date Delivered"}
									</span>
									<span className="font-medium">
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
								<div className="flex justify-between">
									<span className="text-default-500">
										{v.variant_stock_latest_movement
											.stock_adjustment_type === "Loss"
											? "Total Amount Loss"
											: "Total Buying Price"}
									</span>
									<span className="font-medium">
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
								<div className="flex justify-between">
									<span className="text-default-500">
										Retail Price:
									</span>
									<span className="font-medium">
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
								<div className="flex justify-between">
									<span className="text-default-500">
										Low Stock Alert:
									</span>
									<span className="font-medium">
										{v.variant_low_stock_threshold?.toLocaleString()}{" "}
										{item.item_sold_by}s
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-default-500">
										Wholesale Price:
									</span>

									{v.variant_price_wholesale != null &&
									v.variant_price_wholesale > 0 ? (
										<span className="font-medium">
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
										<span className="text-xs italic text-default-400">
											N/A
										</span>
									)}
								</div>

								<div className="flex justify-between">
									<span className="text-default-500">
										{v.variant_stock_latest_movement
											.stock_adjustment_type === "Loss"
											? "Reason for Loss"
											: "Supplier"}
									</span>
									<span className="font-medium text-right">
										{v.variant_stock_latest_movement
											.stock_adjustment_type === "Loss"
											? v.variant_stock_latest_movement
													.stock_loss_reason
											: v.variant_stock_latest_movement
													.stock_supplier}
									</span>
								</div>

								<div className="flex justify-between">
									<span className="text-default-500">
										Wholesale Min Qty:
									</span>

									{v.variant_wholesale_item != null &&
									v.variant_wholesale_item > 0 ? (
										<span className="font-medium truncate ml-2">
											{v.variant_wholesale_item.toLocaleString()}{" "}
											{item.item_sold_by}s
										</span>
									) : (
										<span className="text-xs italic text-default-400 ml-2">
											N/A
										</span>
									)}
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
