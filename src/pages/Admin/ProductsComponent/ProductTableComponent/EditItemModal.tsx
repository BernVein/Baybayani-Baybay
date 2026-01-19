import {
	VegetablesOutline,
	FoodGrains24Regular,
	FruitsOutline,
	PoultryLeg,
	Chili,
	PhotoIcon,
	TrashIcon,
	PlusIcon,
} from "@/components/icons";
import {
	Button,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Input,
	SelectItem,
	Divider,
	useDisclosure,
} from "@heroui/react";
import ModalAwareSelect from "@/lib/ModalAwareSelect";
import { AddVariantModal } from "@/pages/Admin/ProductsComponent/ProductTableComponent/EditItemModalComponent/AddVariantModal";
import { DeleteVariantModal } from "@/pages/Admin/ProductsComponent/ProductTableComponent/EditItemModalComponent/DeleteVariantModal";
export function EditItemModal({
	isOpen,
	onOpenChange,
}: {
	isOpen: boolean;
	onOpenChange: () => void;
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
				isDismissable={false}
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
										label="Item Name"
										labelPlacement="outside"
										defaultValue="Banana"
										className="w-1/2"
									/>
									<ModalAwareSelect
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
									</ModalAwareSelect>
								</div>
								<Input
									label="Item Short Description"
									labelPlacement="outside"
									defaultValue="An optional description for banana"
									className="w-full"
									type="text"
								/>
								<div className="flex flex-row gap-2 items-center">
									<Input
										label="Unit of Measure"
										labelPlacement="outside"
										defaultValue="kg"
										className="w-1/2"
									/>
									<ModalAwareSelect
										labelPlacement="outside"
										label="Item Tag"
										className="w-1/2"
										defaultSelectedKeys={"2"}

									>
										<SelectItem key="1">Restocked</SelectItem>
										<SelectItem key="2">Fresh</SelectItem>
										<SelectItem key="3">Discounted</SelectItem>
									</ModalAwareSelect>
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
			<AddVariantModal
				isOpenAddVar={isOpenAddVar}
				onOpenChangeAddVar={onOpenChangeAddVar}
			/>
			<DeleteVariantModal
				isOpenDeleteVar={isOpenDeleteVar}
				onOpenChangeDeleteVar={onOpenChangeDeleteVar}
			/>
		</>
	);
}
