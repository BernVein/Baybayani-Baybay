import { Autocomplete, AutocompleteItem, Spinner } from "@heroui/react";
import { SearchIcon } from "@/components/icons";
import { useFetchNavbarItems } from "@/data/supabase/Customer/Products/useFetchNavbarItems";
import { useState } from "react";

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
            isDisabled={loading}
            fullWidth
            className="w-full opacity-90"
            defaultItems={loading ? [] : searchItems}
            placeholder={loading ? "Gathering items..." : "Search products..."}
            startContent={
                loading ? (
                    <Spinner size="sm" color="success" />
                ) : (
                    <SearchIcon className="size-5 text-default-500" />
                )
            }
            variant="flat"
            inputValue={searchValue}
            onInputChange={setSearchValue}
            allowsCustomValue
            onClear={() => {
                setSearchValue("");
            }}
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
            listboxProps={{
                emptyContent: "No products found. Try another search.",
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
