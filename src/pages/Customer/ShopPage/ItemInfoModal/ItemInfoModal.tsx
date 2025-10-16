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
											isZoomed
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
									<div className="flex gap-2 mt-2">
										{item.img.map((url, index) => (
											<Image
												key={index}
												alt={
													item.title || "Sample Item"
												}
												src={url}
												isZoomed
												onClick={() => setMainImg(url)}
												width={70}
											/>
										))}
									</div>
								</div>

								{/* Right: Info */}
								<div className="flex flex-col gap-4 justify-start w-full">
									<div className="flex justify-between mt-3">
										<p className="text-xs font-light text-default-400 text-left">
											Previous price:
										</p>
										<p className="text-xs font-light text-default-600 text-left">
											₱{item.priceRetail.toFixed(2)} 4
											days ago
										</p>
									</div>
									<div className="flex justify-between">
										<p className="text-xs font-light text-default-400 text-left">
											Stock last updated:
										</p>
										<p className="text-xs font-light text-default-600 text-left">
											4 days ago
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
									>
										<CustomRadio
											description={`₱${item.priceRetail.toFixed(2)} per ${item.soldBy}`}
											value="retail"
										>
											Retail
										</CustomRadio>
										<CustomRadio
											description={`₱${item.priceWholesale.toFixed(2)} per ${item.soldBy}`}
											value="wholesale"
										>
											<div className="flex items-center gap-2">
												<span>Wholesale</span>
												<span className="text-xs text-default-400">
													– {item.wholesaleItem}{" "}
													{item.soldBy}s per item
												</span>
											</div>
										</CustomRadio>
									</RadioGroup>
									<Divider />

									{/* Quantity Section */}
									<div className="flex flex-col gap-2">
										<div className="flex flex-row items-center gap-2 mb-4">
											<NumberInput
												defaultValue={1}
												minValue={0.1}
												placeholder={`Enter quantity in`}
												labelPlacement="outside"
												radius="sm"
												variant="faded"
												endContent={
													<div className="text-sm text-default-500 mr-2">
														{item.soldBy}
													</div>
												}
												className="w-3/4"
												label={`Quantity (${item.soldBy})`}
												validate={(value) => {
													const num = Number(value);
													if (num > item.stocks) {
														return `Quantity must be less than ${item.stocks}`;
													}

													if (
														num %
															item.wholesaleItem !==
														0
													) {
														return `Wholesale requirement: divisible by ${item.wholesaleItem}`;
													}

													return null;
												}}
											/>
										</div>
									</div>
								</div>
							</div>
						</ModalBody>

						<ModalFooter className="flex justify-between items-center">
							<div className="flex flex-col gap-2 items-start">
								<span className="text-sm text-default-500">
									Subtotal (Retail):
								</span>
								<div className="flex flex-row gap-2 items-center">
									<span className="text-base font-semibold">
										₱{item.priceRetail.toFixed(2)}
									</span>
									<span className="text-sm text-default-500">
										{" "}
										1 {item.soldBy}
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
