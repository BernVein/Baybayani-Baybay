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
								<div className="flex flex-col items-center md:items-start gap-2">
									<Image
										alt={item.title || "Sample Item"}
										src={item.img}
										isZoomed
										width={230}
										height={230}
									/>
									<div className="flex gap-2 mt-2">
										<Image
											alt="Thumbnail 1"
											src="https://picsum.photos/300/300?random=3"
											width={70}
											height={70}
											isZoomed
										/>
										<Image
											alt="Thumbnail 2"
											src="https://picsum.photos/300/300?random=2"
											width={70}
											height={70}
											isZoomed
										/>
										<Image
											alt="Thumbnail 3"
											src="https://picsum.photos/300/300?random=11"
											width={70}
											height={70}
											isZoomed
										/>
									</div>
								</div>

								{/* Right: Info */}
								<div className="flex flex-col gap-4 justify-center sm:justify-start">
									<p className="text-default-500 text-sm">
										{item.description}
									</p>

									<Divider />
									<RadioGroup
										description="Price is cheaper when purchased in wholesale"
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
													{item.soldBy} per item
												</span>
											</div>
										</CustomRadio>
									</RadioGroup>
									{/* Quantity Stepper */}
									<div className="flex items-center gap-4 mt-2">
										<span className="font-semibold">
											Quantity:
										</span>
										<NumberInput
											defaultValue={1}
											placeholder={`Enter quantity in ${item.soldBy}`}
											labelPlacement="outside"
										/>
									</div>
								</div>
							</div>
						</ModalBody>

						<ModalFooter className="flex">
							<Button
								color="danger"
								variant="light"
								onPress={onClose}
							>
								Close
							</Button>
							<Button color="primary">Add to Cart</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
