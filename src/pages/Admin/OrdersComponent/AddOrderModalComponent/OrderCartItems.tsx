import { Button, Divider, CheckboxGroup } from "@heroui/react";
import { TrashIcon } from "@/components/icons";
import { useFetchCartItems } from "@/data/supabase/Customer/Cart/useFetchCartItemsUI";
import { useEffect, useMemo, useState } from "react";
import { deleteMultipleCartItems } from "@/data/supabase/Customer/Cart/deleteMultipleCartItems";
import CartItem from "@/pages/Customer/CartPage/Cart/CartItem";

export function OrderCartItems() {
    const { items: cartItems, refetch } = useFetchCartItems(
        "cb20faec-72c0-4c22-b9d4-4c50bfb9e66f",
    );
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const totalSubtotal = useMemo(
        () =>
            cartItems
                .filter((item) => selectedKeys.includes(item.cart_item_user_id))
                .reduce((sum, item) => sum + item.subtotal, 0),
        [cartItems, selectedKeys],
    );
    useEffect(() => {
        setSelectedKeys(cartItems.map((item) => item.cart_item_user_id));
    }, [cartItems]);

    const handleDeleteSelected = async () => {
        if (selectedKeys.length === 0) return;
        setIsDeleting(true);
        try {
            await deleteMultipleCartItems(selectedKeys);
            await refetch();
            setSelectedKeys([]);
        } catch (error) {
            console.error("Batch delete failed:", error);
        } finally {
            setIsDeleting(false);
        }
    };
    useEffect(() => {
        const handleCartUpdate = () => refetch();
        window.addEventListener("baybayani:cart-updated", handleCartUpdate);
        return () =>
            window.removeEventListener(
                "baybayani:cart-updated",
                handleCartUpdate,
            );
    }, [refetch]);

    return (
        <>
            {cartItems.length > 0 && (
                <div className="flex flex-col gap-3 mt-4">
                    <div className="flex justify-between items-center px-1">
                        <div className="flex flex-col items-start gap-1">
                            <span className="text-sm font-semibold text-default-700">
                                Selected Items ({selectedKeys.length}/
                                {cartItems.length})
                            </span>
                            <span className="text-sm font-bold text-success-600">
                                Total: ₱{totalSubtotal.toLocaleString()}
                            </span>
                        </div>
                        <Button
                            size="sm"
                            color="danger"
                            startContent={<TrashIcon className="size-4" />}
                            isDisabled={selectedKeys.length === 0 || isDeleting}
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
                                setSelectedKeys(value as string[])
                            }
                        >
                            {cartItems.map((item) => (
                                <CartItem
                                    key={item.cart_item_user_id}
                                    cartItemUserId={item.cart_item_user_id}
                                    value={item.cart_item_user_id}
                                    onDeleted={refetch}
                                    onUpdated={refetch}
                                />
                            ))}
                        </CheckboxGroup>
                    </div>
                </div>
            )}
        </>
    );
}
