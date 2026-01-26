import { PhotoIcon, TrashIcon, PlusIcon } from "@/components/icons";
import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    NumberInput,
    SelectItem,
    Divider,
    Input,
    useDisclosure,
} from "@heroui/react";
import ModalAwareSelect from "@/lib/ModalAwareSelect";
import { useState } from "react";

type DBVariant = {
    name: string;
    stocks: number | undefined;
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

    // Item fields
    const [itemTitle, setItemTitle] = useState<string>("");
    const [itemCategoryId, setItemCategoryId] = useState<string>("");
    const [itemDescription, setItemDescription] = useState<string>("");
    const [itemSoldBy, setItemSoldBy] = useState<string>("");
    const [itemTagId, setItemTagId] = useState<string | null>(null);
    // const [itemImage, setItemImage] = useState<string[]>([]);

    const [variants, setVariants] = useState<DBVariant[]>([
        {
            name: itemTitle || "",
            stocks: undefined,
            priceRetail: undefined,
            priceWholesale: null,
            wholesaleMinQty: null,
        },
    ]);

    const [tempVariant, setTempVariant] = useState<DBVariant>({
        name: "",
        stocks: undefined,
        priceRetail: undefined,
        priceWholesale: null,
        wholesaleMinQty: null,
    });

    const updateVariant = <K extends keyof DBVariant>(
        index: number,
        key: K,
        value: DBVariant[K],
    ) => {
        setVariants((prev) =>
            prev.map((v, i) => (i === index ? { ...v, [key]: value } : v)),
        );
    };

    const removeVariant = (index: number) => {
        setVariants((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAddVariant = () => {
        setVariants((prev) => [...prev, tempVariant]);

        setTempVariant({
            name: "",
            stocks: 0,
            priceRetail: 0,
            priceWholesale: null,
            wholesaleMinQty: null,
        });
    };

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
                                        Add Item
                                    </span>
                                    <span className="text-sm text-default-500 italic">
                                        Note: Changes here are temporary. The
                                        item will be officially added only when
                                        you click the "Add Item" button below.
                                    </span>
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <span className="text-lg font-semibold">
                                    Set Item Details
                                </span>
                                <div className="flex flex-row gap-2 items-center">
                                    <Input
                                        key="1"
                                        isRequired
                                        label="Item Name"
                                        labelPlacement="outside"
                                        className="w-1/2"
                                        value={itemTitle}
                                        onValueChange={(value) => {
                                            setItemTitle(value);
                                            if (!itemHasVariant) {
                                                setTempVariant((prev) => ({
                                                    ...prev,
                                                    name: value,
                                                }));
                                            }
                                        }}
                                    />
                                    <ModalAwareSelect
                                        labelPlacement="outside"
                                        isRequired
                                        label="Item Category"
                                        className="w-1/2"
                                        selectedKeys={itemCategoryId}
                                        onSelectionChange={(keys) =>
                                            setItemCategoryId(keys as string)
                                        }
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
                                    value={itemDescription}
                                    onValueChange={setItemDescription}
                                />
                                <div className="flex flex-row gap-2 items-center">
                                    <Input
                                        key="1"
                                        isRequired
                                        label="Unit of Measure"
                                        labelPlacement="outside"
                                        className="w-1/2"
                                        value={itemSoldBy}
                                        onValueChange={setItemSoldBy}
                                    />
                                    <ModalAwareSelect
                                        labelPlacement="outside"
                                        label="Item Tag"
                                        className="w-1/2"
                                        selectedKeys={itemTagId || undefined}
                                        onSelectionChange={(keys) =>
                                            setItemTagId(keys as string)
                                        }
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
                                {itemHasVariant === false && (
                                    <>
                                        <div className="flex flex-row gap-2 items-center">
                                            <NumberInput
                                                label="Stocks"
                                                isRequired
                                                labelPlacement="outside"
                                                className="w-1/2"
                                                value={tempVariant.stocks}
                                                onValueChange={(value) =>
                                                    setTempVariant((prev) => ({
                                                        ...prev,
                                                        stocks: value,
                                                    }))
                                                }
                                            />
                                            <NumberInput
                                                label="Retail Price"
                                                isRequired
                                                startContent={
                                                    <div className="pointer-events-none flex items-center">
                                                        <span className="text-default-400 text-small">
                                                            ₱
                                                        </span>
                                                    </div>
                                                }
                                                labelPlacement="outside"
                                                className="w-1/2"
                                                formatOptions={{
                                                    style: "decimal",
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }}
                                                value={tempVariant.priceRetail}
                                                onValueChange={(value) =>
                                                    setTempVariant((prev) => ({
                                                        ...prev,
                                                        priceRetail: value,
                                                    }))
                                                }
                                            />
                                        </div>

                                        <div className="flex flex-row gap-2 items-center">
                                            <NumberInput
                                                label="Wholesale Price"
                                                labelPlacement="outside"
                                                className="w-1/2"
                                                startContent={
                                                    <div className="pointer-events-none flex items-center">
                                                        <span className="text-default-400 text-small">
                                                            ₱
                                                        </span>
                                                    </div>
                                                }
                                                formatOptions={{
                                                    style: "decimal",
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }}
                                                value={
                                                    tempVariant.priceWholesale ??
                                                    undefined
                                                }
                                                onValueChange={(value) =>
                                                    setTempVariant((prev) => ({
                                                        ...prev,
                                                        priceWholesale: value,
                                                    }))
                                                }
                                            />
                                            <NumberInput
                                                label="Wholesale Min Qty"
                                                labelPlacement="outside"
                                                className="w-1/2"
                                                value={
                                                    tempVariant.wholesaleMinQty ??
                                                    undefined
                                                }
                                                onValueChange={(value) =>
                                                    setTempVariant((prev) => ({
                                                        ...prev,
                                                        wholesaleMinQty: value,
                                                    }))
                                                }
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
                                {itemHasVariant === true && (
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

                                        {variants.map((variant, index) => (
                                            <div
                                                key={index}
                                                className="space-y-2"
                                            >
                                                <div className="flex flex-row gap-2 items-center">
                                                    <Input
                                                        label="Variant Name"
                                                        isRequired
                                                        labelPlacement="outside"
                                                        className="w-1/3"
                                                        value={variant.name}
                                                        onValueChange={(v) =>
                                                            updateVariant(
                                                                index,
                                                                "name",
                                                                v,
                                                            )
                                                        }
                                                    />

                                                    <NumberInput
                                                        label="Stocks"
                                                        isRequired
                                                        labelPlacement="outside"
                                                        className="w-1/3"
                                                        value={variant.stocks}
                                                        onValueChange={(v) =>
                                                            updateVariant(
                                                                index,
                                                                "stocks",
                                                                v,
                                                            )
                                                        }
                                                    />

                                                    <NumberInput
                                                        label="Retail Price"
                                                        isRequired
                                                        labelPlacement="outside"
                                                        className="w-1/3"
                                                        formatOptions={{
                                                            style: "decimal",
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        }}
                                                        startContent={
                                                            <div className="pointer-events-none flex items-center">
                                                                <span className="text-default-400 text-small">
                                                                    ₱
                                                                </span>
                                                            </div>
                                                        }
                                                        value={
                                                            variant.priceRetail
                                                        }
                                                        onValueChange={(v) =>
                                                            updateVariant(
                                                                index,
                                                                "priceRetail",
                                                                v,
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="flex flex-row gap-2 items-center">
                                                    <NumberInput
                                                        label="Wholesale Price"
                                                        labelPlacement="outside"
                                                        className="w-1/2"
                                                        formatOptions={{
                                                            style: "decimal",
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        }}
                                                        startContent={
                                                            <div className="pointer-events-none flex items-center">
                                                                <span className="text-default-400 text-small">
                                                                    ₱
                                                                </span>
                                                            </div>
                                                        }
                                                        value={
                                                            variant.priceWholesale ??
                                                            undefined
                                                        }
                                                        onValueChange={(v) =>
                                                            updateVariant(
                                                                index,
                                                                "priceWholesale",
                                                                v,
                                                            )
                                                        }
                                                    />

                                                    <NumberInput
                                                        label="Wholesale Min Qty"
                                                        labelPlacement="outside"
                                                        className="w-1/2"
                                                        value={
                                                            variant.wholesaleMinQty ??
                                                            undefined
                                                        }
                                                        onValueChange={(v) =>
                                                            updateVariant(
                                                                index,
                                                                "wholesaleMinQty",
                                                                v,
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="flex justify-end">
                                                    <Button
                                                        startContent={
                                                            <TrashIcon className="w-5" />
                                                        }
                                                        color="danger"
                                                        className="mt-2"
                                                        onPress={() =>
                                                            removeVariant(index)
                                                        }
                                                    >
                                                        Remove Variant
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
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
                                        isRequired
                                        labelPlacement="outside"
                                        className="w-1/3"
                                        value={tempVariant.name}
                                        onValueChange={(value) =>
                                            setTempVariant((prev) => ({
                                                ...prev,
                                                name: value,
                                            }))
                                        }
                                    />
                                    <NumberInput
                                        label="Stocks"
                                        isRequired
                                        labelPlacement="outside"
                                        className="w-1/3"
                                        value={tempVariant.stocks}
                                        onValueChange={(value) =>
                                            setTempVariant((prev) => ({
                                                ...prev,
                                                stocks: value,
                                            }))
                                        }
                                    />
                                    <NumberInput
                                        label="Retail Price"
                                        formatOptions={{
                                            style: "decimal",
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }}
                                        isRequired
                                        startContent={
                                            <div className="pointer-events-none flex items-center">
                                                <span className="text-default-400 text-small">
                                                    ₱
                                                </span>
                                            </div>
                                        }
                                        labelPlacement="outside"
                                        className="w-1/3"
                                        value={tempVariant.priceRetail}
                                        onValueChange={(value) =>
                                            setTempVariant((prev) => ({
                                                ...prev,
                                                priceRetail: value,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="flex flex-row gap-2 items-center">
                                    <NumberInput
                                        label="Wholesale Price"
                                        formatOptions={{
                                            style: "decimal",
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }}
                                        startContent={
                                            <div className="pointer-events-none flex items-center">
                                                <span className="text-default-400 text-small">
                                                    ₱
                                                </span>
                                            </div>
                                        }
                                        labelPlacement="outside"
                                        className="w-1/2"
                                        value={
                                            tempVariant.priceWholesale ??
                                            undefined
                                        }
                                        onValueChange={(value) =>
                                            setTempVariant((prev) => ({
                                                ...prev,
                                                priceWholesale: value,
                                            }))
                                        }
                                    />
                                    <NumberInput
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
                                <Button
                                    color="success"
                                    onPress={() => {
                                        handleAddVariant();
                                        onClose();
                                    }}
                                >
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
