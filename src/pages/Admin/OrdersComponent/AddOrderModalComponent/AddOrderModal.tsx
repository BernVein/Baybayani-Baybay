import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Autocomplete,
    AutocompleteItem,
    Button,
    Spinner,
    useDisclosure,
} from "@heroui/react";
import { useState } from "react";
import { SearchIcon } from "@/components/icons";
import { useFetchNavbarItems } from "@/data/supabase/Customer/Products/useFetchNavbarItems";
import ItemInfoModal from "@/pages/Customer/ShopPage/ItemInfoModal/ItemInfoModalIndex";

export function AddOrderModal({
    isOpenAddOrder,
    onOpenChangeAddOrder,
}: {
    isOpenAddOrder: boolean;
    onOpenChangeAddOrder: () => void;
}) {
    const [itemId, setItemId] = useState<string>("");
    const [searchValue, setSearchValue] = useState("");
    const {
        isOpen: isOpenItemInfo,
        onOpen: onOpenItemInfo,
        onOpenChange: onOpenChangeItemInfo,
    } = useDisclosure();
    const { items: fetchedItems, loading } = useFetchNavbarItems();
    const searchItems = fetchedItems.map((i) => ({
        label: i.item_title,
        key: `${i.item_id}`,
    }));
    return (
        <>
            <Modal
                isOpen={isOpenAddOrder}
                onOpenChange={onOpenChangeAddOrder}
                disableAnimation
                isDismissable={false}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <div className="flex flex-col gap-2">
                                    <span className="text-lg font-semibold">
                                        Add Order
                                    </span>
                                    <span className="text-sm text-default-500 italic">
                                        Changes here are temporary. The order
                                        will be officially added only when you
                                        click the{" "}
                                        <span className="text-success-500 font-semibold">
                                            Add Order
                                        </span>{" "}
                                        button below.
                                    </span>
                                </div>
                            </ModalHeader>
                            <ModalBody className="flex flex-col gap-2">
                                <p className="text-sm text-default-500">
                                    Note: When adding an order, the name will
                                    automatically be set to{" "}
                                    <span className="font-semibold text-default-700">
                                        Bern Vein Balermo
                                    </span>
                                    , the admin currently logged in.
                                </p>
                                <Autocomplete
                                    isDisabled={loading}
                                    fullWidth
                                    className="w-full opacity-90"
                                    defaultItems={loading ? [] : searchItems}
                                    placeholder={
                                        loading
                                            ? "Gathering items..."
                                            : "Search products..."
                                    }
                                    startContent={
                                        loading ? (
                                            <Spinner
                                                size="sm"
                                                color="success"
                                            />
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
                                        const selected = searchItems.find(
                                            (i) => i.key === key,
                                        );
                                        if (selected) {
                                            setItemId(selected.key);
                                            setSearchValue(selected.label);
                                        }

                                        setTimeout(() => {
                                            (
                                                document.activeElement as HTMLElement | null
                                            )?.blur();
                                        }, 0);
                                    }}
                                    listboxProps={{
                                        emptyContent:
                                            "No products found. Try another search.",
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
                            </ModalBody>

                            <ModalFooter className="justify-between items-center">
                                <span className="text-sm text-default-500 italic">
                                    <span className="text-red-500">*</span>{" "}
                                    Required field
                                </span>

                                <div className="flex gap-2">
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={onClose}
                                    >
                                        Cancel
                                    </Button>
                                    <Button color="success">Add Order</Button>
                                </div>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <ItemInfoModal
                isOpen={isOpenItemInfo}
                onOpenChange={onOpenChangeItemInfo}
                itemId={itemId}
            />
        </>
    );
}
