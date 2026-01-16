import {
	VegetablesOutline,
	FoodGrains24Regular,
	FruitsOutline,
	PoultryLeg,
	Chili,
	PhotoIcon,
	TrashIcon,
} from "@/components/icons";
import {
	Button,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Input,
	Select,
	SelectItem,
	Divider,
} from "@heroui/react";
export function EditItemModal({
	isOpen,
	onOpenChange,
}: {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			size="xl"
			scrollBehavior="inside"
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							Edit Details
						</ModalHeader>
						<ModalBody>
							<span className="text-lg font-semibold">
								Manage Item
							</span>
							<div className="flex flex-row gap-2 items-center">
								<Input
									key="1"
									label="Item Name"
									labelPlacement="outside"
									defaultValue="Banana"
									className="w-1/2"
								/>
								<Select
									labelPlacement="outside"
									label="Item Category"
									className="w-1/2"
								>
									<SelectItem
										startContent={<VegetablesOutline />}
									>
										Vegetable
									</SelectItem>
									<SelectItem
										startContent={<FruitsOutline />}
									>
										Fruit
									</SelectItem>
									<SelectItem
										startContent={<FoodGrains24Regular />}
									>
										Grain
									</SelectItem>
									<SelectItem startContent={<PoultryLeg />}>
										Poultry
									</SelectItem>
									<SelectItem startContent={<Chili />}>
										Spice
									</SelectItem>
								</Select>
							</div>
							<Input
								key="2"
								label="Item Short Description"
								labelPlacement="outside"
								defaultValue="Banana"
								className="w-full"
								type="text"
							/>
							<div className="flex flex-row gap-2 items-center">
								<Input
									key="1"
									label="Unit of Measure"
									labelPlacement="outside"
									defaultValue="Banana"
									className="w-1/2"
								/>
								<Select
									labelPlacement="outside"
									label="Item Tag"
									className="w-1/2"
								>
									<SelectItem>Restocked</SelectItem>
									<SelectItem>Fresh</SelectItem>
									<SelectItem>Discounted</SelectItem>
								</Select>
							</div>
							<div className="flex flex-row gap-2 items-center">
								<Button
									startContent={<PhotoIcon className="w-5" />}
									color="success"
									className="mt-2 w-full"
								>
									View Photos
								</Button>
							</div>

							<div className="flex flex-row gap-2 justify-end">
								<Button
									startContent={<TrashIcon className="w-5" />}
									color="danger"
									className="mt-2"
								>
									Delete Item
								</Button>
								<Button className="mt-2">Update</Button>
							</div>
							<Divider />

							<span className="text-lg font-semibold">
								Item Variants
							</span>

							{Array.from({ length: 5 }).map((_, index) => (
								<div key={index} className="space-y-2">
									<div className="flex flex-row gap-2 items-center">
										<Input
											label="Variant Name"
											labelPlacement="outside"
											defaultValue={`Variant ${index + 1}`}
											className="w-1/2"
										/>
										<Input
											label="Retail Price"
											labelPlacement="outside"
											defaultValue=""
											className="w-1/2"
										/>
									</div>

									<div className="flex flex-row gap-2 items-center">
										<Input
											label="Wholesale Price"
											labelPlacement="outside"
											defaultValue=""
											className="w-1/2"
										/>
										<Input
											label="Wholesale Pack Size"
											labelPlacement="outside"
											defaultValue=""
											className="w-1/2"
										/>
									</div>

									<div className="flex flex-row gap-2 justify-end">
										<Button
											startContent={
												<TrashIcon className="w-5" />
											}
											color="danger"
											className="mt-2"
										>
											Delete Variant
										</Button>
										<Button className="mt-2">Update</Button>
									</div>
								</div>
							))}
						</ModalBody>
						<ModalFooter>
							<Button
								color="danger"
								variant="light"
								onPress={onClose}
							>
								Close
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
