import {
	VegetablesOutline,
	FoodGrains24Regular,
	FruitsOutline,
	PoultryLeg,
	Chili,
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
} from "@heroui/react";
export function EditItemModal({
	isOpen,
	onOpenChange,
}: {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							Manage Item
						</ModalHeader>
						<ModalBody>
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
						</ModalBody>
						<ModalFooter>
							<Button
								color="danger"
								variant="light"
								onPress={onClose}
							>
								Close
							</Button>
							<Button color="primary" onPress={onClose}>
								Action
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
