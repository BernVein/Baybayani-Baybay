import { VariantDB } from "@/model/db/additem";
import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    NumberInput,
    Divider,
    DatePicker,
    Input,
    addToast,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { getLocalTimeZone, today } from "@internationalized/date";

export function AddVariantModal({
    itemUnitOfMeasure,
    itemHasVariant,
    isOpenAddVar,
    onOpenChangeAddVar,
    onAddVariant,
}: {
    itemUnitOfMeasure: string;
    itemHasVariant: boolean;
    isOpenAddVar: boolean;
    onOpenChangeAddVar: (open: boolean) => void;
    onAddVariant: (variant: VariantDB) => void;
}) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [variant, setVariant] = useState<VariantDB>({
        name: "",
        stocks: undefined,
        dateDelivered: undefined,
        supplier: "",
        totalBuyingPrice: undefined,
        lowStockThreshold: undefined,
        retailPrice: undefined,
        wholesalePrice: undefined,
        wholesaleMinQty: undefined,
    });

    useEffect(() => {
        if (isOpenAddVar) {
            setVariant({
                name: "",
                stocks: undefined,
                dateDelivered: today("UTC").toString(),
                supplier: "",
                totalBuyingPrice: undefined,
                lowStockThreshold: undefined,
                retailPrice: undefined,
                wholesalePrice: undefined,
                wholesaleMinQty: undefined,
            });
            setIsSubmitted(false);
        }
    }, [isOpenAddVar]);

    function validateVariant(): boolean {
        if (itemHasVariant && !variant.name?.trim()) return false;
        if (variant.stocks == null) return false;
        if (!variant.supplier?.trim()) return false;
        if (variant.totalBuyingPrice == null) return false;
        if (variant.lowStockThreshold == null) return false;
        if (variant.retailPrice == null) return false;

        // wholesaleMinQty is only required if wholesalePrice is set
        if (variant.wholesalePrice != null && variant.wholesaleMinQty == null)
            return false;

        return true;
    }

    return (
        <Modal
            isOpen={isOpenAddVar}
            onOpenChange={onOpenChangeAddVar}
            disableAnimation
            scrollBehavior="inside"
            size="xl"
            isDismissable={false}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <span className="font-semibold">
                                {itemHasVariant
                                    ? "Add Variant"
                                    : "Set Additional Details"}
                            </span>
                        </ModalHeader>
                        <ModalBody>
                            <>
                                {itemHasVariant && (
                                    <div className="flex flex-row gap-2 items-center">
                                        <Input
                                            label="Variant Name"
                                            isRequired
                                            isClearable
                                            description="Enter the variant name"
                                            value={variant.name}
                                            onValueChange={(v) =>
                                                setVariant({
                                                    ...variant,
                                                    name: v,
                                                })
                                            }
                                            isInvalid={
                                                isSubmitted &&
                                                !variant.name?.trim()
                                            }
                                            errorMessage={
                                                isSubmitted &&
                                                !variant.name?.trim()
                                                    ? "Variant name is required"
                                                    : ""
                                            }
                                        />
                                    </div>
                                )}
                                <Divider />
                                <span className="text-lg font-semibold">
                                    Set Item Stock Details
                                </span>
                                <div className="flex flex-row gap-2 items-center">
                                    <NumberInput
                                        label="Stocks"
                                        isRequired
                                        isClearable
                                        description="Enter the acquired stock quantity"
                                        className="w-1/2"
                                        endContent={
                                            <div className="pointer-events-none flex items-center">
                                                <span className="text-default-400 text-small">
                                                    {itemUnitOfMeasure}
                                                </span>
                                            </div>
                                        }
                                        value={variant.stocks}
                                        onValueChange={(v) =>
                                            setVariant({
                                                ...variant,
                                                stocks: v,
                                            })
                                        }
                                        isInvalid={
                                            isSubmitted &&
                                            variant.stocks == null
                                        }
                                        errorMessage={
                                            isSubmitted &&
                                            variant.stocks == null
                                                ? "Stocks is required"
                                                : ""
                                        }
                                    />
                                    <DatePicker
                                        className="w-1/2"
                                        label="Date Delivered"
                                        isRequired
                                        defaultValue={today("UTC")}
                                        description="Enter the date the stock was delivered"
                                        onChange={(v) =>
                                            setVariant({
                                                ...variant,
                                                dateDelivered: v
                                                    ? v
                                                          .toDate(
                                                              getLocalTimeZone(),
                                                          )
                                                          .toISOString()
                                                    : "",
                                            })
                                        }
                                    />
                                </div>

                                <div className="flex flex-row gap-2 items-center">
                                    <Input
                                        label="Supplier"
                                        isRequired
                                        isClearable
                                        description="Enter the supplier name"
                                        className="w-1/2"
                                        value={variant.supplier}
                                        onValueChange={(v) =>
                                            setVariant({
                                                ...variant,
                                                supplier: v,
                                            })
                                        }
                                        isInvalid={
                                            isSubmitted && !variant.supplier
                                        }
                                        errorMessage={
                                            isSubmitted && !variant.supplier
                                                ? "Supplier is required"
                                                : ""
                                        }
                                    />
                                    <NumberInput
                                        label="Total Buying Price"
                                        isRequired
                                        isClearable
                                        description="Enter the total price on purchase"
                                        className="w-1/2"
                                        value={variant.totalBuyingPrice}
                                        onValueChange={(v) =>
                                            setVariant({
                                                ...variant,
                                                totalBuyingPrice: v,
                                            })
                                        }
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
                                        isInvalid={
                                            isSubmitted &&
                                            variant.totalBuyingPrice == null
                                        }
                                        errorMessage={
                                            isSubmitted &&
                                            variant.totalBuyingPrice == null
                                                ? "Total buying price is required"
                                                : ""
                                        }
                                    />
                                </div>
                                <Divider />
                                <span className="text-lg font-semibold">
                                    For low stock notification
                                </span>
                                <div className="flex flex-col gap-2 items-center">
                                    <NumberInput
                                        label="Low Stock Alert Threshold"
                                        isRequired
                                        isClearable
                                        endContent={
                                            <div className="pointer-events-none flex items-center">
                                                <span className="text-default-400 text-small">
                                                    {itemUnitOfMeasure}
                                                </span>
                                            </div>
                                        }
                                        description="Notification will trigger when the stock level reaches this threshold"
                                        value={variant.lowStockThreshold}
                                        onValueChange={(v) =>
                                            setVariant({
                                                ...variant,
                                                lowStockThreshold: v,
                                            })
                                        }
                                        isInvalid={
                                            isSubmitted &&
                                            variant.lowStockThreshold == null
                                        }
                                        errorMessage={
                                            isSubmitted &&
                                            variant.lowStockThreshold == null
                                                ? "Low stock threshold is required"
                                                : ""
                                        }
                                    />
                                </div>
                                <Divider />
                                <span className="text-lg font-semibold">
                                    Set Item Pricing
                                </span>
                                <div className="flex flex-row gap-2 items-center">
                                    <NumberInput
                                        label="Retail Price"
                                        isRequired
                                        isClearable
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
                                        description="Enter the retail price of the item"
                                        value={variant.retailPrice}
                                        onValueChange={(v) =>
                                            setVariant({
                                                ...variant,
                                                retailPrice: v,
                                            })
                                        }
                                        isInvalid={
                                            isSubmitted &&
                                            variant.retailPrice == null
                                        }
                                        errorMessage={
                                            isSubmitted &&
                                            variant.retailPrice == null
                                                ? "Retail price is required"
                                                : ""
                                        }
                                    />
                                    <NumberInput
                                        label="Wholesale Price"
                                        isClearable
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
                                        description="Enter the wholesale price of the item"
                                        value={
                                            variant.wholesalePrice
                                                ? variant.wholesalePrice
                                                : undefined
                                        }
                                        onValueChange={(v) =>
                                            setVariant({
                                                ...variant,
                                                wholesalePrice: v,
                                            })
                                        }
                                    />
                                </div>
                                <Divider />
                                <span className="text-lg font-semibold">
                                    Set Wholesale Minimum Quantity
                                    <p className="text-sm text-default-500 italic">
                                        Applicable only if wholesale price is
                                        set
                                    </p>
                                </span>
                                <div className="flex flex-col gap-2 items-center">
                                    <NumberInput
                                        label="Wholesale Minimum Quantity"
                                        isRequired={
                                            variant.wholesalePrice != null
                                        }
                                        isClearable
                                        isDisabled={!variant.wholesalePrice}
                                        endContent={
                                            <div className="pointer-events-none flex items-center">
                                                <span className="text-default-400 text-small">
                                                    {itemUnitOfMeasure}
                                                </span>
                                            </div>
                                        }
                                        value={
                                            variant.wholesaleMinQty
                                                ? variant.wholesaleMinQty
                                                : undefined
                                        }
                                        onValueChange={(v) =>
                                            setVariant({
                                                ...variant,
                                                wholesaleMinQty: v,
                                            })
                                        }
                                        description="Enter the minimum quantity required for wholesale purchase"
                                        isInvalid={
                                            isSubmitted &&
                                            variant.wholesalePrice != null &&
                                            variant.wholesaleMinQty == null
                                        }
                                        errorMessage={
                                            isSubmitted &&
                                            variant.wholesalePrice != null &&
                                            variant.wholesaleMinQty == null
                                                ? "Wholesale minimum quantity is required"
                                                : ""
                                        }
                                    />
                                </div>
                            </>
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
                                    setIsSubmitted(true);
                                    if (validateVariant()) {
                                        onAddVariant(variant);
                                        onClose();
                                        setIsSubmitted(false);
                                    } else {
                                        addToast({
                                            title: "Empty Required Fields.",
                                            description:
                                                "Please fill in all required fields.",
                                            timeout: 3000,
                                            color: "danger",
                                            shouldShowTimeoutProgress: true,
                                        });
                                    }
                                }}
                            >
                                Add Variant
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
