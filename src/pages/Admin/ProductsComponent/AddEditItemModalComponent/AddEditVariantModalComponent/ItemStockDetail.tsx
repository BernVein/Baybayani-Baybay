import React from "react";
import { Input, DatePicker } from "@heroui/react";
import {
	getLocalTimeZone,
	today,
	parseDate,
	type DateValue,
} from "@internationalized/date";

import { Variant } from "@/model/variant";

export function ItemStockDetail({
	itemUnitOfMeasure,
	variant,
	setVariant,
	isSubmitted,
}: {
	itemUnitOfMeasure: string;
	variant: Variant;
	setVariant: React.Dispatch<React.SetStateAction<Variant>>;
	isSubmitted: boolean;
}) {
	// Compute the DatePicker value from variant's stock_delivery_date
	const datePickerValue: DateValue | null = React.useMemo(() => {
		const deliveryDate =
			variant.variant_stock_latest_movement.stock_delivery_date;

		if (!deliveryDate) {
			return today(getLocalTimeZone()) as DateValue;
		}
		try {
			// Parse ISO date string (e.g., "2026-02-05T00:00:00+00:00")
			// Extract just the date part (YYYY-MM-DD)
			const dateStr = deliveryDate.split("T")[0];

			return parseDate(dateStr) as DateValue;
		} catch {
			// If parsing fails, default to today
			return today(getLocalTimeZone()) as DateValue;
		}
	}, [variant.variant_stock_latest_movement.stock_delivery_date]);

	return (
		<>
			<div className="flex flex-row gap-2 items-center">
				{/* Acquired Stocks */}
				<Input
					isRequired
					className="w-1/2"
					description="For stock display"
					endContent={
						<div className="pointer-events-none flex items-center">
							<span className="text-default-400 text-small">
								{itemUnitOfMeasure}
							</span>
						</div>
					}
					errorMessage="Acquired stock is required"
					inputMode="decimal"
					isInvalid={
						isSubmitted &&
						(variant.variant_stock_latest_movement
							?.effective_stocks == null ||
							variant.variant_stock_latest_movement
								?.effective_stocks <= 0)
					}
					label="Acquired Stocks"
					type="text"
					value={
						variant.variant_stock_latest_movement
							.effective_stocks !== undefined
							? String(
									variant.variant_stock_latest_movement
										.effective_stocks,
								)
							: ""
					}
					onValueChange={(v) => {
						if (v === "") {
							setVariant({
								...variant,
								variant_stock_latest_movement: {
									...variant.variant_stock_latest_movement,
									effective_stocks: undefined,
								},
							});

							return;
						}

						const num = Number(v);

						if (Number.isNaN(num)) return;

						setVariant({
							...variant,
							variant_stock_latest_movement: {
								...variant.variant_stock_latest_movement,
								effective_stocks: num,
							},
						});
					}}
				/>

				{/* Date Delivered */}
				<DatePicker
					isRequired
					className="w-1/2"
					description="Date the stock was acquired"
					errorMessage="Date delivered is required"
					isInvalid={
						isSubmitted &&
						!variant.variant_stock_latest_movement
							.stock_delivery_date
					}
					label="Date Delivered"
					value={datePickerValue as any}
					onChange={(v: DateValue | null) => {
						if (!v) return;
						setVariant({
							...variant,
							variant_stock_latest_movement: {
								...variant.variant_stock_latest_movement,
								stock_delivery_date: v
									.toDate(getLocalTimeZone())
									.toISOString(),
							},
						});
					}}
				/>
			</div>

			<div className="flex flex-row gap-2 items-center">
				{/* Supplier */}
				<Input
					isClearable
					isRequired
					className="w-1/2"
					description="Stock supplier name"
					errorMessage="Supplier is required"
					isInvalid={
						isSubmitted &&
						!variant.variant_stock_latest_movement.stock_supplier?.trim()
					}
					label="Supplier"
					value={
						variant.variant_stock_latest_movement.stock_supplier ??
						""
					}
					onValueChange={(v) =>
						setVariant({
							...variant,
							variant_stock_latest_movement: {
								...variant.variant_stock_latest_movement,
								stock_supplier: v,
							},
						})
					}
				/>

				{/* Total Buying Price */}
				<Input
					isRequired
					className="w-1/2"
					description="Total ₱ on purchase"
					errorMessage="Total buying price is required"
					inputMode="decimal"
					isInvalid={
						isSubmitted &&
						(variant.variant_stock_latest_movement
							.stock_adjustment_amount == null ||
							variant.variant_stock_latest_movement
								.stock_adjustment_amount <= 0)
					}
					label="Total Buying Price"
					startContent={
						<div className="pointer-events-none flex items-center">
							<span className="text-default-400 text-small">
								₱
							</span>
						</div>
					}
					type="text"
					value={
						variant.variant_stock_latest_movement
							.stock_adjustment_amount !== undefined
							? String(
									variant.variant_stock_latest_movement
										.stock_adjustment_amount,
								)
							: ""
					}
					onValueChange={(v) => {
						if (v === "") {
							setVariant({
								...variant,
								variant_stock_latest_movement: {
									...variant.variant_stock_latest_movement,
									stock_adjustment_amount: undefined,
								},
							});

							return;
						}

						const num = Number(v);

						if (Number.isNaN(num)) return;

						setVariant({
							...variant,
							variant_stock_latest_movement: {
								...variant.variant_stock_latest_movement,
								stock_adjustment_amount: num,
							},
						});
					}}
				/>
			</div>
		</>
	);
}
