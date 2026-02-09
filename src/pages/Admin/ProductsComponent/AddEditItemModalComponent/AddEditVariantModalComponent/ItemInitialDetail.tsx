import { Input, SelectItem, Spinner } from "@heroui/react";

import ModalAwareSelect from "@/lib/ModalAwareSelect";
import { Item } from "@/model/Item";
import { useFetchCategories } from "@/data/supabase/useFetchCategories";
import { useFetchTags } from "@/data/supabase/useFetchTags";

export function ItemInitialDetail({
  item,
  setItem,
  isSubmitted,
}: {
  item: Item;
  setItem: React.Dispatch<React.SetStateAction<Item>>;
  isSubmitted: boolean;
}) {
  const { categories, loading: catLoading } = useFetchCategories();
  const { tags, loading: tagLoading } = useFetchTags();

  return (
    <>
      <div className="flex flex-row gap-2 items-center">
        <Input
          isClearable
          isRequired
          className="w-1/2"
          description="For customer item display"
          errorMessage="Item Name can't be empty"
          isInvalid={isSubmitted && !item.item_title.trim()}
          label="Item Name"
          value={item.item_title}
          onValueChange={(value) =>
            setItem({
              ...item,
              item_title: value,
            })
          }
        />
        <ModalAwareSelect
          isClearable
          className="w-1/2"
          description="For item filtering"
          errorMessage="Item Category can't be empty"
          isDisabled={catLoading}
          isInvalid={isSubmitted && !item.item_category_id}
          isRequired={catLoading ? false : true}
          label={
            catLoading ? (
              <div className="flex flex-row gap-2 items-center">
                <Spinner color="success" size="sm" />
                <span className="sm:text-sm text-xs">
                  Fetching categories...
                </span>
              </div>
            ) : (
              "Item Category"
            )
          }
          selectedKeys={item.item_category_id ? [item.item_category_id] : []}
          onSelectionChange={(keys) => {
            const key = Array.from(keys)[0] as string | undefined;

            setItem({
              ...item,
              item_category_id: key ?? "",
            });
          }}
        >
          {categories.map((cat) => (
            <SelectItem key={cat.category_id}>{cat.category_name}</SelectItem>
          ))}
        </ModalAwareSelect>
      </div>
      <Input
        isClearable
        className="w-full"
        description="For customer item description display"
        label="Item description"
        type="text"
        value={item.item_description ? item.item_description : ""}
        onValueChange={(value) =>
          setItem({
            ...item,
            item_description: value,
          })
        }
      />
      <div className="flex flex-row gap-2 items-center">
        <Input
          isClearable
          isRequired
          className="w-1/2"
          description="by kg, lbs, piece, etc."
          errorMessage="Unit of Measure can't be empty"
          isInvalid={isSubmitted && !item.item_sold_by.trim()}
          label="Unit of Measure"
          value={item.item_sold_by}
          onValueChange={(value) =>
            setItem({
              ...item,
              item_sold_by: value,
            })
          }
        />

        <ModalAwareSelect
          isClearable
          className="w-1/2"
          description="For promotional"
          isDisabled={tagLoading}
          label={
            tagLoading ? (
              <div className="flex flex-row gap-2 items-center">
                <Spinner color="success" size="sm" />
                <span className="sm:text-sm text-xs">Fetching tags...</span>
              </div>
            ) : (
              "Item Tag"
            )
          }
          selectedKeys={item.item_tag ? [item.item_tag] : []}
          onSelectionChange={(keys) => {
            const key = Array.from(keys)[0] as string | undefined;

            setItem({
              ...item,
              item_tag: key ?? "",
            });
          }}
        >
          {tags.map((tag) => (
            <SelectItem key={tag.tag_id}>{tag.tag_name}</SelectItem>
          ))}
        </ModalAwareSelect>
      </div>
    </>
  );
}
