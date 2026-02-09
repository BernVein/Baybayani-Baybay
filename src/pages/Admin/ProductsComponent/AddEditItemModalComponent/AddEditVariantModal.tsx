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

import { ItemStockDetail } from "@/pages/Admin/ProductsComponent/AddEditItemModalComponent/AddEditVariantModalComponent/ItemStockDetail";
import { ItemPricingDetail } from "@/pages/Admin/ProductsComponent/AddEditItemModalComponent/AddEditVariantModalComponent/ItemPricingDetail";
import { Variant } from "@/model/variant";
import { StockMovement } from "@/model/stockMovement";

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
    onAddEditVariant: (variant: Variant) => void;
    defaultVariant?: Variant | null;
}) {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const defaultStockMovement: StockMovement = {
        stock_adjustment_amount: undefined,
        stock_adjustment_type: "Acquisition",
        stock_supplier: "",
        stock_delivery_date: today("UTC").toString(),
        effective_stocks: undefined,
        last_updated: today("UTC").toString(),
        is_soft_deleted: false,
        created_at: today("UTC").toString(),
    };

    const [variant, setVariant] = useState<Variant>({
        variant_name: "",
        variant_stock_latest_movement: defaultStockMovement,
        variant_low_stock_threshold: undefined,
        variant_price_retail: undefined,
        variant_price_wholesale: undefined,
        variant_wholesale_item: undefined,
    });

    useEffect(() => {
        setIsSubmitted(false);
        if (defaultVariant) {
            setVariant(defaultVariant);
        } else {
            setVariant({
                variant_name: "",
                variant_stock_latest_movement: defaultStockMovement,
                variant_low_stock_threshold: undefined,
                variant_price_retail: undefined,
                variant_price_wholesale: undefined,
                variant_wholesale_item: undefined,
            });
        }
    }, [isOpenAddVar, defaultVariant]);

    useEffect(() => {
        if (
            variant.variant_price_wholesale == null &&
            variant.variant_wholesale_item != null
        ) {
            setVariant((prev) => ({
                ...prev,
                variant_wholesale_item: undefined,
            }));
        }
    }, [
        variant.variant_price_wholesale,
        variant.variant_wholesale_item,
        setVariant,
    ]);

    function validateVariant(): boolean {
        if (itemHasVariant && !variant.variant_name?.trim()) return false;
        if (
            variant.variant_stock_latest_movement?.effective_stocks == null ||
            variant.variant_stock_latest_movement?.effective_stocks == 0
        )
            return false;
        if (!variant.variant_stock_latest_movement?.stock_supplier?.trim())
            return false;
        if (
            variant.variant_stock_latest_movement?.stock_adjustment_amount ==
                null ||
            variant.variant_stock_latest_movement?.stock_adjustment_amount == 0
        )
            return false;
        if (
            variant.variant_low_stock_threshold == null ||
            variant.variant_low_stock_threshold == 0
        )
            return false;
        if (
            variant.variant_price_retail == null ||
            variant.variant_price_retail == 0
        )
            return false;

        // wholesaleMinQty is only required if wholesalePrice is set
        if (
            variant.variant_price_wholesale &&
            (variant.variant_wholesale_item == null ||
                variant.variant_wholesale_item == 0)
        )
            return false;

        return true;
    }

    return (
        <Modal
            disableAnimation
            isDismissable={false}
            isOpen={isOpenAddVar}
            scrollBehavior="inside"
            size="xl"
            onOpenChange={onOpenChangeAddVar}
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
                                            isClearable
                                            isRequired
                                            description="For variant name display"
                                            errorMessage="Variant name is required."
                                            isInvalid={
                                                isSubmitted &&
                                                !variant.variant_name?.trim()
                                            }
                                            label="Variant Name"
                                            value={variant.variant_name}
                                            onValueChange={(v) =>
                                                setVariant({
                                                    ...variant,
                                                    variant_name: v,
                                                })
                                            }
                                        />
                                    </div>
                                )}
                                <Divider />
                                <span className="text-lg font-semibold">
                                    Set Item Stock Details
                                </span>
                                <ItemStockDetail
                                    isSubmitted={isSubmitted}
                                    itemUnitOfMeasure={itemUnitOfMeasure}
                                    setVariant={setVariant}
                                    variant={variant}
                                />
                                <Divider />
                                <span className="text-lg font-semibold">
                                    For low stock notification
                                </span>
                                <div className="flex flex-col gap-2 items-center">
                                    <Input
                                        isRequired
                                        description="Notification will trigger when the stock level reaches this threshold"
                                        endContent={
                                            <div className="pointer-events-none flex items-center">
                                                <span className="text-default-400 text-small">
                                                    {itemUnitOfMeasure}
                                                </span>
                                            </div>
                                        }
                                        errorMessage="Low stock threshold is required"
                                        inputMode="decimal"
                                        isInvalid={
                                            isSubmitted &&
                                            (variant.variant_low_stock_threshold ==
                                                null ||
                                                variant.variant_low_stock_threshold <=
                                                    0)
                                        }
                                        label="Low Stock Alert Threshold"
                                        type="text"
                                        value={
                                            variant.variant_low_stock_threshold !==
                                            undefined
                                                ? String(
                                                      variant.variant_low_stock_threshold,
                                                  )
                                                : ""
                                        }
                                        onValueChange={(v) => {
                                            if (v === "") {
                                                setVariant({
                                                    ...variant,
                                                    variant_low_stock_threshold:
                                                        undefined,
                                                });

                                                return;
                                            }

                                            const num = Number(v);

                                            if (Number.isNaN(num)) return;

                                            setVariant({
                                                ...variant,
                                                variant_low_stock_threshold:
                                                    num,
                                            });
                                        }}
                                    />
                                </div>
                                <Divider />
                                <span className="text-lg font-semibold">
                                    Set Item Pricing
                                </span>
                                <ItemPricingDetail
                                    isSubmitted={isSubmitted}
                                    setVariant={setVariant}
                                    variant={variant}
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
                                        description="Enter the minimum quantity required for wholesale purchase"
                                        errorMessage="Wholesale minimum quantity is required."
                                        inputMode="decimal"
                                        isDisabled={
                                            !variant.variant_price_wholesale
                                        }
                                        isInvalid={
                                            isSubmitted &&
                                            variant.variant_price_wholesale !=
                                                null &&
                                            (variant.variant_wholesale_item ==
                                                null ||
                                                variant.variant_wholesale_item <=
                                                    0)
                                        }
                                        isRequired={
                                            !!variant.variant_price_wholesale
                                        }
                                        label="Wholesale Minimum Quantity"
                                        type="text"
                                        value={
                                            variant.variant_price_wholesale ==
                                            null
                                                ? ""
                                                : (variant.variant_wholesale_item?.toString() ??
                                                  "")
                                        }
                                        onValueChange={(v) => {
                                            if (v === "") {
                                                setVariant((prev) => ({
                                                    ...prev,
                                                    variant_wholesale_item:
                                                        undefined,
                                                }));

                                                return;
                                            }

                                            const num = Number(v);

                                            if (Number.isNaN(num)) return;

                                            setVariant((prev) => ({
                                                ...prev,
                                                variant_wholesale_item: num,
                                            }));
                                        }}
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
