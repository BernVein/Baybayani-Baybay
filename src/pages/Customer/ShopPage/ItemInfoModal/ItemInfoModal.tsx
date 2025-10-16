import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Image,
	// Chip,
	Divider,
	NumberInput,
	RadioGroup,
	Radio,
	cn,
} from "@heroui/react";
import { Item } from "@/model/Item";
import { CartIcon } from "@/components/icons";
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
									<Image
										alt={item.title || "Sample Item"}
										src={item.img}
										isZoomed
									/>
									<div className="flex gap-2 mt-2 w-1/2">
										<Image
											alt="Thumbnail 1"
											src="https://picsum.photos/300/300?random=3"
											isZoomed
										/>
										<Image
											alt="Thumbnail 2"
											src="https://picsum.photos/300/300?random=2"
											isZoomed
										/>
										<Image
											alt="Thumbnail 3"
											src="https://picsum.photos/300/300?random=11"
											isZoomed
										/>
									</div>
								</div>

								{/* Right: Info */}
								<div className="flex flex-col gap-4 justify-start w-full">
									<p className="text-xs font-light text-default-400 text-center mt-3">
										Price last updated at: Oct 10, 2025
									</p>
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
