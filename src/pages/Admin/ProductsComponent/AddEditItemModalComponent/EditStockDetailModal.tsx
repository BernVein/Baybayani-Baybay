import React, { useState } from "react";
import {
	Input,
	DatePicker,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	ModalFooter,
	Button,
	addToast,
	useDisclosure,
} from "@heroui/react";
import {
	getLocalTimeZone,
	today,
	parseDate,
	type DateValue,
} from "@internationalized/date";
import { Variant } from "@/model/variant";
import { StockMovement } from "@/model/stockMovement";
import { StockAdjustmentConfirmationModal } from "@/pages/Admin/ProductsComponent/AddEditItemModalComponent/StockAdjustmentConfirmationModal";
import { recordStockAdjustment } from "@/data/supabase/Admin/Products/recordStockAdjustment";

export function EditStockDetailModal({
	editKey,
	itemUnitOfMeasure,
	variant,
	onUpdateLastestStockMovement,
	onOpenChangeEditStock,
	isOpenEditStock,
}: {
	editKey: "edit-stock-gain" | "edit-stock-loss";
	itemUnitOfMeasure: string;
	variant: Variant;
	onUpdateLastestStockMovement: (updatedMovement: StockMovement) => void;
	onOpenChangeEditStock: () => void;
	isOpenEditStock: boolean;
}) {
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [stockMovement, setStockMovement] = useState<StockMovement>({
		stock_change_count: undefined,
		stock_adjustment_amount: undefined,
		stock_adjustment_type:
			editKey === "edit-stock-loss" ? "Loss" : "Acquisition",
		stock_supplier: undefined,
		effective_stocks:
			variant?.variant_stock_latest_movement?.effective_stocks ?? 0,
		stock_change_date: today(getLocalTimeZone()).toString(),
		stock_delivery_date: today(getLocalTimeZone()).toString(),
		stock_loss_reason: undefined,
	});

	const {
		isOpen: isOpenConfirm,
		onOpen: onOpenConfirm,
		onOpenChange: onOpenChangeConfirm,
	} = useDisclosure();
	const [isLoading, setIsLoading] = useState(false);

	const currentStock =
		variant?.variant_stock_latest_movement?.effective_stocks ?? 0;
	const changeCount = stockMovement.stock_change_count ?? 0;
	const newEffectiveStock =
		editKey === "edit-stock-gain"
			? currentStock + changeCount
			: currentStock - changeCount;

	const handleAction = () => {
		setIsSubmitted(true);
		if (!validateMovement()) {
			addToast({
				title: "Empty Required Fields.",
				description:
					"Please fill in all required fields and ensure all inputs are valid.",
				timeout: 3000,
				color: "danger",
				shouldShowTimeoutProgress: true,
			});
			return;
		}
		onOpenConfirm();
	};

	const onConfirmStockChange = async () => {
		if (!variant.variant_id) return;
		setIsLoading(true);

		const finalStockMovement = {
			...stockMovement,
			effective_stocks: newEffectiveStock,
		};

		const result = await recordStockAdjustment(
			variant.variant_id,
			finalStockMovement,
		);

		if (result.success) {
			addToast({
				title: "Success",
				description: "Stock details updated successfully.",
				timeout: 3000,
				color: "success",
				shouldShowTimeoutProgress: true,
			});
			onUpdateLastestStockMovement(finalStockMovement);
			onOpenChangeEditStock();
		} else {
			addToast({
				title: "Error",
				description: result.error || "Failed to update stock details.",
				timeout: 3000,
				color: "danger",
				shouldShowTimeoutProgress: true,
			});
		}
		setIsLoading(false);
	};

	function validateMovement(): boolean {
		if (
			stockMovement.stock_change_count === undefined ||
			stockMovement.stock_change_count <= 0 ||
			(editKey === "edit-stock-loss" &&
				(stockMovement.stock_change_count ?? 0) > currentStock)
		)
			return false;

		if (stockMovement.stock_change_date?.trim() === "") return false;
		if (
			(editKey === "edit-stock-loss" &&
				stockMovement.stock_loss_reason?.trim() === "") ||
			(editKey === "edit-stock-gain" &&
				stockMovement.stock_supplier?.trim() === "")
		)
			return false;
		if (
			stockMovement.stock_adjustment_amount === undefined ||
			stockMovement.stock_adjustment_amount < 0
		)
			return false;

		return true;
	}

	// Compute the DatePicker value from local stockMovement state
	const datePickerValue: DateValue | null = React.useMemo(() => {
		const movementDate = stockMovement.stock_change_date;

		if (!movementDate) {
			return today(getLocalTimeZone()) as DateValue;
		}
		try {
			// Parse local date string (YYYY-MM-DD)
			return parseDate(movementDate) as DateValue;
		} catch {
			return today(getLocalTimeZone()) as DateValue;
		}
	}, [stockMovement.stock_change_date]);

	return (
		<>
			<Modal
				disableAnimation
				isDismissable={false}
				isOpen={isOpenEditStock}
				scrollBehavior="inside"
				size="xl"
				onOpenChange={onOpenChangeEditStock}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								<span className="font-semibold">
									{editKey == "edit-stock-gain"
										? "Add Stocks"
										: "Deduct Stocks"}
								</span>
								<span className="text-default-500 text-sm italic">
									Current Stock:{" "}
									{
										variant?.variant_stock_latest_movement
											?.effective_stocks
									}{" "}
									{itemUnitOfMeasure}s
								</span>
							</ModalHeader>
							<ModalBody>
								<div className="flex flex-row gap-2 items-center">
									{/* Stock Change Count*/}
									<Input
										isRequired
										className="w-1/2"
										description={
											editKey == "edit-stock-gain"
												? "Add to current stock"
												: "Deduct to current stocks"
										}
										endContent={
											<div className="pointer-events-none flex items-center">
												<span className="text-default-400 text-small">
													{itemUnitOfMeasure}
												</span>
											</div>
										}
										errorMessage={
											editKey === "edit-stock-loss" &&
											(stockMovement.stock_change_count ??
												0) >
												(variant
													?.variant_stock_latest_movement
													?.effective_stocks ?? 0)
												? "Exceeds current stock"
												: "Stock change is required"
										}
										inputMode="decimal"
										isInvalid={
											isSubmitted &&
											(stockMovement.stock_change_count ==
												null ||
												stockMovement.stock_change_count <=
													0 ||
												(editKey ===
													"edit-stock-loss" &&
													(stockMovement.stock_change_count ??
														0) >
														(variant
															?.variant_stock_latest_movement
															?.effective_stocks ??
															0)))
										}
										label={
											editKey == "edit-stock-gain"
												? "Stocks to Add"
												: "Stocks to Deduct"
										}
										type="text"
										value={
											stockMovement.stock_change_count !==
											undefined
												? String(
														stockMovement.stock_change_count,
													)
												: ""
										}
										onValueChange={(v) => {
											if (v === "") {
												setStockMovement({
													...stockMovement,
													stock_change_count:
														undefined,
												});

												return;
											}

											const num = Number(v);

											if (Number.isNaN(num)) return;

											setStockMovement({
												...stockMovement,
												stock_change_count: num,
											});
										}}
									/>

									{/* Stock Change Date */}
									<DatePicker
										isRequired
										className="w-1/2"
										description="Date the stock updated"
										errorMessage="Date update is required"
										isInvalid={
											isSubmitted &&
											!stockMovement.stock_change_date
										}
										label={
											editKey == "edit-stock-loss"
												? "Date of Loss"
												: "Delivery Date"
										}
										value={datePickerValue as any}
										onChange={(v: DateValue | null) => {
											if (!v) return;
											const dateStr = v.toString();

											setStockMovement({
												...stockMovement,
												stock_change_date: dateStr,
												stock_delivery_date: dateStr,
											});
										}}
									/>
								</div>

								<div className="flex flex-row gap-2 items-center">
									{/* Loss Reason */}
									{editKey == "edit-stock-loss" ? (
										<Input
											isClearable
											isRequired
											className="w-1/2"
											description="Stock loss reason"
											errorMessage="Loss reason is required"
											isInvalid={
												isSubmitted &&
												!stockMovement.stock_loss_reason?.trim()
											}
											label="Loss Reason"
											value={
												stockMovement.stock_loss_reason ??
												""
											}
											onValueChange={(v) =>
												setStockMovement({
													...stockMovement,
													stock_loss_reason: v,
												})
											}
										/>
									) : (
										<Input
											isClearable
											isRequired
											className="w-1/2"
											description="Stock supplier"
											errorMessage="Stock supplier is required"
											isInvalid={
												isSubmitted &&
												!stockMovement.stock_supplier?.trim()
											}
											label="Stock Supplier"
											value={
												stockMovement.stock_supplier ??
												""
											}
											onValueChange={(v) =>
												setStockMovement({
													...stockMovement,
													stock_supplier: v,
												})
											}
										/>
									)}

									{/* Total Amount Loss / Buying Price */}
									<Input
										isRequired
										className="w-1/2"
										description={
											editKey == "edit-stock-loss"
												? "Total ₱ on loss"
												: "Total ₱ on purchase"
										}
										errorMessage={
											editKey == "edit-stock-loss"
												? "Total amount loss is required"
												: "Total buying price is required"
										}
										inputMode="decimal"
										isInvalid={
											isSubmitted &&
											(stockMovement.stock_adjustment_amount ==
												null ||
												stockMovement.stock_adjustment_amount <=
													0)
										}
										label={
											editKey == "edit-stock-loss"
												? "Total Amount Loss"
												: "Total Buying Price"
										}
										startContent={
											<div className="pointer-events-none flex items-center">
												<span className="text-default-400 text-small">
													₱
												</span>
											</div>
										}
										type="text"
										value={
											stockMovement.stock_adjustment_amount !==
											undefined
												? String(
														stockMovement.stock_adjustment_amount,
													)
												: ""
										}
										onValueChange={(v) => {
											if (v === "") {
												setStockMovement({
													...stockMovement,
													stock_adjustment_amount:
														undefined,
												});

												return;
											}

											const num = Number(v);

											if (Number.isNaN(num)) return;

											setStockMovement({
												...stockMovement,
												stock_adjustment_amount: num,
											});
										}}
									/>
								</div>
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
										onPress={() => {
											onClose();
										}}
									>
										Cancel
									</Button>
									<Button
										color="success"
										onPress={handleAction}
									>
										Update Stock Details
									</Button>
								</div>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
			<StockAdjustmentConfirmationModal
				adjustmentAmount={changeCount}
				adjustmentType={
					editKey === "edit-stock-loss" ? "Loss" : "Acquisition"
				}
				currentStock={currentStock}
				isLoading={isLoading}
				isOpen={isOpenConfirm}
				itemUnitOfMeasure={itemUnitOfMeasure}
				newStock={newEffectiveStock}
				onConfirm={onConfirmStockChange}
				onOpenChange={onOpenChangeConfirm}
			/>
		</>
	);
}
