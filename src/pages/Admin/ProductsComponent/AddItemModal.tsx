import { PhotoIcon, TrashIcon, PlusIcon } from "@/components/icons";
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
                                Add Item
                            </ModalHeader>
                            <ModalBody>
                                <span className="text-lg font-semibold">
                                    Item Details
                                </span>
                                <div className="flex flex-row gap-2 items-center">
                                    <Input
                                        key="1"
                                        label="Item Name"
                                        labelPlacement="outside"
                                        className="w-1/2"
                                    />
                                    <ModalAwareSelect
                                        labelPlacement="outside"
                                        label="Item Category"
                                        className="w-1/2"
                                    >
                                        <SelectItem key="1">
                                            Vegetable
                                        </SelectItem>
                                        <SelectItem key="2">Fruit</SelectItem>
                                        <SelectItem key="3">Grain</SelectItem>
                                        <SelectItem key="4">Poultry</SelectItem>
                                        <SelectItem key="5">Spice</SelectItem>
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
                                        label="Unit of Measure"
                                        labelPlacement="outside"
                                        className="w-1/2"
                                    />
                                    <ModalAwareSelect
                                        labelPlacement="outside"
                                        label="Item Tag"
                                        className="w-1/2"
                                    >
                                        <SelectItem>Restocked</SelectItem>
                                        <SelectItem>Fresh</SelectItem>
                                        <SelectItem>Discounted</SelectItem>
                                    </ModalAwareSelect>
                                </div>
                                {!itemHasVariant && (
                                    <>
                                        <div className="flex flex-row gap-2 items-center">
                                            <Input
                                                label="Stocks"
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
                                                label="Wholesale Min Qty"
                                                labelPlacement="outside"
                                                className="w-1/2"
                                            />
                                        </div>
                                    </>
                                )}

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
                                {itemHasVariant && (
                                    <>
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

                                        {Array.from({ length: 1 }).map(
                                            (_, index) => (
                                                <div
                                                    key={index}
                                                    className="space-y-2"
                                                >
                                                    <div className="flex flex-row gap-2 items-center">
                                                        <Input
                                                            label="Variant Name"
                                                            labelPlacement="outside"
                                                            className="w-1/3"
                                                        />
                                                        <Input
                                                            label="Stocks"
                                                            labelPlacement="outside"
                                                            className="w-1/3"
                                                        />
                                                        <Input
                                                            label="Retail Price"
                                                            labelPlacement="outside"
                                                            className="w-1/3"
                                                        />
                                                    </div>

                                                    <div className="flex flex-row gap-2 items-center">
                                                        <Input
                                                            label="Wholesale Price"
                                                            labelPlacement="outside"
                                                            className="w-1/2"
                                                        />
                                                        <Input
                                                            label="Wholesale Min Qty"
                                                            labelPlacement="outside"
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
                                                            Remove Variant
                                                        </Button>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button color="success" onPress={onClose}>
                                    Add item
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <Modal
                isOpen={isOpenAddVar}
                onOpenChange={onOpenChangeAddVar}
                disableAnimation
            >
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
                                        className="w-1/3"
                                    />
                                    <Input
                                        label="Stocks"
                                        labelPlacement="outside"
                                        className="w-1/3"
                                    />
                                    <Input
                                        label="Retail Price"
                                        labelPlacement="outside"
                                        className="w-1/3"
                                    />
                                </div>

                                <div className="flex flex-row gap-2 items-center">
                                    <Input
                                        label="Wholesale Price"
                                        labelPlacement="outside"
                                        className="w-1/2"
                                    />
                                    <Input
                                        label="Wholesale Min Qty"
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
                                    Add Variant
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
