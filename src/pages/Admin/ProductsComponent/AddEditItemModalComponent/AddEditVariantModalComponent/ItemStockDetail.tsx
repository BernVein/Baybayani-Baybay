import { Input, DatePicker } from "@heroui/react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { VariantDB } from "@/model/db/additem";

export function ItemStockDetail({
    itemUnitOfMeasure,
    variant,
    setVariant,
    isSubmitted,
}: {
    itemUnitOfMeasure: string;
    variant: VariantDB;
    setVariant: React.Dispatch<React.SetStateAction<VariantDB>>;
    isSubmitted: boolean;
}) {
    return (
        <>
            <div className="flex flex-row gap-2 items-center">
                {/* Acquired Stocks */}
                <Input
                    label="Acquired Stocks"
                    isRequired
                    type="text"
                    inputMode="decimal"
                    description="For stock display"
                    className="w-1/2"
                    endContent={
                        <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-small">
                                {itemUnitOfMeasure}
                            </span>
                        </div>
                    }
                    value={
                        variant.stocks !== undefined
                            ? String(variant.stocks)
                            : ""
                    }
                    onValueChange={(v) => {
                        if (v === "") {
                            setVariant({ ...variant, stocks: undefined });
                            return;
                        }

                        const num = Number(v);
                        if (Number.isNaN(num)) return;

                        setVariant({ ...variant, stocks: num });
                    }}
                    isInvalid={
                        isSubmitted &&
                        (variant.stocks == null || variant.stocks <= 0)
                    }
                    errorMessage="Acquired stock is required"
                />

                {/* Date Delivered */}
                <DatePicker
                    className="w-1/2"
                    label="Date Delivered"
                    isRequired
                    defaultValue={today("UTC")}
                    description="Date the stock was acquired"
                    onChange={(v) =>
                        setVariant({
                            ...variant,
                            dateDelivered: v
                                ? v.toDate(getLocalTimeZone()).toISOString()
                                : "",
                        })
                    }
                />
            </div>

            <div className="flex flex-row gap-2 items-center">
                {/* Supplier */}
                <Input
                    label="Supplier"
                    isRequired
                    isClearable
                    description="Stock supplier name"
                    className="w-1/2"
                    value={variant.supplier ?? ""}
                    onValueChange={(v) =>
                        setVariant({ ...variant, supplier: v })
                    }
                    isInvalid={isSubmitted && !variant.supplier?.trim()}
                    errorMessage="Supplier is required"
                />

                {/* Total Buying Price */}
                <Input
                    label="Total Buying Price"
                    isRequired
                    type="text"
                    inputMode="decimal"
                    description="Total ₱ on purchase"
                    className="w-1/2"
                    value={
                        variant.totalBuyingPrice !== undefined
                            ? String(variant.totalBuyingPrice)
                            : ""
                    }
                    onValueChange={(v) => {
                        if (v === "") {
                            setVariant({
                                ...variant,
                                totalBuyingPrice: undefined,
                            });
                            return;
                        }

                        const num = Number(v);
                        if (Number.isNaN(num)) return;

                        setVariant({
                            ...variant,
                            totalBuyingPrice: num,
                        });
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
                        (variant.totalBuyingPrice == null ||
                            variant.totalBuyingPrice <= 0)
                    }
                    errorMessage="Total buying price is required"
                />
            </div>
        </>
    );
}
