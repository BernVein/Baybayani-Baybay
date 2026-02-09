import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
  useDisclosure,
  SelectItem,
  DropdownSection,
  Spinner,
} from "@heroui/react";
import { useState } from "react";

import { SearchIcon, FilterIcon, PlusIcon } from "@/components/icons";
import ModalAwareSelect from "@/lib/ModalAwareSelect";
import useIsMobile from "@/lib/isMobile";
import { AddEditItemModal } from "@/pages/Admin/ProductsComponent/AddEditItemModal";
import { useFetchCategories } from "@/data/supabase/useFetchCategories";

export function FilterSection({
  setSearchQuery,
  setSelectedCategories,
  searchQuery,
  selectedCategories,
}: {
  setSearchQuery: (query: string) => void;
  setSelectedCategories: (categories: string[]) => void;
  searchQuery: string;
  selectedCategories: string[];
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectKeys, setSelectKeys] = useState<Set<string>>(new Set());
  const [itemHasVariant, setItemHasVariant] = useState<boolean>(false);
  const isMobile = useIsMobile();
  const { categories, loading: catLoading } = useFetchCategories();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // keep dropdown selection in sync with selectedCategories
  const selectedCategoryKeys = new Set<string>(selectedCategories);

  return (
    <div className="flex flex-row justify-between w-full">
      <Input
        className="w-1/2 sm:w-1/4"
        placeholder="Search item / variant"
        startContent={<SearchIcon />}
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <div className="flex flex-row gap-2 justify-end">
        <ModalAwareSelect
          className="w-full"
          classNames={{ innerWrapper: "w-full pr-6" }}
          placeholder="Add Item"
          selectedKeys={selectKeys}
          selectionMode="single"
          startContent={<PlusIcon className="w-5 shrink-0" />}
          onSelectionChange={(keys) => {
            const key = Array.from(keys)[0] as string | undefined;

            if (!key) return;
            setItemHasVariant(key === "with-variant");
            onOpen();
            setSelectKeys(new Set());
          }}
        >
          <SelectItem key="no-variant">No Variant</SelectItem>
          <SelectItem key="with-variant">With Variant</SelectItem>
        </ModalAwareSelect>

        <Dropdown isOpen={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownTrigger>
            <Button
              className="capitalize w-full"
              color={selectedCategories.length > 0 ? "success" : "default"}
              isDisabled={catLoading}
              isIconOnly={isMobile}
              startContent={
                catLoading ? (
                  <Spinner color="success" size="sm" />
                ) : (
                  <FilterIcon className="w-4 shrink-0" />
                )
              }
            >
              {isMobile
                ? ""
                : `Categories ${selectedCategories.length > 0 ? `(${selectedCategories.length})` : ""}`}
            </Button>
          </DropdownTrigger>

          <DropdownMenu
            closeOnSelect={false}
            selectedKeys={selectedCategoryKeys}
            selectionMode="multiple"
            onSelectionChange={(keys) => {
              // keys is a Set<React.Key>
              const values = Array.from(keys).map(String);

              setSelectedCategories(values);
            }}
          >
            <DropdownSection showDivider title="Categories">
              {categories.map((cat) => (
                <DropdownItem key={cat.category_id}>
                  <div className="flex items-center gap-2">
                    <span>{cat.category_name}</span>
                  </div>
                </DropdownItem>
              ))}
            </DropdownSection>

            <DropdownSection showDivider title="Item Type">
              <DropdownItem key="no-variant">
                <div className="flex items-center gap-2">
                  <span>No Variant</span>
                </div>
              </DropdownItem>
              <DropdownItem key="with-variant">
                <div className="flex items-center gap-2">
                  <span>With Variant</span>
                </div>
              </DropdownItem>
            </DropdownSection>
            <DropdownSection title="Reset">
              <DropdownItem
                key="reset"
                color="danger"
                onClick={() => {
                  setSelectedCategories([]);
                  setIsDropdownOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <span>Reset Filters</span>
                </div>
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </div>

      <AddEditItemModal
        isOpen={isOpen}
        itemHasVariant={itemHasVariant}
        selectedItemId={null}
        onOpenChange={onOpenChange}
      />
    </div>
  );
}
