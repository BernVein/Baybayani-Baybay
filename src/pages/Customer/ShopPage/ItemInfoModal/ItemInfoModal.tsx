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
	item: Item;
}) {
	const [mainImg, setMainImg] = useState(item?.img?.[0] || "");
	const isMobile = useIsMobile();
	const [selectedPriceVariant, setSelectedPriceVariant] = useState("Retail");
	const [rawQuantity, setRawQuantity] = useState(1); // quantity entered by user
	const actualQuantity =
		selectedPriceVariant === "Wholesale"
			? rawQuantity * item.wholesaleItem
			: rawQuantity;
	useEffect(() => {
		if (isOpen && item) {
			setSelectedPriceVariant("Retail");
			setRawQuantity(1);
		}
	}, [isOpen, item]);

	useEffect(() => {
		if (item?.img?.[0]) {
			setMainImg(item.img[0]);
		}
	}, [item]);
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
								<div className="flex flex-col items-center md:items-start gap-2 w-full">
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
													width={70}
													isZoomed={!isMobile}
												/>
											))}
										</div>
									)}
								</div>

								{/* Right: Info */}
								<div className="flex flex-col gap-4 justify-start w-full">
									<div className="flex justify-between mt-3">
										<p className="text-xs font-light text-default-400 text-left">
											Previous price for retail:
										</p>
										<p className="text-xs font-light text-default-600 text-left">
											{item.previousPriceRetail ? (
												<>
													₱
													{item.previousPriceRetail.toFixed(
														2
													)}{" "}
													{item.lastUpdatedPriceRetail && (
														<span>
															{Math.floor(
																(Date.now() -
																	new Date(
																		item.lastUpdatedPriceRetail
																	).getTime()) /
																	(1000 *
																		60 *
																		60 *
																		24)
															)}{" "}
															days ago
														</span>
													)}
												</>
											) : (
												"No change since"
											)}
										</p>
									</div>
									<div className="flex justify-between">
										<p className="text-xs font-light text-default-400 text-left">
											Previous wholesale price:
										</p>
										<p className="text-xs font-light text-default-600 text-left">
											{item.previousPriceWholesale ? (
												<>
													₱
													{item.previousPriceWholesale.toFixed(
														2
													)}{" "}
													{item.lastUpdatedPriceWholesale && (
														<span>
															{Math.floor(
																(Date.now() -
																	new Date(
																		item.lastUpdatedPriceWholesale
																	).getTime()) /
																	(1000 *
																		60 *
																		60 *
																		24)
															)}{" "}
															days ago
														</span>
													)}
												</>
											) : (
												"No change since"
											)}
										</p>
									</div>
									<div className="flex justify-between">
										<p className="text-xs font-light text-default-400 text-left">
											Stock last updated:
										</p>
										<p className="text-xs font-light text-default-600 text-left">
											{item.lastUpdatedStock ? (
												<>
													{Math.floor(
														(Date.now() -
															new Date(
																item.lastUpdatedStock
															).getTime()) /
															(1000 *
																60 *
																60 *
																24)
													)}{" "}
													days ago
												</>
											) : (
												"No recent update"
											)}
										</p>
									</div>

									<Divider />

									<p className="text-sm">
										{item.description}
									</p>

									<Divider />
									<RadioGroup
										description={`Stocks remaining: ${item.stocks} ${item.soldBy}s`}
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
											₱{item.priceRetail.toFixed(2)} per{" "}
											{item.soldBy}
										</CustomRadio>
										<CustomRadio
											description="Wholesale"
											value="Wholesale"
										>
											<div className="flex items-center gap-2">
												<span>
													₱
													{item.priceWholesale.toFixed(
														2
													)}{" "}
													per {item.soldBy}
												</span>
												<span className="text-xs text-default-400">
													– {item.wholesaleItem}{" "}
													{item.soldBy}s per item
												</span>
											</div>
										</CustomRadio>
									</RadioGroup>
									<Divider />

									{/* Quantity Section */}
									<div className="flex flex-row items-center gap-2 mb-4">
										<NumberInput
											key={`${selectedPriceVariant}-${item.stocks}-${rawQuantity}`}
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
													? item.stocks /
														item.wholesaleItem
													: item.stocks
											}
											value={rawQuantity}
											onValueChange={(val) =>
												setRawQuantity(val)
											}
											description={
												!rawQuantity
													? "Enter quantity above"
													: selectedPriceVariant ===
														  "Wholesale"
														? `Quantity: ${rawQuantity * item.wholesaleItem} ${item.soldBy}s`
														: `Quantity: ${rawQuantity} ${item.soldBy}`
											}
											placeholder="Enter quantity"
											labelPlacement="outside"
											radius="sm"
											variant="faded"
											endContent={
												<div className="text-sm text-default-500 mr-2">
													{selectedPriceVariant ===
													"Wholesale"
														? "Item"
														: item.soldBy}
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
													? item.priceWholesale *
														actualQuantity
													: item.priceRetail *
														rawQuantity
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
