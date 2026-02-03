import { PencilIcon, TrashIcon } from "@/components/icons";
import { ItemDB } from "@/model/db/additem";
import { Card, CardHeader, CardBody, Divider, Button } from "@heroui/react";

export function VariantList({
    itemHasVariant,
    item,
    setItem,
}: {
    itemHasVariant: boolean;
    item: ItemDB;
    setItem: React.Dispatch<React.SetStateAction<ItemDB>>;
}) {
    return (
        <>
            {item.variants.length === 0 && itemHasVariant ? (
                <p className="text-sm text-default-400 italic text-center py-4">
                    No variants added yet.
                </p>
            ) : (
                item.variants.map((v, index) => (
                    <Card key={index} className="shadow-sm">
                        <CardHeader className="flex flex-row justify-between items-start">
                            <div className="flex flex-col">
                                <h4 className="text-large font-bold">
                                    {itemHasVariant ? (
                                        <>
                                            {v.name || "Default Variant"}
                                            <p className="text-tiny text-default-400">
                                                Variant {index + 1}
                                            </p>
                                        </>
                                    ) : (
                                        <>Item Additional Info</>
                                    )}
                                </h4>
                            </div>
                            <div className="ml-auto flex flex-row gap-2">
                                <Button
                                    isIconOnly
                                    className="ml-auto"
                                    size="sm"
                                    onPress={() => {
                                        setItem((prev) => ({
                                            ...prev,
                                            variants: prev.variants.filter(
                                                (_, i) => i !== index,
                                            ),
                                        }));
                                    }}
                                    startContent={
                                        <PencilIcon className="w-5" />
                                    }
                                />
                                <Button
                                    isIconOnly
                                    color="danger"
                                    className="ml-auto"
                                    size="sm"
                                    startContent={<TrashIcon className="w-5" />}
                                />
                            </div>
                        </CardHeader>
                        <Divider />
                        <CardBody className="py-2 text-sm grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                            <div className="flex justify-between">
                                <span className="text-default-500">
                                    Stocks:
                                </span>
                                <span className="font-medium">
                                    {v.stocks != null
                                        ? v.stocks.toLocaleString()
                                        : "0"}{" "}
                                    {item.unitOfMeasure}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-default-500">
                                    Date Delivered:
                                </span>
                                <span className="font-medium">
                                    {v.dateDelivered
                                        ? new Date(
                                              v.dateDelivered,
                                          ).toLocaleDateString("en-US", {
                                              month: "short",
                                              day: "2-digit",
                                              year: "numeric",
                                          })
                                        : "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-default-500">
                                    Total Buying Price:
                                </span>
                                <span className="font-medium">
                                    {v.totalBuyingPrice != null
                                        ? `₱${v.totalBuyingPrice.toLocaleString(
                                              "en-PH",
                                              {
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2,
                                              },
                                          )}`
                                        : "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-default-500">
                                    Retail Price:
                                </span>
                                <span className="font-medium">
                                    {v.retailPrice != null
                                        ? `₱${v.retailPrice.toLocaleString(
                                              "en-PH",
                                              {
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2,
                                              },
                                          )}`
                                        : "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-default-500">
                                    Low Stock Alert:
                                </span>
                                <span className="font-medium">
                                    {v.lowStockThreshold?.toLocaleString()}{" "}
                                    {item.unitOfMeasure}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-default-500">
                                    Wholesale Price:
                                </span>

                                {v.wholesalePrice != null &&
                                v.wholesalePrice > 0 ? (
                                    <span className="font-medium">
                                        ₱
                                        {v.wholesalePrice.toLocaleString(
                                            "en-PH",
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            },
                                        )}
                                    </span>
                                ) : (
                                    <span className="text-xs italic text-default-400">
                                        N/A
                                    </span>
                                )}
                            </div>

                            <div className="flex justify-between">
                                <span className="text-default-500">
                                    Supplier:
                                </span>
                                <span className="font-medium truncate ml-2">
                                    {v.supplier}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-default-500">
                                    Wholesale Min Qty:
                                </span>

                                {v.wholesaleMinQty != null &&
                                v.wholesaleMinQty > 0 ? (
                                    <span className="font-medium truncate ml-2">
                                        {v.wholesaleMinQty.toLocaleString()}{" "}
                                        {item.unitOfMeasure}
                                    </span>
                                ) : (
                                    <span className="text-xs italic text-default-400 ml-2">
                                        N/A
                                    </span>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                ))
            )}
        </>
    );
}
