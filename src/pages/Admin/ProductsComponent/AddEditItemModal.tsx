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
    Skeleton,
} from "@heroui/react";
import ModalAwareSelect from "@/lib/ModalAwareSelect";
import { useFetchSingleItem } from "@/data/supabase/Admin/Products/useFetchSingleItem";
import { AddVariantModal } from "@/pages/Admin/ProductsComponent/ProductTableComponent/EditItemModalComponent/AddVariantModal";
export function AddEditItemModal({
    item_id,
    isOpen,
    onOpenChange,
}: {
    item_id?: string; // optional
    isOpen: boolean;
    onOpenChange: () => void;
}) {
    const { item, loading } = useFetchSingleItem(item_id || "");
    const {
        isOpen: isOpenAddVar,
        onOpen: onOpenAddVar,
        onOpenChange: onOpenChangeAddVar,
    } = useDisclosure();

    const isEdit = !!item_id; // determine add or edit

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
                                {isEdit ? "Edit Item" : "Add Item"}
                            </ModalHeader>
                            <ModalBody>
                                {loading ? (
                                    <div className="space-y-4">
                                        <Skeleton className="w-1/2 h-10 rounded-md" />
                                        <Skeleton className="w-1/2 h-10 rounded-md" />
                                        <Skeleton className="w-full h-10 rounded-md" />
                                        <div className="flex gap-2">
                                            <Skeleton className="w-1/2 h-10 rounded-md" />
                                            <Skeleton className="w-1/2 h-10 rounded-md" />
                                        </div>
                                        <div className="flex gap-2">
                                            <Skeleton className="w-1/2 h-10 rounded-md" />
                                            <Skeleton className="w-1/2 h-10 rounded-md" />
                                        </div>
                                        <Skeleton className="w-full h-10 rounded-md" />
                                    </div>
                                ) : (
                                    <>
                                        <span className="text-lg font-semibold">
                                            Item Details
                                        </span>
                                        <div className="flex flex-row gap-2 items-center">
                                            <Input
                                                key="1"
                                                isRequired
                                                label="Item Name"
                                                labelPlacement="outside"
                                                className="w-1/2"
                                                value={item?.item_title || ""}
                                            />
                                            <ModalAwareSelect
                                                labelPlacement="outside"
                                                isRequired
                                                label="Item Category"
                                                className="w-1/2"
                                                selectedKeys={
                                                    item?.item_category
                                                        ? [item.item_category]
                                                        : []
                                                }
                                            >
                                                <SelectItem key="Vegetable">
                                                    Vegetable
                                                </SelectItem>
                                                <SelectItem key="Fruit">
                                                    Fruit
                                                </SelectItem>
                                                <SelectItem key="Grain">
                                                    Grain
                                                </SelectItem>
                                                <SelectItem key="Poultry">
                                                    Poultry
                                                </SelectItem>
                                                <SelectItem key="Spice">
                                                    Spice
                                                </SelectItem>
                                            </ModalAwareSelect>
                                        </div>
                                        <Input
                                            key="2"
                                            label="Item Short Description"
                                            value={item?.item_description || ""}
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
                                                value={item?.item_sold_by || ""}
                                            />
                                            <ModalAwareSelect
                                                labelPlacement="outside"
                                                label="Item Tag"
                                                className="w-1/2"
                                                selectedKeys={
                                                    item?.item_tag
                                                        ? [item.item_tag]
                                                        : []
                                                }
                                            >
                                                <SelectItem key="Restocked">
                                                    Restocked
                                                </SelectItem>
                                                <SelectItem key="Price Drop">
                                                    Price Drop
                                                </SelectItem>
                                                <SelectItem key="Fresh">
                                                    Fresh
                                                </SelectItem>
                                                <SelectItem key="Discounted">
                                                    Discounted
                                                </SelectItem>
                                            </ModalAwareSelect>
                                        </div>

                                        {/* Variants & prices */}
                                        {item?.item_has_variant === false && (
                                            <>
                                                <div className="flex flex-row gap-2 items-center">
                                                    <NumberInput
                                                        label="Stocks"
                                                        isRequired
                                                        labelPlacement="outside"
                                                        className="w-1/2"
                                                        value={
                                                            item
                                                                ?.item_variants?.[0]
                                                                ?.variant_stocks ||
                                                            undefined
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
                                                        value={
                                                            item
                                                                ?.item_variants?.[0]
                                                                ?.variant_price_retail ||
                                                            undefined
                                                        }
                                                        formatOptions={{
                                                            style: "decimal",
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        }}
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
                                                            item
                                                                ?.item_variants?.[0]
                                                                ?.variant_price_wholesale ||
                                                            undefined
                                                        }
                                                    />
                                                    <NumberInput
                                                        label="Wholesale Min Qty"
                                                        labelPlacement="outside"
                                                        className="w-1/2"
                                                        value={
                                                            item
                                                                ?.item_variants?.[0]
                                                                ?.variant_wholesale_item ||
                                                            undefined
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

                                        {item?.item_has_variant === true && (
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

                                                {item?.item_variants?.map(
                                                    (variant, index) => (
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
                                                                    value={
                                                                        variant.variant_name
                                                                    }
                                                                />
                                                                <NumberInput
                                                                    label="Stocks"
                                                                    isRequired
                                                                    labelPlacement="outside"
                                                                    className="w-1/3"
                                                                    value={
                                                                        variant.variant_stocks
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
                                                                    value={
                                                                        variant.variant_price_retail
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
                                                                        variant.variant_price_wholesale ||
                                                                        undefined
                                                                    }
                                                                />
                                                                <NumberInput
                                                                    label="Wholesale Min Qty"
                                                                    labelPlacement="outside"
                                                                    className="w-1/2"
                                                                    value={
                                                                        variant.variant_wholesale_item ||
                                                                        undefined
                                                                    }
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
                                                                    Remove
                                                                    Variant
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </>
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
                                    {isEdit ? "Save Changes" : "Add Item"}
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
        </>
    );
}
