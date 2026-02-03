import { ItemDB } from "@/model/db/additem";
import { Card, CardHeader, CardBody, Divider, Button } from "@heroui/react";

export function VariantList({
    item,
    setItem,
}: {
    item: ItemDB;
    setItem: React.Dispatch<React.SetStateAction<ItemDB>>;
}) {
    return (
        <>
            {item.variants.length === 0 ? (
                <p className="text-sm text-default-400 italic text-center py-4">
                    No variants added yet.
                </p>
            ) : (
                item.variants.map((v, index) => (
                    <Card key={index} className="shadow-sm">
                        <CardHeader className="flex flex-row justify-between items-start">
                            <div className="flex flex-col">
                                <h4 className="text-large font-bold">
                                    {v.name || "Default Variant"}
                                </h4>
                                <p className="text-tiny text-default-400">
                                    Variant {index + 1}
                                </p>
                            </div>
                            <Button
                                isIconOnly
                                color="danger"
                                variant="light"
                                size="sm"
                                onPress={() => {
                                    setItem((prev) => ({
                                        ...prev,
                                        variants: prev.variants.filter(
                                            (_, i) => i !== index,
                                        ),
                                    }));
                                }}
                            >
                                ✕
                            </Button>
                        </CardHeader>
                        <Divider />
                        <CardBody className="py-2 text-sm grid grid-cols-2 gap-x-4 gap-y-1">
                            <div className="flex justify-between">
                                <span className="text-default-500">
                                    Stocks:
                                </span>
                                <span className="font-medium">
                                    {v.stocks} {item.unitOfMeasure}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-default-500">
                                    Retail Price:
                                </span>
                                <span className="font-medium">
                                    ₱{v.retailPrice?.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-default-500">
                                    Low Stock Alert:
                                </span>
                                <span className="font-medium">
                                    {v.lowStockThreshold}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-default-500">
                                    Wholesale Price:
                                </span>
                                <span className="font-medium">
                                    {v.wholesalePrice
                                        ? `₱${v.wholesalePrice.toLocaleString()}`
                                        : "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between col-span-2">
                                <span className="text-default-500">
                                    Supplier:
                                </span>
                                <span className="font-medium truncate ml-2">
                                    {v.supplier}
                                </span>
                            </div>
                        </CardBody>
                    </Card>
                ))
            )}
        </>
    );
}
