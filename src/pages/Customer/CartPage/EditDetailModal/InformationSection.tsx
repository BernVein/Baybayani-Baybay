import { Item } from "@/model/Item";
import { Variant } from "@/model/variant";
import {
	Button,
	Divider,
	NumberInput,
	RadioGroup,
	Radio,
	cn,
} from "@heroui/react";
export const CustomRadio = (props: any) => {
	const { children, ...otherProps } = props;

	return (
		<Radio
			{...otherProps}
			classNames={{
				base: cn(
					"inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
					"flex-row-reverse max-w-full cursor-pointer rounded-lg gap-4 p-2 border-2 border-transparent",
					"data-[selected=true]:border-success"
				),
			}}
		>
			{children}
		</Radio>
	);
};
export default function InformationSection({
	item,
	selectedItemVariant,
	setSelectedItemVariant,
	selectedPriceVariant,
	setSelectedPriceVariant,
	rawQuantity,
	setRawQuantity,
}: {
	item: Item;
	selectedItemVariant: Variant | null;
	setSelectedItemVariant: (variant: Variant) => void;
	selectedPriceVariant: string;
	setSelectedPriceVariant: (variant: string) => void;
	rawQuantity: number;
	setRawQuantity: (quantity: number) => void;
}) {
	const computedDescription = !rawQuantity
		? "Enter quantity above"
		: selectedPriceVariant === "Wholesale"
			? `Quantity: ${Math.min(rawQuantity * (selectedItemVariant?.variant_wholesale_item ?? 1), selectedItemVariant?.variant_stocks ?? 0)} ${item.item_sold_by}s`
			: `Quantity: ${Math.min(rawQuantity, selectedItemVariant?.variant_stocks ?? 0)} ${item.item_sold_by}`;

	return (
		<>
			<p className="text-sm">{item.item_description}</p>
			{item.item_variants?.length > 1 && (
				<>
					<Divider />
					<RadioGroup
						label="Product Variants"
						color="success"
						size="sm"
						value={selectedItemVariant?.variant_id}
						onValueChange={(value) => {
							const foundVariant = item.item_variants.find(
								(variant) => variant.variant_id === value
							);
							if (foundVariant) {
								setSelectedItemVariant(foundVariant);
							}
						}}
					>
						{item.item_variants.map((variant, index) => (
							<CustomRadio
								key={index}
								value={variant.variant_id}
								description={`Stocks remaining: ${variant.variant_stocks ?? 0} ${item.item_sold_by}s`}
							>
								{variant.variant_name}
							</CustomRadio>
						))}
					</RadioGroup>
				</>
			)}
			<Divider />
			{/* Product Info Section */}
			<div className="flex flex-col gap-3">
				<span className="text-sm text-default-700">
					{selectedItemVariant?.variant_name} Information:
				</span>

				{/* Retail info */}
				<div className="gap-2 flex flex-row justify-between">
					<span className="text-xs text-default-400">
						Last Price Retail:
					</span>
					<span className="text-xs text-default-500">
						{selectedItemVariant?.variant_last_updated_price_retail ? (
							<>
								₱
								{selectedItemVariant.variant_last_price_retail?.toFixed(
									2
								)}{" "}
								(
								{(() => {
									const updatedAt =
										selectedItemVariant.variant_last_updated_price_retail;
									const now = new Date();
									const updatedDate = new Date(updatedAt);
									const diffTime =
										now.getTime() - updatedDate.getTime();
									const diffDays = Math.floor(
										diffTime / (1000 * 60 * 60 * 24)
									);
									if (diffDays === 0) return "Today";
									if (diffDays === 1) return "1 day ago";
									return `${diffDays} days ago`;
								})()}
								)
							</>
						) : (
							<span className="italic text-default-400">
								No change
							</span>
						)}
					</span>
				</div>

				{/* Wholesale info */}
				<div className="gap-2 flex flex-row justify-between">
					<span className="text-xs text-default-400">
						Last Price Wholesale:
					</span>
					<span className="text-xs text-default-500">
						{selectedItemVariant?.variant_last_updated_price_wholesale ? (
							<>
								₱
								{selectedItemVariant.variant_last_price_wholesale?.toFixed(
									2
								)}{" "}
								(
								{(() => {
									const updatedAt =
										selectedItemVariant.variant_last_updated_price_wholesale;
									const now = new Date();
									const updatedDate = new Date(updatedAt);
									const diffTime =
										now.getTime() - updatedDate.getTime();
									const diffDays = Math.floor(
										diffTime / (1000 * 60 * 60 * 24)
									);
									if (diffDays === 0) return "Today";
									if (diffDays === 1) return "1 day ago";
									return `${diffDays} days ago`;
								})()}
								)
							</>
						) : (
							<span className="italic text-default-400">
								No change
							</span>
						)}
					</span>
				</div>

				{/* Stocks info */}
				<div className="gap-2 flex flex-row justify-between">
					<span className="text-xs text-default-400">Stocks:</span>
					<span className="text-xs text-default-500">
						{selectedItemVariant?.variant_stocks ?? 0}{" "}
						{item.item_sold_by}
						{(selectedItemVariant?.variant_stocks ?? 0) > 1 &&
							"s"}{" "}
						left
					</span>
				</div>
			</div>

			<Divider />
			<RadioGroup
				label="Price Variants"
				color="success"
				size="sm"
				value={selectedPriceVariant}
				onValueChange={setSelectedPriceVariant}
			>
				<CustomRadio description="Retail price" value="Retail">
					₱
					{selectedItemVariant?.variant_price_retail?.toFixed(2) ?? 0}{" "}
					/ {item.item_sold_by}
				</CustomRadio>
				<CustomRadio
					description="Wholesale"
					value="Wholesale"
					isDisabled={
						// Disable if:
						// 1. No wholesale price, or
						// 2. Not enough stocks for wholesale order
						selectedItemVariant?.variant_price_wholesale == null ||
						(selectedItemVariant?.variant_stocks ?? 0) <
							(selectedItemVariant?.variant_wholesale_item ?? 0)
					}
				>
					<div className="flex items-center gap-2">
						{!selectedItemVariant ? (
							<span className="text-xs text-default-400 italic">
								No variant selected
							</span>
						) : selectedItemVariant.variant_price_wholesale ==
						  null ? (
							<span className="text-xs text-default-400 italic">
								No wholesale price available
							</span>
						) : (selectedItemVariant.variant_stocks ?? 0) <
						  (selectedItemVariant.variant_wholesale_item ?? 0) ? (
							<span className="text-xs text-default-400 italic">
								Insufficient stocks for wholesale
							</span>
						) : (
							<>
								<span>
									₱
									{selectedItemVariant.variant_price_wholesale?.toFixed(
										2
									)}{" "}
									/ {item.item_sold_by}
								</span>
								<span className="text-xs text-default-400">
									–{" "}
									{selectedItemVariant.variant_wholesale_item ??
										0}{" "}
									{item.item_sold_by}s / item
								</span>
							</>
						)}
					</div>
				</CustomRadio>
			</RadioGroup>
			<Divider />

			{/* Quantity Section */}
			<div className="flex flex-row items-center gap-2 mb-4">
				<NumberInput
					key={`${selectedPriceVariant}-${selectedItemVariant?.variant_stocks ?? 0}-${rawQuantity}-${selectedItemVariant?.variant_wholesale_item ?? 0}`}
					defaultValue={1}
					minValue={selectedPriceVariant === "Wholesale" ? 1 : 0.25}
					step={selectedPriceVariant === "Wholesale" ? 1 : 0.25}
					maxValue={
						selectedPriceVariant === "Wholesale"
							? (selectedItemVariant?.variant_stocks ?? 0) /
								(selectedItemVariant?.variant_wholesale_item ??
									1)
							: (selectedItemVariant?.variant_stocks ?? 0)
					}
					value={rawQuantity}
					onValueChange={(val) => setRawQuantity(val)}
					description={computedDescription}
					placeholder="Enter quantity"
					labelPlacement="outside"
					radius="sm"
					variant="faded"
					endContent={
						<div className="text-sm text-default-500 mr-2">
							{selectedPriceVariant === "Wholesale"
								? "Item"
								: item.item_sold_by}
						</div>
					}
					className="w-3/4"
					label={`Quantity (${selectedPriceVariant})`}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							setTimeout(() => {
								(e.currentTarget as HTMLInputElement).blur();
								window.scrollTo(0, 0);
							}, 150);
						}
					}}
				/>
				<Button
					color="success"
					onPress={() => {
						setRawQuantity(rawQuantity);
					}}
				>
					Confirm
				</Button>
			</div>
		</>
	);
}
