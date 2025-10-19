import {
	Button,
	Card,
	CardBody,
	Divider,
	Image,
	NumberInput,
} from "@heroui/react";
import useIsMobile from "@/lib/isMobile";
export default function Cart() {
	const dummyItems = Array.from({ length: 5 });
	const isMobile = useIsMobile();
	return (
		<div className="flex flex-col lg:flex-row gap-6 p-5 md:p-10 w-full lg:w-3/4 mx-auto">
			{/* Left Section - Items */}
			<div className="flex flex-col gap-4 w-full lg:w-2/3">
				{dummyItems.map((_, index) => (
					<Card
						key={index}
						className="w-full flex flex-row border-2 border-transparent data-[focus=true]:border-green-500 focus:outline-none"
						isPressable
					>
						<CardBody className="w-auto">
							<Image
								alt="Card background"
								src="https://heroui.com/images/hero-card-complete.jpeg"
								className="h-full object-cover rounded-xl"
								removeWrapper
								width={isMobile ? 250 : 400}
							/>
						</CardBody>
						<CardBody className="items-start gap-2">
							<div className="flex flex-col gap-2">
								<div className="items-center flex flex-row gap-2">
									<span className="font-bold text-base">
										Variant Name {index + 1}
									</span>
									<span className="text-default-500 text-sm">
										Wholesale
									</span>
								</div>

								<span className="text-xs text-default-400">
									Stock: 231 kilo left
								</span>
								<span className="text-sm text-default-500">
									Set or Edit Quantity:
								</span>
								<div className="flex flex-row items-center gap-2">
									<NumberInput
										size="sm"
										className="w-3/4"
										labelPlacement="outside"
										placeholder="Edit quantity"
										description="50 kilos total"
										endContent={
											<div className="text-sm text-default-500 mr-2">
												Item
											</div>
										}
									/>
									<Button className="mb-6" size="sm">
										Confirm
									</Button>
								</div>
							</div>
						</CardBody>
						<CardBody className="items-end gap-2">
							<div className="flex flex-row items-center gap-2">
								<span className="text-sm text-default-400">
									Subtotal:
								</span>
								<span className="text-base font-bold">
									₱123.45
								</span>
							</div>
						</CardBody>
					</Card>
				))}
			</div>

			{/* Right Section - Summary */}
			<div className="w-full lg:w-1/3">
				<Card className="h-full">
					<CardBody>
						<h3 className="text-lg font-bold mb-2">
							Order Summary
						</h3>
						<p className="text-sm text-default-500">
							This section can contain total price, checkout
							button, etc.
						</p>
					</CardBody>
				</Card>
			</div>
		</div>
	);
}
