import { Input, SelectItem, Spinner } from "@heroui/react";
import ModalAwareSelect from "@/lib/ModalAwareSelect";
import { ItemDB } from "@/model/db/additem";
import { useFetchCategories } from "@/data/supabase/useFetchCategories";
import { useFetchTags } from "@/data/supabase/useFetchTags";

export function ItemInitialDetail({
    item,
    setItem,
    isSubmitted,
}: {
    item: ItemDB;
    setItem: (item: ItemDB) => void;
    isSubmitted: boolean;
}) {
    const { categories, loading: catLoading } = useFetchCategories();
    const { tags, loading: tagLoading } = useFetchTags();

    return (
        <>
            <div className="flex flex-row gap-2 items-center">
                <Input
                    label="Item Name"
                    className="w-1/2"
                    isRequired
                    isClearable
                    description="For customer item display"
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
                    isRequired={catLoading ? false : true}
                    label={
                        catLoading ? (
                            <div className="flex flex-row gap-2 items-center">
                                <Spinner color="success" size="sm" />
                                <span className="sm:text-base text-xs">
                                    Fetching categories...
                                </span>
                            </div>
                        ) : (
                            "Item Category"
                        )
                    }
                    isClearable
                    className="w-1/2"
                    description="For item filtering"
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
                    isDisabled={catLoading}
                >
                    {categories.map((cat) => (
                        <SelectItem key={cat.category_id}>
                            {cat.category_name}
                        </SelectItem>
                    ))}
                </ModalAwareSelect>
            </div>
            <Input
                label="Item description"
                className="w-full"
                type="text"
                isClearable
                description="For customer item description display"
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
                    label={
                        tagLoading ? (
                            <div className="flex flex-row gap-2 items-center">
                                <Spinner color="success" size="sm" />
                                <span className="sm:text-base text-xs">
                                    Fetching tags...
                                </span>
                            </div>
                        ) : (
                            "Item Tag"
                        )
                    }
                    isClearable
                    className="w-1/2"
                    description="For promotional"
                    selectedKeys={item.tagId ? [item.tagId] : []}
                    onSelectionChange={(keys) => {
                        const key = Array.from(keys)[0] as string | undefined;
                        setItem({
                            ...item,
                            tagId: key ?? "",
                        });
                    }}
                    isDisabled={tagLoading}
                >
                    {tags.map((tag) => (
                        <SelectItem key={tag.tag_id}>{tag.tag_name}</SelectItem>
                    ))}
                </ModalAwareSelect>
            </div>
        </>
    );
}
