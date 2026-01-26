import { TrashIcon, PlusIcon } from "@/components/icons";
import { Button, NumberInput, Divider, Input } from "@heroui/react";
import { DBVariant } from "@/pages/Admin/ProductsComponent/AddItemModal";

export function ItemHasVariant({
    variants,
    updateVariant,
    removeVariant,
    onOpenAddVar,
    isSubmitted,
}: {
    variants: DBVariant[];
    updateVariant: <K extends keyof DBVariant>(
        index: number,
        key: K,
        value: DBVariant[K],
    ) => void;
    removeVariant: (index: number) => void;
    onOpenAddVar: () => void;
    isSubmitted: boolean;
}) {
    return (
        <>
            <Divider />
            <div className="flex flex-row justify-between">
                <span className="text-lg font-semibold">Item Variants</span>
                <Button
                    startContent={<PlusIcon className="w-5" />}
                    onPress={onOpenAddVar}
                >
                    Add Variant
                </Button>
            </div>

            {variants.map((variant, index) => (
                <div key={index} className="space-y-2">
                    <div className="flex flex-row gap-2 items-center">
                        <Input
                            label="Variant Name"
                            isRequired
                            labelPlacement="outside"
                            className="w-1/3"
                            value={variant.name}
                            onValueChange={(v) =>
                                updateVariant(index, "name", v)
                            }
                            isInvalid={isSubmitted && !variant.name.trim()}
                        />

                        <NumberInput
                            label="Stocks"
                            isRequired
                            labelPlacement="outside"
                            className="w-1/3"
                            value={variant.stocks}
                            onValueChange={(v) =>
                                updateVariant(index, "stocks", v)
                            }
                            isInvalid={
                                isSubmitted &&
                                (variant.stocks === 0 ||
                                    variant.stocks === undefined)
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
                            value={variant.priceRetail}
                            onValueChange={(v) =>
                                updateVariant(index, "priceRetail", v)
                            }
                            isInvalid={
                                isSubmitted &&
                                (variant.priceRetail === undefined ||
                                    variant.priceRetail === null)
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
                            value={variant.priceWholesale ?? undefined}
                            onValueChange={(v) =>
                                updateVariant(index, "priceWholesale", v)
                            }
                        />

                        <NumberInput
                            label="Wholesale Min Qty"
                            labelPlacement="outside"
                            className="w-1/2"
                            value={variant.wholesaleMinQty ?? undefined}
                            onValueChange={(v) =>
                                updateVariant(index, "wholesaleMinQty", v)
                            }
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button
                            startContent={<TrashIcon className="w-5" />}
                            color="danger"
                            className="mt-2"
                            onPress={() => removeVariant(index)}
                        >
                            Remove Variant
                        </Button>
                    </div>
                </div>
            ))}
        </>
    );
}
