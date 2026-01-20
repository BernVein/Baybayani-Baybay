import {
    SearchIcon,
    FilterIcon,
    VegetablesOutline,
    FoodGrains24Regular,
    FruitsOutline,
    PoultryLeg,
    PlusIcon,
    Chili,
} from "@/components/icons";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
    Input,
    useDisclosure,
    SelectItem,
} from "@heroui/react";
import ModalAwareSelect from "@/lib/ModalAwareSelect";
import useIsMobile from "@/lib/isMobile";
import { AddItemModal } from "@/pages/Admin/ProductsComponent/AddItemModal";
import { useState } from "react";

export function FilterSection() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectKeys, setSelectKeys] = useState<Set<string>>(new Set());
    const [selectedItemAddOption, setSelectedItemAddOption] = useState<
        string | null
    >(null);
    const isMobile = useIsMobile();
    return (
        <div className="flex flex-row justify-between w-full">
            <Input
                placeholder="Search item / variant"
                className="w-1/2 sm:w-1/4"
                startContent={<SearchIcon />}
            />
            <div className="flex flex-row gap-2 justify-end">
                <ModalAwareSelect
                    placeholder="Add Item"
                    startContent={<PlusIcon className="w-5 shrink-0" />}
                    className="w-full"
                    classNames={{ innerWrapper: "w-full pr-6" }}
                    selectionMode="single"
                    selectedKeys={selectKeys}
                    onSelectionChange={(keys) => {
                        console.log(selectedItemAddOption);
                        const key = Array.from(keys)[0] as string | undefined;
                        if (!key) return;
                        setSelectedItemAddOption(key);
                        onOpen();
                        setSelectKeys(new Set());
                    }}
                >
                    <SelectItem key="with-variant">With Variant</SelectItem>
                    <SelectItem key="no-variant">No Variant</SelectItem>
                </ModalAwareSelect>
                <Dropdown>
                    <DropdownTrigger>
                        <Button
                            className="capitalize w-full"
                            startContent={
                                <FilterIcon className="w-4 shrink-0" />
                            }
                            isIconOnly={isMobile}
                        >
                            {isMobile ? "" : "Categories"}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        closeOnSelect={false}
                        selectionMode="multiple"
                    >
                        <DropdownItem key="vegetable">
                            <div className="flex items-center gap-2">
                                <VegetablesOutline />
                                <span>Vegetable</span>
                            </div>
                        </DropdownItem>
                        <DropdownItem key="grain">
                            <div className="flex items-center gap-2">
                                <FoodGrains24Regular />
                                <span>Grain</span>
                            </div>
                        </DropdownItem>
                        <DropdownItem key="fruit">
                            <div className="flex items-center gap-2">
                                <FruitsOutline />
                                <span>Fruit</span>
                            </div>
                        </DropdownItem>
                        <DropdownItem key="poultry">
                            <div className="flex items-center gap-2">
                                <PoultryLeg />
                                <span>Poultry</span>
                            </div>
                        </DropdownItem>
                        <DropdownItem key="spice">
                            <div className="flex items-center gap-2">
                                <Chili />
                                <span>Spice</span>
                            </div>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <AddItemModal
                selectedItemAddOption={selectedItemAddOption}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            />
        </div>
    );
}
