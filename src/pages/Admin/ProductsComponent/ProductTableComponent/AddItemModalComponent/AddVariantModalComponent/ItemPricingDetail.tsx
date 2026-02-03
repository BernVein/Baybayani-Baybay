import { Input } from "@heroui/react";
import { VariantDB } from "@/model/db/additem";

export function ItemPricingDetail({
    variant,
    setVariant,
    isSubmitted,
}: {
    variant: VariantDB;
    setVariant: React.Dispatch<React.SetStateAction<VariantDB>>;
    isSubmitted: boolean;
}) {
    return (
        <>
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
                            retailPrice: Math.max(Number(v), 1),
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
        </>
    );
}
