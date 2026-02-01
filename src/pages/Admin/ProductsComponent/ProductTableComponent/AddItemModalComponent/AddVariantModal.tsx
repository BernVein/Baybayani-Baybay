import { VariantDB } from "@/model/db/additem";
import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
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
        setIsSubmitted(false);
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
    }, [isOpenAddVar]);

    function validateVariant(): boolean {
        if (itemHasVariant && !variant.name?.trim()) return false;
        if (variant.stocks == null || variant.stocks == 0) return false;
        if (!variant.supplier?.trim()) return false;
        if (variant.totalBuyingPrice == null || variant.totalBuyingPrice == 0)
            return false;
        if (variant.lowStockThreshold == null || variant.lowStockThreshold == 0)
            return false;
        if (variant.retailPrice == null || variant.retailPrice == 0)
            return false;

        // wholesaleMinQty is only required if wholesalePrice is set
        if (
            variant.wholesalePrice &&
            (variant.wholesaleMinQty == null || variant.wholesaleMinQty == 0)
        )
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
                                            errorMessage="Variant name is required."
                                        />
                                    </div>
                                )}
                                <Divider />
                                <span className="text-lg font-semibold">
                                    Set Item Stock Details
                                </span>
                                <div className="flex flex-row gap-2 items-center">
                                    <Input
                                        label="Acquired Stocks"
                                        isRequired
                                        type="number"
                                        description="Enter the acquired stock quantity"
                                        className="w-1/2"
                                        endContent={
                                            <div className="pointer-events-none flex items-center">
                                                <span className="text-default-400 text-small">
                                                    {itemUnitOfMeasure}
                                                </span>
                                            </div>
                                        }
                                        value={variant.stocks?.toString()}
                                        onValueChange={(v) =>
                                            setVariant({
                                                ...variant,
                                                stocks: Math.max(Number(v), 1),
                                            })
                                        }
                                        isInvalid={
                                            isSubmitted &&
                                            (variant.stocks == null ||
                                                variant.stocks == 0)
                                        }
                                        errorMessage="Acquired stock is required"
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
                                            isSubmitted &&
                                            !variant.supplier?.trim()
                                        }
                                        errorMessage="Supplier is required"
                                    />
                                    <Input
                                        label="Total Buying Price"
                                        type="number"
                                        isRequired
                                        description="Enter the total price on purchase"
                                        className="w-1/2"
                                        value={variant.totalBuyingPrice?.toString()}
                                        onValueChange={(v) =>
                                            setVariant({
                                                ...variant,
                                                totalBuyingPrice: Math.max(
                                                    Number(v),
                                                    1,
                                                ),
                                            })
                                        }
                                        startContent={
                                            <div className="pointer-events-none flex items-center">
                                                <span className="text-default-400 text-small">
                                                    ₱
                                                </span>
                                            </div>
                                        }
                                        isInvalid={
                                            isSubmitted &&
                                            (variant.totalBuyingPrice == null ||
                                                variant.totalBuyingPrice == 0)
                                        }
                                        errorMessage="Total buying price is required"
                                    />
                                </div>
                                <Divider />
                                <span className="text-lg font-semibold">
                                    For low stock notification
                                </span>
                                <div className="flex flex-col gap-2 items-center">
                                    <Input
                                        label="Low Stock Alert Threshold"
                                        isRequired
                                        type="number"
                                        endContent={
                                            <div className="pointer-events-none flex items-center">
                                                <span className="text-default-400 text-small">
                                                    {itemUnitOfMeasure}
                                                </span>
                                            </div>
                                        }
                                        description="Notification will trigger when the stock level reaches this threshold"
                                        value={variant.lowStockThreshold?.toString()}
                                        onValueChange={(v) =>
                                            setVariant({
                                                ...variant,
                                                lowStockThreshold: Math.max(
                                                    Number(v),
                                                    1,
                                                ),
                                            })
                                        }
                                        isInvalid={
                                            isSubmitted &&
                                            (variant.lowStockThreshold ==
                                                null ||
                                                variant.lowStockThreshold == 0)
                                        }
                                        errorMessage="Low stock threshold is required"
                                    />
                                </div>
                                <Divider />
                                <span className="text-lg font-semibold">
                                    Set Item Pricing
                                </span>
                                <div className="flex flex-row gap-2 items-center">
                                    <Input
                                        label="Retail Price"
                                        type="number"
                                        isRequired
                                        className="w-1/2"
                                        startContent={
                                            <div className="pointer-events-none flex items-center">
                                                <span className="text-default-400 text-small">
                                                    ₱
                                                </span>
                                            </div>
                                        }
                                        description="Enter the retail price of the item"
                                        value={variant.retailPrice?.toString()}
                                        onValueChange={(v) =>
                                            setVariant({
                                                ...variant,
                                                retailPrice: Math.max(
                                                    Number(v),
                                                    1,
                                                ),
                                            })
                                        }
                                        isInvalid={
                                            isSubmitted &&
                                            (variant.retailPrice == null ||
                                                variant.retailPrice == 0)
                                        }
                                        errorMessage="Retail price is required"
                                    />
                                    <Input
                                        label="Wholesale Price"
                                        type="number"
                                        className="w-1/2"
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
                                                ? variant.wholesalePrice.toString()
                                                : undefined
                                        }
                                        onValueChange={(v) =>
                                            setVariant({
                                                ...variant,
                                                wholesalePrice: Number(v),
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
                                    <Input
                                        label="Wholesale Minimum Quantity"
                                        isRequired={!!variant.wholesalePrice}
                                        type="number"
                                        isInvalid={
                                            isSubmitted &&
                                            (variant.wholesaleMinQty == null ||
                                                variant.wholesaleMinQty ===
                                                    0) &&
                                            variant.wholesalePrice != null
                                        }
                                        errorMessage="Wholesale minimum quantity is required."
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
                                                ? variant.wholesaleMinQty.toString()
                                                : undefined
                                        }
                                        onValueChange={(v) =>
                                            setVariant({
                                                ...variant,
                                                wholesaleMinQty: Math.max(
                                                    Number(v),
                                                    1,
                                                ),
                                            })
                                        }
                                        description="Enter the minimum quantity required for wholesale purchase"
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
