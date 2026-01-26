import { NumberInput } from "@heroui/react";
import { DBVariant } from "@/pages/Admin/ProductsComponent/AddItemModal";

export function ItemHasNoVariant({
    tempVariant,
    setTempVariant,
    isSubmitted,
}: {
    tempVariant: DBVariant;
    setTempVariant: React.Dispatch<React.SetStateAction<DBVariant>>;
    isSubmitted: boolean;
}) {
    return (
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
                    isInvalid={
                        (isSubmitted && tempVariant.stocks === 0) ||
                        tempVariant.stocks === undefined
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
                    isInvalid={
                        isSubmitted &&
                        (tempVariant.priceRetail === undefined ||
                            tempVariant.priceRetail === null)
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
                    value={tempVariant.priceWholesale ?? undefined}
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
                    value={tempVariant.wholesaleMinQty ?? undefined}
                    onValueChange={(value) =>
                        setTempVariant((prev) => ({
                            ...prev,
                            wholesaleMinQty: value,
                        }))
                    }
                />
            </div>
        </>
    );
}
