import { PhotoIcon, RightArrow } from "@/components/icons";
import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    SelectItem,
    Input,
    useDisclosure,
} from "@heroui/react";
import ModalAwareSelect from "@/lib/ModalAwareSelect";
import { AddVariantModal } from "@/pages/Admin/ProductsComponent/ProductTableComponent/AddItemModalComponent/AddVariantModal";
export type DBVariant = {
    name: string;
    priceRetail: number | undefined;
    priceWholesale: number | null;
    wholesaleMinQty: number | null;
};

export function AddItemModal({
    itemHasVariant,
    isOpen,
    onOpenChange,
}: {
    itemHasVariant: boolean;
    isOpen: boolean;
    onOpenChange: () => void;
}) {
    const {
        isOpen: isOpenAddVar,
        onOpen: onOpenAddVar,
        onOpenChange: onOpenChangeAddVar,
    } = useDisclosure();

    return (
        <>
            <Modal
                isDismissable={false}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="xl"
                scrollBehavior="inside"
                disableAnimation
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <div className="flex flex-col gap-2">
                                    <span className="text-lg font-semibold">
                                        Add Item{" "}
                                        <span className="font-extrabold">
                                            {itemHasVariant
                                                ? "with variant"
                                                : "without variant"}
                                        </span>
                                    </span>
                                    <span className="text-sm text-default-500 italic">
                                        Changes here are temporary. The item
                                        will be officially added only when you
                                        click the{" "}
                                        <span className="text-success-500 font-semibold">
                                            Add Item
                                        </span>{" "}
                                        button below.
                                    </span>
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <span className="text-lg font-semibold">
                                    Set Item Details
                                </span>
                                <div className="flex flex-row gap-2 items-center">
                                    <Input
                                        label="Item Name"
                                        labelPlacement="outside"
                                        className="w-1/2"
                                        isRequired
                                    />
                                    <ModalAwareSelect
                                        labelPlacement="outside"
                                        isRequired
                                        label="Item Category"
                                        className="w-1/2"
                                    >
                                        <SelectItem key="dcee3d7a-fd90-4ab8-a6cf-445a482b79ec">
                                            Vegetable
                                        </SelectItem>
                                        <SelectItem key="2a70992d-d42d-4f84-8da0-a3c67858c9fa">
                                            Fruit
                                        </SelectItem>
                                        <SelectItem key="d57fbbf4-1b78-4d79-9414-f3df92b32174">
                                            Grain
                                        </SelectItem>
                                        <SelectItem key="38322c8d-ec86-45e5-9d04-2a2012259ba9">
                                            Poultry
                                        </SelectItem>
                                        <SelectItem key="257eaa6d-3549-40bc-b2ce-733258b37b0f">
                                            Spice
                                        </SelectItem>
                                    </ModalAwareSelect>
                                </div>
                                <Input
                                    key="2"
                                    label="Item Short Description"
                                    labelPlacement="outside"
                                    className="w-full"
                                    type="text"
                                />
                                <div className="flex flex-row gap-2 items-center">
                                    <Input
                                        key="1"
                                        isRequired
                                        label="Unit of Measure"
                                        labelPlacement="outside"
                                        className="w-1/2"
                                    />
                                    <ModalAwareSelect
                                        labelPlacement="outside"
                                        label="Item Tag"
                                        className="w-1/2"
                                    >
                                        <SelectItem key="f95d0a99-d212-4323-95c6-dedfbdd51079">
                                            Restocked
                                        </SelectItem>
                                        <SelectItem key="a80485a4-a437-4160-bb5e-5b5b520d7ab8">
                                            Price Drop
                                        </SelectItem>
                                        <SelectItem key="975a7cc0-620d-447e-b8eb-626b3da177be">
                                            Fresh
                                        </SelectItem>
                                        <SelectItem key="6ecbbca0-29d6-4dbe-9825-f4b4dd8ae831">
                                            Discounted
                                        </SelectItem>
                                    </ModalAwareSelect>
                                </div>
                                <Button
                                    startContent={<PhotoIcon className="w-5" />}
                                    className="mt-2 w-full"
                                >
                                    Add Photos
                                </Button>
                                <Button
                                    startContent={
                                        <RightArrow className="w-5" />
                                    }
                                    className="mt-2 w-full"
                                    color="success"
                                    onPress={onOpenAddVar}
                                >
                                    Proceed
                                </Button>
                            </ModalBody>
                            <ModalFooter className="justify-between items-center">
                                <span className="text-sm text-default-500 italic">
                                    <span className="text-red-500">*</span>{" "}
                                    Required field
                                </span>

                                <div className="flex gap-2">
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={onClose}
                                    >
                                        Cancel
                                    </Button>
                                    <Button color="success">Add Item</Button>
                                </div>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <AddVariantModal
                isOpenAddVar={isOpenAddVar}
                onOpenChangeAddVar={onOpenChangeAddVar}
                itemHasVariant={itemHasVariant}
            />
        </>
    );
}
