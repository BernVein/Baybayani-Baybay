import { Button, addToast } from "@heroui/react";
import { PlusIcon, RightArrow } from "@/components/icons";
import { ItemDB } from "@/model/db/additem";

export function AddVariantButton({
    itemHasVariant,
    item,
    onOpenAddVar,
    setIsSubmitted,
    validate,
}: {
    itemHasVariant: boolean;
    item: ItemDB;
    onOpenAddVar: () => void;
    setIsSubmitted: (submitted: boolean) => void;
    validate: () => boolean;
}) {
    return (
        <>
            <Button
                startContent={
                    itemHasVariant ? (
                        <PlusIcon className="w-5" />
                    ) : (
                        <RightArrow className="w-5" />
                    )
                }
                className="w-full"
                color="success"
                onPress={() => {
                    setIsSubmitted(true);
                    if (validate()) {
                        onOpenAddVar();
                    } else {
                        addToast({
                            title: "Empty Required Fields.",
                            description: "Please fill in all required fields.",
                            timeout: 3000,
                            color: "danger",
                            shouldShowTimeoutProgress: true,
                        });
                    }
                }}
            >
                {itemHasVariant
                    ? "Add Variant"
                    : item.variants.length === 0
                      ? "Set Additional Details"
                      : "Edit Details"}
            </Button>
        </>
    );
}
