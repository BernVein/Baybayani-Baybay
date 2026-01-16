import {
	VegetablesOutline,
	FoodGrains24Regular,
	FruitsOutline,
	PoultryLeg,
	Chili,
	PhotoIcon,
	TrashIcon,
	PlusIcon,
	ExclamationCircle,
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
	useDisclosure,
} from "@heroui/react";
export function EditItemModal({
	isOpen,
	onOpenChange,
	isOpenDeleteItem,
	onOpenDeleteItem,
	onOpenChangeDeleteItem,
}: {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	isOpenDeleteItem: boolean;
	onOpenDeleteItem: () => void;
	onOpenChangeDeleteItem: () => void;
}) {
	const {
		isOpen: isOpenAddVar,
		onOpen: onOpenAddVar,
		onOpenChange: onOpenChangeAddVar,
	} = useDisclosure();
	const {
		isOpen: isOpenDeleteVar,
		onOpen: onOpenDeleteVar,
		onOpenChange: onOpenChangeDeleteVar,
	} = useDisclosure();
	return (
		<>
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
										defaultSelectedKeys={"2"}
										className="w-1/2"
									>
										<SelectItem
											key="1"
											startContent={<VegetablesOutline />}
										>
											Vegetable
										</SelectItem>
										<SelectItem
											key="2"
											startContent={<FruitsOutline />}
										>
											Fruit
										</SelectItem>
										<SelectItem
											key="3"
											startContent={
												<FoodGrains24Regular />
											}
										>
											Grain
										</SelectItem>
										<SelectItem
											key="4"
											startContent={<PoultryLeg />}
										>
											Poultry
										</SelectItem>
										<SelectItem
											key="5"
											startContent={<Chili />}
										>
											Spice
										</SelectItem>
									</Select>
								</div>
								<Input
									key="2"
									label="Item Short Description"
									labelPlacement="outside"
									defaultValue="An optional description for banana"
									className="w-full"
									type="text"
								/>
								<div className="flex flex-row gap-2 items-center">
									<Input
										key="1"
										label="Unit of Measure"
										labelPlacement="outside"
										defaultValue="kg"
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
										startContent={
											<PhotoIcon className="w-5" />
										}
										className="mt-2 w-full"
									>
										View Photos
									</Button>
								</div>

								<div className="flex flex-row gap-2 justify-end">
									<Button
										startContent={
											<TrashIcon className="w-5" />
										}
										color="danger"
										className="mt-2"
										onPress={onOpenDeleteItem}
									>
										Delete Item
									</Button>
									<Button color="success" className="mt-2">
										Update Item
									</Button>
								</div>
								<Divider />
								<div className="flex flex-row justify-between">
									<span className="text-lg font-semibold">
										Item Variants
									</span>
									<Button
										startContent={
											<PlusIcon className="w-5" />
										}
										onPress={onOpenAddVar}
									>
										Add Variant
									</Button>
								</div>

								{Array.from({ length: 2 }).map((_, index) => (
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
												defaultValue="₱12.00"
												className="w-1/2"
											/>
										</div>

										<div className="flex flex-row gap-2 items-center">
											<Input
												label="Wholesale Price"
												labelPlacement="outside"
												defaultValue="₱12.00"
												className="w-1/2"
											/>
											<Input
												label="Wholesale Pack Size"
												labelPlacement="outside"
												defaultValue="5"
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
												onPress={onOpenDeleteVar}
											>
												Delete Variant
											</Button>
											<Button
												className="mt-2"
												color="success"
											>
												Update Variant
											</Button>
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
			<Modal isOpen={isOpenAddVar} onOpenChange={onOpenChangeAddVar}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Add Variant
							</ModalHeader>
							<ModalBody>
								<div className="flex flex-row gap-2 items-center">
									<Input
										label="Variant Name"
										labelPlacement="outside"
										className="w-1/2"
									/>
									<Input
										label="Retail Price"
										labelPlacement="outside"
										className="w-1/2"
									/>
								</div>

								<div className="flex flex-row gap-2 items-center">
									<Input
										label="Wholesale Price"
										labelPlacement="outside"
										className="w-1/2"
									/>
									<Input
										label="Wholesale Pack Size"
										labelPlacement="outside"
										className="w-1/2"
									/>
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
								<Button color="success" onPress={onClose}>
									Add
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
			<Modal
				isOpen={isOpenDeleteVar}
				onOpenChange={onOpenChangeDeleteVar}
				size="sm"
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col items-center gap-2 text-center">
								<div className="flex items-center justify-center h-12 w-12 rounded-full bg-danger/10 text-danger">
									<ExclamationCircle className="w-6 h-6" />
								</div>
								<h2 className="text-lg font-semibold text-danger">
									Delete variant
								</h2>
							</ModalHeader>

							<ModalBody className="text-center text-default-600">
								<p className="text-sm leading-relaxed">
									Are you sure you want to remove{" "}
									<span className="font-semibold text-default-800">
										Variant 1
									</span>{" "}
									from this item?
								</p>
								<p className="text-xs text-default-500 mt-1">
									This action cannot be undone.
								</p>
							</ModalBody>

							<ModalFooter className="flex justify-center gap-3 pt-4">
								<Button
									variant="flat"
									color="default"
									className="px-6"
									onPress={onClose}
								>
									Cancel
								</Button>
								<Button
									color="danger"
									className="px-6 font-semibold"
								>
									Delete
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
			<Modal
				isOpen={isOpenDeleteItem}
				onOpenChange={onOpenChangeDeleteItem}
				size="sm"
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col items-center gap-2 text-center">
								<div className="flex items-center justify-center h-12 w-12 rounded-full bg-danger/10 text-danger">
									<ExclamationCircle className="w-6 h-6" />
								</div>
								<h2 className="text-lg font-semibold text-danger">
									Delete item
								</h2>
							</ModalHeader>

							<ModalBody className="text-center text-default-600">
								<p className="text-sm leading-relaxed">
									Are you sure you want to remove{" "}
									<span className="font-semibold text-default-800">
										Item 1
									</span>
								</p>
								<p className="text-xs text-default-500 mt-1">
									This action cannot be undone.
								</p>
							</ModalBody>

							<ModalFooter className="flex justify-center gap-3 pt-4">
								<Button
									variant="flat"
									color="default"
									className="px-6"
									onPress={onClose}
								>
									Cancel
								</Button>
								<Button
									color="danger"
									className="px-6 font-semibold"
								>
									Delete
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
