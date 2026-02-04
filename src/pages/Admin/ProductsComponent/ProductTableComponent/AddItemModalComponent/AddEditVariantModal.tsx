import { VariantDB } from "@/model/db/additem";
import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Divider,
    Input,
    addToast,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { today } from "@internationalized/date";
import { ItemStockDetail } from "@/pages/Admin/ProductsComponent/ProductTableComponent/AddItemModalComponent/AddVariantModalComponent/ItemStockDetail";
import { ItemPricingDetail } from "@/pages/Admin/ProductsComponent/ProductTableComponent/AddItemModalComponent/AddVariantModalComponent/ItemPricingDetail";

export function AddEditVariantModal({
    itemUnitOfMeasure,
    itemHasVariant,
    isOpenAddVar,
    onOpenChangeAddVar,
    onAddEditVariant,
    defaultVariant,
}: {
    itemUnitOfMeasure: string;
    itemHasVariant: boolean;
    isOpenAddVar: boolean;
    onOpenChangeAddVar: (open: boolean) => void;
    onAddEditVariant: (variant: VariantDB) => void;
    defaultVariant?: VariantDB | null;
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
            name: defaultVariant?.name ?? "",
            stocks: defaultVariant?.stocks,
            dateDelivered:
                defaultVariant?.dateDelivered ?? today("UTC").toString(),
            supplier: defaultVariant?.supplier ?? "",
            totalBuyingPrice: defaultVariant?.totalBuyingPrice,
            lowStockThreshold: defaultVariant?.lowStockThreshold,
            retailPrice: defaultVariant?.retailPrice,
            wholesalePrice: defaultVariant?.wholesalePrice,
            wholesaleMinQty: defaultVariant?.wholesaleMinQty,
        });
    }, [isOpenAddVar, defaultVariant]);

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
                                            description="For variant name display"
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
                                <ItemStockDetail
                                    variant={variant}
                                    setVariant={setVariant}
                                    isSubmitted={isSubmitted}
                                    itemUnitOfMeasure={itemUnitOfMeasure}
                                />
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
                                <ItemPricingDetail
                                    variant={variant}
                                    setVariant={setVariant}
                                    isSubmitted={isSubmitted}
                                />
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
                        <ModalFooter className="justify-between items-center">
                            <span className="text-sm text-default-500 italic">
                                <span className="text-red-500">*</span> Required
                                field
                            </span>
                            <div className="flex gap-2">
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
                                            onAddEditVariant(variant);
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
                                    {itemHasVariant && !defaultVariant
                                        ? "Add Variant"
                                        : defaultVariant
                                          ? "Update Details"
                                          : "Save Details"}
                                </Button>
                            </div>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
