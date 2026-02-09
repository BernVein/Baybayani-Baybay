import { Autocomplete, AutocompleteItem, Spinner } from "@heroui/react";
import { useState } from "react";

import { SearchIcon } from "@/components/icons";
import { useFetchNavbarItems } from "@/data/supabase/Customer/Products/useFetchNavbarItems";

export function SearchBarAutocomplete({
  setItemId,
  onOpenItemInfo,
}: {
  setItemId: React.Dispatch<React.SetStateAction<string>>;
  onOpenItemInfo: () => void;
}) {
  const [searchValue, setSearchValue] = useState("");
  const { items: fetchedItems, loading } = useFetchNavbarItems();
  const searchItems = fetchedItems.map((i) => ({
    label: i.item_title,
    key: `${i.item_id}`,
  }));

  return (
    <Autocomplete
      allowsCustomValue
      fullWidth
      className="w-full opacity-90"
      defaultItems={loading ? [] : searchItems}
      inputValue={searchValue}
      isDisabled={loading}
      listboxProps={{
        emptyContent: "No products found. Try another search.",
      }}
      placeholder={loading ? "Gathering items..." : "Search products..."}
      startContent={
        loading ? (
          <Spinner color="success" size="sm" />
        ) : (
          <SearchIcon className="size-5 text-default-500" />
        )
      }
      variant="flat"
      onClear={() => {
        setSearchValue("");
      }}
      onInputChange={setSearchValue}
      onSelectionChange={(key) => {
        const selected = searchItems.find((i) => i.key === key);

        if (selected) {
          setItemId(selected.key);
          setSearchValue(selected.label);
        }

        setTimeout(() => {
          (document.activeElement as HTMLElement | null)?.blur();
        }, 0);
      }}
    >
      {(item) => (
        <AutocompleteItem
          key={item.key}
          onPress={() => {
            onOpenItemInfo();
          }}
        >
          {item.label}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
