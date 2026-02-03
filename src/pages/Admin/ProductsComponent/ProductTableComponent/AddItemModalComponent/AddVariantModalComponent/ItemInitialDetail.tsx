import { Input, SelectItem } from "@heroui/react";
import ModalAwareSelect from "@/lib/ModalAwareSelect";
import { ItemDB } from "@/model/db/additem";

export function ItemInitialDetail({
    item,
    setItem,
    isSubmitted,
}: {
    item: ItemDB;
    setItem: (item: ItemDB) => void;
    isSubmitted: boolean;
}) {
    return (
        <>
            <div className="flex flex-row gap-2 items-center">
                <Input
                    label="Item Name"
                    className="w-1/2"
                    isRequired
                    isClearable
                    description="Enter the name of the item"
                    value={item.name}
                    onValueChange={(value) =>
                        setItem({
                            ...item,
                            name: value,
                        })
                    }
                    isInvalid={isSubmitted && !item.name.trim()}
                    errorMessage="Item Name can't be empty"
                />
                <ModalAwareSelect
                    isRequired
                    label="Item Category"
                    isClearable
                    className="w-1/2"
                    description="Select the category of the item"
                    selectedKeys={item.categoryId ? [item.categoryId] : []}
                    onSelectionChange={(keys) => {
                        const key = Array.from(keys)[0] as string | undefined;
                        setItem({
                            ...item,
                            categoryId: key ?? "",
                        });
                    }}
                    isInvalid={isSubmitted && !item.categoryId}
                    errorMessage="Item Category can't be empty"
                >
                    <SelectItem key="dcee3d7a-fd90-4ab8-a6cf-445a482b79ec">
                        Vegetable
                    </SelectItem>
                    <SelectItem key="2a70992d-d42d-4f84-8da0-a3c67858c9fa">
                        Fruit
                    </SelectItem>
                    <SelectItem key="d57fbbf4-1b78-4d79-9414-f3df92b32174">
                        Grain
                    </SelectItem>
                    <SelectItem key="38322c8d-ec86-45e5-9d04-2a2012259ba9">
                        Poultry
                    </SelectItem>
                    <SelectItem key="257eaa6d-3549-40bc-b2ce-733258b37b0f">
                        Spice
                    </SelectItem>
                </ModalAwareSelect>
            </div>
            <Input
                label="Item Short Description"
                className="w-full"
                type="text"
                isClearable
                description="Enter the optional short description of the item"
                value={item.shortDescription ? item.shortDescription : ""}
                onValueChange={(value) =>
                    setItem({
                        ...item,
                        shortDescription: value,
                    })
                }
            />
            <div className="flex flex-row gap-2 items-center">
                <Input
                    isRequired
                    label="Unit of Measure"
                    className="w-1/2"
                    isClearable
                    description="by kg, lbs, piece, etc."
                    value={item.unitOfMeasure}
                    onValueChange={(value) =>
                        setItem({
                            ...item,
                            unitOfMeasure: value,
                        })
                    }
                    isInvalid={isSubmitted && !item.unitOfMeasure.trim()}
                    errorMessage="Unit of Measure can't be empty"
                />

                <ModalAwareSelect
                    label="Item Tag"
                    isClearable
                    className="w-1/2"
                    description="Select an optional short promotional tag"
                    selectedKeys={item.tagId ? [item.tagId] : []}
                    onSelectionChange={(keys) => {
                        const key = Array.from(keys)[0] as string | undefined;
                        setItem({
                            ...item,
                            tagId: key ?? "",
                        });
                    }}
                >
                    <SelectItem key="f95d0a99-d212-4323-95c6-dedfbdd51079">
                        Restocked
                    </SelectItem>
                    <SelectItem key="a80485a4-a437-4160-bb5e-5b5b520d7ab8">
                        Price Drop
                    </SelectItem>
                    <SelectItem key="975a7cc0-620d-447e-b8eb-626b3da177be">
                        Fresh
                    </SelectItem>
                    <SelectItem key="6ecbbca0-29d6-4dbe-9825-f4b4dd8ae831">
                        Discounted
                    </SelectItem>
                </ModalAwareSelect>
            </div>
        </>
    );
}
