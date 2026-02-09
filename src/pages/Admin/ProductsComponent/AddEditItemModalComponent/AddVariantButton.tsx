import { Button, addToast } from "@heroui/react";

import { PlusIcon, RightArrow } from "@/components/icons";
import { Item } from "@/model/Item";

export function AddVariantButton({
  itemHasVariant,
  item,
  onOpenAddVar,
  setIsSubmitted,
  validate,
}: {
  itemHasVariant: boolean;
  item: Item;
  onOpenAddVar: () => void;
  setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  validate: () => boolean;
}) {
  return (
    <>
      <Button
        className="w-full"
        color="success"
        startContent={
          itemHasVariant ? (
            <PlusIcon className="w-5" />
          ) : (
            <RightArrow className="w-5" />
          )
        }
        onPress={() => {
          setIsSubmitted(true);
          if (validate()) {
            onOpenAddVar();
          } else {
            addToast({
              title: "Empty Required Fields.",
              description: "Please fill in all required fields to proceed.",
              timeout: 3000,
              color: "danger",
              shouldShowTimeoutProgress: true,
            });
          }
        }}
      >
        {itemHasVariant
          ? "Add Variant"
          : item.item_variants.length === 0
            ? "Set Additional Details"
            : "Edit Details"}
      </Button>
    </>
  );
}
