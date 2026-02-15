import {
	Button,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Divider,
	Input,
	addToast,
	useDisclosure,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { today } from "@internationalized/date";

import { ItemStockDetail } from "@/pages/Admin/ProductsComponent/AddEditItemModalComponent/AddEditVariantModalComponent/ItemStockDetail";
import { ItemPricingDetail } from "@/pages/Admin/ProductsComponent/AddEditItemModalComponent/AddEditVariantModalComponent/ItemPricingDetail";
import { Variant } from "@/model/variant";
import { StockMovement } from "@/model/stockMovement";
import { editVariantInfo } from "@/data/supabase/Admin/Products/editVariantInfo";
import { addVariant } from "@/data/supabase/Admin/Products/addVariant";
import { UpdateVariantConfirmationModal } from "@/pages/Admin/ProductsComponent/AddEditItemModalComponent/UpdateVariantConfirmationModal";
import { AddVariantConfirmationModal } from "@/pages/Admin/ProductsComponent/AddEditItemModalComponent/AddVariantConfirmationModal";
import { ChangeDetail } from "@/pages/Admin/ProductsComponent/AddEditItemModalComponent/UpdateConfirmationModal";

export function AddEditVariantModal({
	isEditDB,
	itemUnitOfMeasure,
	itemHasVariant,
	isOpenAddVar,
	onOpenChangeAddVar,
	onAddEditVariant,
	defaultVariant,
	itemId,
}: {
	isEditDB?: boolean | null;
	itemUnitOfMeasure: string;
	itemHasVariant: boolean;
	isOpenAddVar: boolean;
	onOpenChangeAddVar: (open: boolean) => void;
	onAddEditVariant: (variant: Variant) => void;
	defaultVariant?: Variant | null;
	itemId?: string;
}) {
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [changes, setChanges] = useState<ChangeDetail[]>([]);

	const {
		isOpen: isOpenUpdateConfirm,
		onOpen: onOpenUpdateConfirm,
		onOpenChange: onOpenChangeUpdateConfirm,
	} = useDisclosure();

	const {
		isOpen: isOpenAddConfirm,
		onOpen: onOpenAddConfirm,
		onOpenChange: onOpenChangeAddConfirm,
	} = useDisclosure();

	const defaultStockMovement: StockMovement = {
		stock_adjustment_amount: undefined,
		stock_adjustment_type: "Acquisition",
		stock_supplier: "",
		stock_delivery_date: today("UTC").toString(),
		effective_stocks: undefined,
		last_updated: today("UTC").toString(),
		is_soft_deleted: false,
		created_at: today("UTC").toString(),
	};

	const [variant, setVariant] = useState<Variant>({
		variant_name: "",
		variant_stock_latest_movement: defaultStockMovement,
		variant_low_stock_threshold: undefined,
		variant_price_retail: undefined,
		variant_price_wholesale: undefined,
		variant_wholesale_item: undefined,
	});

	useEffect(() => {
		setIsSubmitted(false);
		if (defaultVariant) {
			setVariant(defaultVariant);
		} else {
			setVariant({
				variant_name: "",
				variant_stock_latest_movement: defaultStockMovement,
				variant_low_stock_threshold: undefined,
				variant_price_retail: undefined,
				variant_price_wholesale: undefined,
				variant_wholesale_item: undefined,
			});
		}
	}, [isOpenAddVar, defaultVariant]);

	useEffect(() => {
		if (
			variant.variant_price_wholesale == null &&
			variant.variant_wholesale_item != null
		) {
			setVariant((prev) => ({
				...prev,
				variant_wholesale_item: undefined,
			}));
		}
	}, [
		variant.variant_price_wholesale,
		variant.variant_wholesale_item,
		setVariant,
	]);

	function validateVariant(): boolean {
		if (itemHasVariant && !variant.variant_name?.trim()) return false;

		// Stock validation only for non-edit mode or when adding a new variant
		if (!defaultVariant) {
			if (
				variant.variant_stock_latest_movement?.effective_stocks ==
					null ||
				variant.variant_stock_latest_movement?.effective_stocks == 0
			)
				return false;
			if (!variant.variant_stock_latest_movement?.stock_supplier?.trim())
				return false;
			if (
				variant.variant_stock_latest_movement
					?.stock_adjustment_amount == null ||
				variant.variant_stock_latest_movement
					?.stock_adjustment_amount == 0
			)
				return false;
		}

		if (
			variant.variant_low_stock_threshold == null ||
			variant.variant_low_stock_threshold == 0
		)
			return false;
		if (
			variant.variant_price_retail == null ||
			variant.variant_price_retail == 0
		)
			return false;

		// wholesaleMinQty is only required if wholesalePrice is set
		if (
			variant.variant_price_wholesale &&
			(variant.variant_wholesale_item == null ||
				variant.variant_wholesale_item == 0)
		)
			return false;

		return true;
	}

	const isVariantChanged = () => {
		if (!defaultVariant) return true;

		if (variant.variant_name !== defaultVariant.variant_name) return true;
		if (
			variant.variant_low_stock_threshold !==
			defaultVariant.variant_low_stock_threshold
		)
			return true;
		if (
			variant.variant_price_retail !== defaultVariant.variant_price_retail
		)
			return true;
		if (
			variant.variant_price_wholesale !==
			defaultVariant.variant_price_wholesale
		)
			return true;
		if (
			variant.variant_wholesale_item !==
			defaultVariant.variant_wholesale_item
		)
			return true;

		return false;
	};

	const handleAction = async () => {
		setIsSubmitted(true);
		if (!validateVariant()) {
			addToast({
				title: "Empty Required Fields.",
				description: "Please fill in all required fields.",
				timeout: 3000,
				color: "danger",
				shouldShowTimeoutProgress: true,
			});
			return;
		}

		if (isEditDB) {
			if (defaultVariant) {
				// EDIT existing variant in DB mode
				if (!isVariantChanged()) {
					onOpenChangeAddVar(false);
					return;
				}

				const newChanges: ChangeDetail[] = [];
				if (variant.variant_name !== defaultVariant.variant_name) {
					newChanges.push({
						field: "Variant Name",
						oldValue: defaultVariant.variant_name || "",
						newValue: variant.variant_name || "",
					});
				}
				if (
					variant.variant_low_stock_threshold !==
					defaultVariant.variant_low_stock_threshold
				) {
					newChanges.push({
						field: "Low Stock Threshold",
						oldValue: String(
							defaultVariant.variant_low_stock_threshold || "",
						),
						newValue: String(
							variant.variant_low_stock_threshold || "",
						),
					});
				}
				if (
					variant.variant_price_retail !==
					defaultVariant.variant_price_retail
				) {
					newChanges.push({
						field: "Retail Price",
						oldValue: String(
							defaultVariant.variant_price_retail || "",
						),
						newValue: String(variant.variant_price_retail || ""),
					});
				}
				if (
					variant.variant_price_wholesale !==
					defaultVariant.variant_price_wholesale
				) {
					newChanges.push({
						field: "Wholesale Price",
						oldValue: String(
							defaultVariant.variant_price_wholesale || "N/A",
						),
						newValue: String(
							variant.variant_price_wholesale || "N/A",
						),
					});
				}
				if (
					variant.variant_wholesale_item !==
					defaultVariant.variant_wholesale_item
				) {
					newChanges.push({
						field: "Wholesale Min Qty",
						oldValue: String(
							defaultVariant.variant_wholesale_item || "N/A",
						),
						newValue: String(
							variant.variant_wholesale_item || "N/A",
						),
					});
				}

				setChanges(newChanges);
				onOpenUpdateConfirm();
			} else {
				// ADD new variant in DB mode
				if (!itemId) {
					console.error("Item ID is required for addVariant");
					return;
				}
				onOpenAddConfirm();
			}
		} else {
			// Local development mode
			onAddEditVariant(variant);
			onOpenChangeAddVar(false);
			setIsSubmitted(false);
		}
	};

	const onConfirmUpdate = async () => {
		if (!variant.variant_id) return;
		setIsLoading(true);
		const result = await editVariantInfo(variant.variant_id, variant);
		if (result.success) {
			addToast({
				title: "Success",
				description: "Variant updated successfully.",
				timeout: 3000,
				color: "success",
				shouldShowTimeoutProgress: true,
			});
			onAddEditVariant(variant);
			onOpenChangeAddVar(false);
		} else {
			addToast({
				title: "Error",
				description: result.error || "Failed to update variant.",
				timeout: 3000,
				color: "danger",
				shouldShowTimeoutProgress: true,
			});
		}
		setIsLoading(true);
		onOpenChangeUpdateConfirm();
	};

	const onConfirmAdd = async () => {
		if (!itemId) return;
		setIsLoading(true);
		const result = await addVariant(itemId, variant);
		if (result.success) {
			addToast({
				title: "Success",
				description: "Variant added successfully.",
				timeout: 3000,
				color: "success",
				shouldShowTimeoutProgress: true,
			});
			onAddEditVariant({ ...variant, variant_id: result.variantId });
			onOpenChangeAddVar(false);
		} else {
			addToast({
				title: "Error",
				description: result.error || "Failed to add variant.",
				timeout: 3000,
				color: "danger",
				shouldShowTimeoutProgress: true,
			});
		}
		setIsLoading(false);
		onOpenChangeAddConfirm();
	};

	return (
		<>
			<Modal
				disableAnimation
				isDismissable={false}
				isOpen={isOpenAddVar}
				scrollBehavior="inside"
				size="xl"
				onOpenChange={onOpenChangeAddVar}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								<span className="font-semibold">
									{itemHasVariant
										? defaultVariant
											? "Edit Variant"
											: "Add Variant"
										: "Set Additional Details"}
								</span>
							</ModalHeader>
							<ModalBody>
								<>
									{itemHasVariant && (
										<div className="flex flex-row gap-2 items-center">
											<Input
												isClearable
												isRequired
												description="For variant name display"
												errorMessage="Variant name is required."
												isInvalid={
													isSubmitted &&
													!variant.variant_name?.trim()
												}
												label="Variant Name"
												value={variant.variant_name}
												onValueChange={(v) =>
													setVariant({
														...variant,
														variant_name: v,
													})
												}
											/>
										</div>
									)}
									{(!isEditDB || !defaultVariant) && (
										<>
											<Divider />
											<span className="text-lg font-semibold">
												Set Item Stock Details
											</span>
											<ItemStockDetail
												isSubmitted={isSubmitted}
												itemUnitOfMeasure={
													itemUnitOfMeasure
												}
												setVariant={setVariant}
												variant={variant}
											/>
											<Divider />
										</>
									)}

									<span className="text-lg font-semibold">
										For low stock notification
									</span>
									<div className="flex flex-col gap-2 items-center">
										<Input
											isRequired
											description="Notification will trigger when the stock level reaches this threshold"
											endContent={
												<div className="pointer-events-none flex items-center">
													<span className="text-default-400 text-small">
														{itemUnitOfMeasure}
													</span>
												</div>
											}
											errorMessage="Low stock threshold is required"
											inputMode="decimal"
											isInvalid={
												isSubmitted &&
												(variant.variant_low_stock_threshold ==
													null ||
													variant.variant_low_stock_threshold <=
														0)
											}
											label="Low Stock Alert Threshold"
											type="text"
											value={
												variant.variant_low_stock_threshold !==
												undefined
													? String(
															variant.variant_low_stock_threshold,
														)
													: ""
											}
											onValueChange={(v) => {
												if (v === "") {
													setVariant({
														...variant,
														variant_low_stock_threshold:
															undefined,
													});

													return;
												}

												const num = Number(v);

												if (Number.isNaN(num)) return;

												setVariant({
													...variant,
													variant_low_stock_threshold:
														num,
												});
											}}
										/>
									</div>
									<Divider />
									<span className="text-lg font-semibold">
										Set Item Pricing
									</span>
									<ItemPricingDetail
										isSubmitted={isSubmitted}
										setVariant={setVariant}
										variant={variant}
									/>
									<Divider />
									<span className="text-lg font-semibold">
										Set Wholesale Minimum Quantity
										<p className="text-sm text-default-500 italic">
											Applicable only if wholesale price
											is set
										</p>
									</span>
									<div className="flex flex-col gap-2 items-center">
										<Input
											description="Enter the minimum quantity required for wholesale purchase"
											errorMessage="Wholesale minimum quantity is required."
											inputMode="decimal"
											isDisabled={
												!variant.variant_price_wholesale
											}
											isInvalid={
												isSubmitted &&
												variant.variant_price_wholesale !=
													null &&
												(variant.variant_wholesale_item ==
													null ||
													variant.variant_wholesale_item <=
														0)
											}
											isRequired={
												!!variant.variant_price_wholesale
											}
											label="Wholesale Minimum Quantity"
											type="text"
											value={
												variant.variant_price_wholesale ==
												null
													? ""
													: (variant.variant_wholesale_item?.toString() ??
														"")
											}
											onValueChange={(v) => {
												if (v === "") {
													setVariant((prev) => ({
														...prev,
														variant_wholesale_item:
															undefined,
													}));

													return;
												}

												const num = Number(v);

												if (Number.isNaN(num)) return;

												setVariant((prev) => ({
													...prev,
													variant_wholesale_item: num,
												}));
											}}
										/>
									</div>
								</>
							</ModalBody>
							<ModalFooter className="justify-between items-center">
								<span className="text-sm text-default-500 italic">
									<span className="text-red-500">*</span>{" "}
									Required field
								</span>
								<div className="flex gap-2">
									<Button
										color="danger"
										variant="light"
										onPress={onClose}
									>
										Close
									</Button>
									<Button
										color="success"
										isLoading={isLoading}
										onPress={handleAction}
									>
										{itemHasVariant && !defaultVariant
											? "Add Variant"
											: defaultVariant
												? "Update Details"
												: "Save Details"}
									</Button>
								</div>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
			<UpdateVariantConfirmationModal
				changes={changes}
				isLoading={isLoading}
				isOpen={isOpenUpdateConfirm}
				onConfirm={onConfirmUpdate}
				onOpenChange={onOpenChangeUpdateConfirm}
				variantName={variant.variant_name || "Default"}
			/>
			<AddVariantConfirmationModal
				isLoading={isLoading}
				isOpen={isOpenAddConfirm}
				itemUnitOfMeasure={itemUnitOfMeasure}
				onConfirm={onConfirmAdd}
				onOpenChange={onOpenChangeAddConfirm}
				variant={variant}
			/>
		</>
	);
}
