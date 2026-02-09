import {
    Button,
    Divider,
    NumberInput,
    RadioGroup,
    Radio,
    cn,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@heroui/react";

import { Item } from "@/model/Item";
import { Variant } from "@/model/variant";

export const CustomRadio = (props: any) => {
    const { children, ...otherProps } = props;

    return (
        <Radio
            {...otherProps}
            classNames={{
                base: cn(
                    "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
                    "flex-row-reverse max-w-full cursor-pointer rounded-lg gap-4 p-2 border-2 border-transparent",
                    "data-[selected=true]:border-success",
                ),
            }}
        >
            {children}
        </Radio>
    );
};
export default function InformationSection({
    item,
    selectedItemVariant,
    setSelectedItemVariant,
    quantity,
    setQuantity,
}: {
    item: Item;
    selectedItemVariant: Variant | null;
    setSelectedItemVariant: (variant: Variant) => void;
    quantity: number;
    setQuantity: (quantity: number) => void;
}) {
    const canShowWholesale =
        selectedItemVariant?.variant_price_wholesale != null &&
        selectedItemVariant?.variant_wholesale_item != null &&
        selectedItemVariant?.variant_stock_latest_movement.effective_stocks !=
            null &&
        selectedItemVariant.variant_wholesale_item <=
            selectedItemVariant.variant_stock_latest_movement.effective_stocks;

    return (
        <>
            {item.item_description ? (
                <p className="text-sm">{item.item_description}</p>
            ) : (
                <p className="text-sm text-default-500 italic">
                    No description available
                </p>
            )}
            <Divider />

            {item.item_has_variant && (
                <>
                    <Popover showArrow>
                        <PopoverTrigger>
                            <div className="cursor-pointer active:opacity-70 transition-all duration-200 ease-in-out">
                                <RadioGroup
                                    isDisabled
                                    color="success"
                                    label="Product Variants"
                                    size="sm"
                                    value={selectedItemVariant?.variant_id}
                                    onValueChange={(value) => {
                                        const foundVariant =
                                            item.item_variants.find(
                                                (variant) =>
                                                    variant.variant_id ===
                                                    value,
                                            );

                                        if (foundVariant) {
                                            setSelectedItemVariant(
                                                foundVariant,
                                            );
                                        }
                                    }}
                                >
                                    {item.item_variants.map(
                                        (variant, index) => (
                                            <CustomRadio
                                                key={index}
                                                description={`Stocks remaining: ${(variant.variant_stock_latest_movement?.effective_stocks ?? 0).toLocaleString()} ${
                                                    (variant
                                                        .variant_stock_latest_movement
                                                        ?.effective_stocks ??
                                                        0) > 1
                                                        ? `${item.item_sold_by}s`
                                                        : item.item_sold_by
                                                }`}
                                                value={variant.variant_id}
                                            >
                                                {variant.variant_name}
                                            </CustomRadio>
                                        ),
                                    )}
                                </RadioGroup>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className="px-1 py-2">
                                <div className="text-small font-bold">
                                    You've selected{" "}
                                    {selectedItemVariant?.variant_name}
                                </div>
                                <div>You can only edit the quantity</div>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <Divider />
                </>
            )}
            {/* Product Info Section */}
            <div className="flex flex-col gap-3">
                <div className="flex flex-col items-start gap-2">
                    <span className="text-sm text-default-700">
                        {selectedItemVariant?.variant_name} Information:
                    </span>
                </div>

                {/* Current Retail Price */}
                <div className="gap-2 flex flex-row justify-between">
                    <span className="text-base text-default-500">
                        Retail Price:
                    </span>
                    <span className="text-base text-default-700 font-bold">
                        ₱
                        {selectedItemVariant?.variant_price_retail?.toFixed(
                            2,
                        ) ?? "0.00"}{" "}
                        per {item.item_sold_by}
                    </span>
                </div>
                <div className="gap-2 flex flex-row justify-between">
                    <span className="text-base text-default-500 w-1/2">
                        Wholesale Price:
                    </span>

                    {selectedItemVariant?.variant_price_wholesale != null ? (
                        <span className="text-base text-default-700 font-bold">
                            ₱
                            {selectedItemVariant.variant_price_wholesale.toLocaleString(
                                "en-PH",
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                },
                            )}{" "}
                            per {item.item_sold_by}
                        </span>
                    ) : (
                        <span className="text-default-400 w-1/2 text-sm italic">
                            Not available
                        </span>
                    )}
                </div>

                {/* Retail info */}
                <div className="gap-2 flex flex-row justify-between">
                    <span className="text-xs text-default-400">
                        Last Price Retail:
                    </span>
                    <span className="text-xs text-default-500">
                        {selectedItemVariant?.variant_last_updated_price_retail ? (
                            <>
                                ₱
                                {selectedItemVariant.variant_last_price_retail?.toFixed(
                                    2,
                                )}{" "}
                                (
                                {(() => {
                                    const updatedAt =
                                        selectedItemVariant.variant_last_updated_price_retail;
                                    const now = new Date();
                                    const updatedDate = new Date(updatedAt);
                                    const diffTime =
                                        now.getTime() - updatedDate.getTime();
                                    const diffDays = Math.floor(
                                        diffTime / (1000 * 60 * 60 * 24),
                                    );

                                    if (diffDays === 0) return "Today";
                                    if (diffDays === 1) return "1 day ago";

                                    return `${diffDays} days ago`;
                                })()}
                                )
                            </>
                        ) : (
                            <span className="italic text-default-400">
                                No change
                            </span>
                        )}
                    </span>
                </div>

                {/* Wholesale info */}
                <div className="gap-2 flex flex-row justify-between">
                    <span className="text-xs text-default-400">
                        Last Price Wholesale:
                    </span>
                    <span className="text-xs text-default-500">
                        {selectedItemVariant?.variant_last_updated_price_wholesale ? (
                            <>
                                ₱
                                {selectedItemVariant.variant_last_price_wholesale?.toFixed(
                                    2,
                                )}{" "}
                                (
                                {(() => {
                                    const updatedAt =
                                        selectedItemVariant.variant_last_updated_price_wholesale;
                                    const now = new Date();
                                    const updatedDate = new Date(updatedAt);
                                    const diffTime =
                                        now.getTime() - updatedDate.getTime();
                                    const diffDays = Math.floor(
                                        diffTime / (1000 * 60 * 60 * 24),
                                    );

                                    if (diffDays === 0) return "Today";
                                    if (diffDays === 1) return "1 day ago";

                                    return `${diffDays} days ago`;
                                })()}
                                )
                            </>
                        ) : (
                            <span className="italic text-default-400">
                                No change
                            </span>
                        )}
                    </span>
                </div>

                {/* Stocks info */}
                <div className="gap-2 flex flex-row justify-between">
                    <span className="text-xs text-default-400">Stocks:</span>
                    <span className="text-xs text-default-500">
                        {selectedItemVariant?.variant_stock_latest_movement
                            ?.effective_stocks ?? 0}{" "}
                        {item.item_sold_by}
                        {(selectedItemVariant?.variant_stock_latest_movement
                            ?.effective_stocks ?? 0) > 1 && "s"}{" "}
                        left
                    </span>
                </div>
            </div>

            <Divider />

            {/* Quantity Section */}
            <div className="flex flex-col gap-2 items-start">
                {canShowWholesale && (
                    <div>
                        <span className="text-xs text-default-400">
                            A minimum purchase of{" "}
                        </span>

                        {quantity >=
                        (selectedItemVariant?.variant_wholesale_item ?? 0) ? (
                            <span className="text-sm font-semibold text-success-500 transition-colors duration-300">
                                {selectedItemVariant?.variant_wholesale_item ??
                                    0}{" "}
                                {item.item_sold_by}s
                            </span>
                        ) : (
                            <span className="text-sm font-semibold transition-colors duration-300">
                                {selectedItemVariant?.variant_wholesale_item ??
                                    0}{" "}
                                {item.item_sold_by}s
                            </span>
                        )}

                        <span className="text-xs text-default-400">
                            {" "}
                            is needed to avail the wholesale price of{" "}
                        </span>

                        <span className="text-sm font-semibold">
                            ₱
                            {selectedItemVariant?.variant_price_wholesale?.toLocaleString(
                                "en-PH",
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                },
                            ) ?? "0.00"}
                        </span>
                    </div>
                )}
                <div className="flex flex-row items-center gap-2 mb-4">
                    <NumberInput
                        className="w-3/4"
                        labelPlacement="outside"
                        maxValue={
                            selectedItemVariant?.variant_stock_latest_movement
                                ?.effective_stocks ?? 0
                        }
                        minValue={1}
                        placeholder="Enter quantity"
                        radius="sm"
                        step={0.25}
                        value={quantity}
                        variant="faded"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                setTimeout(() => {
                                    (
                                        e.currentTarget as HTMLInputElement
                                    ).blur();
                                    window.scrollTo(0, 0);
                                }, 150);
                            }
                        }}
                        onValueChange={(val) => {
                            if (Number.isNaN(val)) return;
                            setQuantity(Math.max(1, val));
                        }}
                    />
                    <Button
                        color="success"
                        onPress={() => {
                            setQuantity(quantity);
                        }}
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        </>
    );
}
