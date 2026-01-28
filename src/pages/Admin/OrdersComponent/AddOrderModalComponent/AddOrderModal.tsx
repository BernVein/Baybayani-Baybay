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
    CheckboxGroup,
    Divider,
} from "@heroui/react";
import { useState, useEffect, useMemo, useRef } from "react";
import { SearchIcon, TrashIcon } from "@/components/icons";
import { useFetchNavbarItems } from "@/data/supabase/Customer/Products/useFetchNavbarItems";
import ItemInfoModal from "@/pages/Customer/ShopPage/ItemInfoModal/ItemInfoModalIndex";
import { useFetchCartItems } from "@/data/supabase/Customer/Cart/useFetchCartItemsUI";
import CartItem from "@/pages/Customer/CartPage/Cart/CartItem";
import { deleteMultipleCartItems } from "@/data/supabase/Customer/Cart/deleteMultipleCartItems";
export function AddOrderModal({
    isOpenAddOrder,
    onOpenChangeAddOrder,
}: {
    isOpenAddOrder: boolean;
    onOpenChangeAddOrder: () => void;
}) {
    const [itemId, setItemId] = useState<string>("");
    const [searchValue, setSearchValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const prevCartIdsRef = useRef<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
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

    const { items: cartItems, refetch } = useFetchCartItems(
        "cb20faec-72c0-4c22-b9d4-4c50bfb9e66f",
    );

    useEffect(() => {
        const currentIds = cartItems.map((item) => item.cart_item_user_id);

        const prevIds = prevCartIdsRef.current;

        // IDs that are newly added to the cart
        const newIds = currentIds.filter((id) => !prevIds.includes(id));

        setSelectedKeys((prev) => {
            // Remove selections that no longer exist
            const stillValid = prev.filter((id) => currentIds.includes(id));

            // Add only brand-new cart items
            return [...stillValid, ...newIds];
        });

        // If cart is empty, reset selection
        if (currentIds.length === 0) {
            setSelectedKeys([]);
        }

        prevCartIdsRef.current = currentIds;
    }, [cartItems]);

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
        () =>
            cartItems
                .filter((item) => selectedKeys.includes(item.cart_item_user_id))
                .reduce((sum, item) => sum + item.subtotal, 0),
        [cartItems, selectedKeys],
    );

    const handleDeleteSelected = async () => {
        if (selectedKeys.length === 0) return;
        setIsDeleting(true);
        try {
            await deleteMultipleCartItems(selectedKeys);
            // selectedKeys will be updated by the useEffect above once refetch completes
        } catch (error) {
            console.error("Batch delete failed:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleClose = async () => {
        setIsLoading(true);
        // Delete all items in the cart
        if (cartItems.length > 0) {
            const allIds = cartItems.map((item) => item.cart_item_user_id);
            try {
                await deleteMultipleCartItems(allIds);
            } catch (error) {
                console.error("Failed to clear cart on modal close:", error);
            }
        }

        // Reset selection
        setSelectedKeys([]);
        setSearchValue("");
        setItemId("");
        setIsLoading(false);
        // Actually close the modal
        onOpenChangeAddOrder();
    };

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
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <div className="flex flex-col gap-2">
                                <span className="text-lg font-semibold">
                                    Add Order
                                </span>
                                <span className="text-sm text-default-500 italic">
                                    Changes here are temporary. The order will
                                    be officially added only when you click the{" "}
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
                                        <div className="flex flex-col items-start gap-1">
                                            <span className="text-sm font-semibold text-default-700">
                                                Selected Items (
                                                {selectedKeys.length}/
                                                {cartItems.length})
                                            </span>
                                            <span className="text-sm font-bold text-success-600">
                                                Total: ₱
                                                {totalSubtotal.toLocaleString()}
                                            </span>
                                        </div>
                                        <Button
                                            size="sm"
                                            color="danger"
                                            startContent={
                                                <TrashIcon className="size-4" />
                                            }
                                            isDisabled={
                                                selectedKeys.length === 0 ||
                                                isDeleting
                                            }
                                            isLoading={isDeleting}
                                            onPress={handleDeleteSelected}
                                        >
                                            Delete Selected
                                        </Button>
                                    </div>
                                    <Divider />
                                    <div className="max-h-[400px] overflow-y-auto pr-2 flex flex-col gap-3">
                                        <CheckboxGroup
                                            value={selectedKeys}
                                            onValueChange={(value) =>
                                                setSelectedKeys(
                                                    value as string[],
                                                )
                                            }
                                        >
                                            {cartItems.map((item) => (
                                                <CartItem
                                                    key={item.cart_item_user_id}
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

                        <ModalFooter className="justify-end items-center">
                            <div className="flex gap-2">
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={handleClose}
                                    isLoading={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button color="success">Add Order</Button>
                            </div>
                        </ModalFooter>
                    </>
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
