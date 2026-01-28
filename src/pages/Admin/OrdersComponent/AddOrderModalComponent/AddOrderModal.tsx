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
import { useEffect, useMemo } from "react";
import { useFetchCartItems } from "@/data/supabase/Customer/Cart/useFetchCartItemsUI";
import { CheckboxGroup, Divider } from "@heroui/react";
import CartItem from "@/pages/Customer/CartPage/Cart/CartItem";

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

    const {
        items: cartItems,
        // loading: cartLoading,
        refetch,
    } = useFetchCartItems("cb20faec-72c0-4c22-b9d4-4c50bfb9e66f");

    useEffect(() => {
        const handleCartUpdate = () => refetch();
        window.addEventListener("baybayani:cart-updated", handleCartUpdate);
        return () => {
            window.removeEventListener(
                "baybayani:cart-updated",
                handleCartUpdate,
            );
        };
    }, [refetch]);

    const totalSubtotal = useMemo(
        () => cartItems.reduce((sum, item) => sum + item.subtotal, 0),
        [cartItems],
    );
    return (
        <>
            <Modal
                isOpen={isOpenAddOrder}
                onOpenChange={onOpenChangeAddOrder}
                disableAnimation
                isDismissable={false}
                size="xl"
                scrollBehavior="inside"
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
                            <ModalBody
                                key={cartItems.map((i) => i.subtotal).join("-")}
                                className="flex flex-col gap-2"
                            >
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

                                {cartItems.length > 0 && (
                                    <div className="flex flex-col gap-3 mt-4">
                                        <div className="flex justify-between items-center px-1">
                                            <span className="text-sm font-semibold text-default-700">
                                                Selected Items (
                                                {cartItems.length})
                                            </span>
                                            <span className="text-sm font-bold text-success-600">
                                                Total: ₱
                                                {totalSubtotal.toLocaleString()}
                                            </span>
                                        </div>
                                        <Divider />
                                        <div className="max-h-[400px] overflow-y-auto pr-2 flex flex-col gap-3">
                                            <CheckboxGroup>
                                                {cartItems.map((item) => (
                                                    <CartItem
                                                        key={
                                                            item.cart_item_user_id
                                                        }
                                                        cartItemUserId={
                                                            item.cart_item_user_id
                                                        }
                                                        value={
                                                            item.cart_item_user_id
                                                        }
                                                        onDeleted={refetch}
                                                        onUpdated={refetch}
                                                    />
                                                ))}
                                            </CheckboxGroup>
                                        </div>
                                    </div>
                                )}
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
