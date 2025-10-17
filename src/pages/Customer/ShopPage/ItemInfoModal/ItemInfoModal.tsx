import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Image,
	Chip,
	Divider,
	NumberInput,
	RadioGroup,
	Radio,
	cn,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { Item } from "@/model/Item";
import { ItemVariant } from "@/model/itemVariant";
import { CartIcon } from "@/components/icons";
import { tagColors, TagType } from "@/model/tagtype";
import useIsMobile from "@/lib/isMobile";
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

export default function ItemInfoModal({
	isOpen,
	onOpenChange,
	item,
}: {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	item: Item | null;
}) {
	const [selectedItemVariant, setSelectedItemVariant] =
		useState<ItemVariant | null>(null);
	const [mainImg, setMainImg] = useState(item?.img?.[0] || "");
	const isMobile = useIsMobile();
	const [selectedPriceVariant, setSelectedPriceVariant] = useState("Retail");
	const [rawQuantity, setRawQuantity] = useState(1);
	const actualQuantity =
		selectedPriceVariant === "Wholesale"
			? rawQuantity * (selectedItemVariant?.wholesale_item ?? 1)
			: rawQuantity;

	useEffect(() => {
		if (isOpen && item) {
			setSelectedPriceVariant("Retail");
			setRawQuantity(1);
		}
	}, [isOpen, item]);

	useEffect(() => {
		if (!selectedItemVariant) return;

		// Reset quantity and price type when variant changes
		setRawQuantity(1);
		setSelectedPriceVariant("Retail");
	}, [selectedItemVariant]);

	useEffect(() => {
		if (item?.img?.[0]) {
			setMainImg(item.img[0]);
		}
		if (item?.variants?.length) {
			setSelectedItemVariant(item.variants[0]);
		}
	}, [item]);
	if (!item) return null;

	const computedDescription = !rawQuantity
		? "Enter quantity above"
		: selectedPriceVariant === "Wholesale"
			? `Quantity: ${Math.min(rawQuantity * (selectedItemVariant?.wholesale_item ?? 1), selectedItemVariant?.stocks ?? 0)} ${item.sold_by}s`
			: `Quantity: ${Math.min(rawQuantity, selectedItemVariant?.stocks ?? 0)} ${item.sold_by}`;

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			classNames={{
				header: "border-b-[1px] border-[rgba(41,47,70,0.4)]",
				footer: "border-t-[1px] border-[rgba(41,47,70,0.4)]",
			}}
			size="2xl"
			scrollBehavior="inside"
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-2">
							<h2 className="text-lg font-semibold">
								{item.title || "Sample Item"}
							</h2>
						</ModalHeader>

						<ModalBody>
							<div className="flex flex-col md:flex-row gap-6">
								{/* Left: Carousel */}
								<div className="flex flex-col items-center md:sticky md:items-start gap-2 top-4 w-full self-start">
									<div className="relative">
										<Image
											alt={item.title || "Sample Item"}
											src={mainImg}
											isZoomed={!isMobile}
											width={300}
										/>
										{item.tag && (
											<Chip
												className="absolute top-2 left-2 z-10"
												color={
													tagColors[
														item.tag as TagType
													] || "default"
												}
												size="sm"
											>
												{item.tag}
											</Chip>
										)}
									</div>
									{item.img.length > 1 && (
										<div className="flex gap-2 mt-2">
											{item.img.map((url, index) => (
												<Image
													key={index}
													alt={
														item.title ||
														"Sample Item"
													}
													src={url}
													onClick={() =>
														setMainImg(url)
													}
													width={
														url === mainImg
															? 65
															: 70
													} // smaller width if selected
													isZoomed={!isMobile}
												/>
											))}
										</div>
									)}
								</div>

								{/* Right: Info */}
								<div className="flex flex-col gap-4 justify-start w-full mt-3">
									<p className="text-sm">
										{item.description}
									</p>
									{item.variants?.length > 1 && (
										<>
											<Divider />
											<RadioGroup
												label="Product Variants"
												color="success"
												size="sm"
												value={
													selectedItemVariant?.item_variant_id
												}
												onValueChange={(value) => {
													const foundVariant =
														item.variants.find(
															(variant) =>
																variant.item_variant_id ===
																value
														);
													if (foundVariant) {
														setSelectedItemVariant(
															foundVariant
														);
														console.log(
															"Selected variant:",
															foundVariant
														);
													}
												}}
											>
												{item.variants.map(
													(variant, index) => (
														<CustomRadio
															key={index}
															value={
																variant.item_variant_id
															}
															description={`Stocks remaining: ${variant.stocks ?? 0} ${item.sold_by}s`}
														>
															{
																variant.item_variant_name
															}
														</CustomRadio>
													)
												)}
											</RadioGroup>
										</>
									)}

									<Divider />
									<RadioGroup
										label="Price Variants"
										color="success"
										size="sm"
										value={selectedPriceVariant}
										onValueChange={setSelectedPriceVariant}
									>
										<CustomRadio
											description="Retail price"
											value="Retail"
										>
											₱
											{selectedItemVariant?.price_retail?.toFixed(
												2
											) ?? 0}{" "}
											per {item.sold_by}
										</CustomRadio>
										<CustomRadio
											description="Wholesale"
											value="Wholesale"
											isDisabled={
												selectedItemVariant?.price_wholesale ==
												null
											}
										>
											<div className="flex items-center gap-2">
												{selectedItemVariant?.price_wholesale !=
												null ? (
													<>
														<span>
															₱
															{selectedItemVariant.price_wholesale.toFixed(
																2
															)}{" "}
															per {item.sold_by}
														</span>
														<span className="text-xs text-default-400">
															–{" "}
															{selectedItemVariant.wholesale_item ??
																0}{" "}
															{item.sold_by}s per
															item
														</span>
													</>
												) : (
													<span className="text-xs text-default-400 italic">
														No wholesale price
														available
													</span>
												)}
											</div>
										</CustomRadio>
									</RadioGroup>
									<Divider />

									{/* Quantity Section */}
									<div className="flex flex-row items-center gap-2 mb-4">
										<NumberInput
											key={`${selectedPriceVariant}-${selectedItemVariant?.stocks ?? 0}-${rawQuantity}-${selectedItemVariant?.wholesale_item ?? 0}`}
											defaultValue={1}
											minValue={
												selectedPriceVariant ===
												"Wholesale"
													? 1
													: 0.25
											}
											step={
												selectedPriceVariant ===
												"Wholesale"
													? 1
													: 0.25
											}
											maxValue={
												selectedPriceVariant ===
												"Wholesale"
													? (selectedItemVariant?.stocks ??
															0) /
														(selectedItemVariant?.wholesale_item ??
															1)
													: (selectedItemVariant?.stocks ??
														0)
											}
											value={rawQuantity}
											onValueChange={(val) =>
												setRawQuantity(val)
											}
											description={computedDescription}
											placeholder="Enter quantity"
											labelPlacement="outside"
											radius="sm"
											variant="faded"
											endContent={
												<div className="text-sm text-default-500 mr-2">
													{selectedPriceVariant ===
													"Wholesale"
														? "Item"
														: item.sold_by}
												</div>
											}
											className="w-3/4"
											label={`Quantity (${selectedPriceVariant})`}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													setTimeout(() => {
														(
															e.currentTarget as HTMLInputElement
														).blur();
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
								</div>
							</div>
						</ModalBody>

						<ModalFooter className="flex justify-between items-center">
							<div className="flex flex-col gap-2 items-start">
								<span className="text-sm text-default-500">
									Subtotal ({selectedPriceVariant}):
								</span>
								<div className="flex flex-row gap-2 items-center">
									<span className="text-base font-semibold">
										{rawQuantity
											? `₱${(selectedPriceVariant ===
												"Wholesale"
													? (selectedItemVariant?.price_wholesale ??
															1) * actualQuantity
													: (selectedItemVariant?.price_retail ??
															0) * rawQuantity
												).toLocaleString(undefined, {
													minimumFractionDigits: 2,
													maximumFractionDigits: 2,
												})}`
											: "Enter quantity"}
									</span>
								</div>
							</div>
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
									startContent={
										<CartIcon className="size-5" />
									}
								>
									Add to Cart
								</Button>
							</div>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
