import { useState, useEffect, useMemo } from "react";
import {
    Card,
    CardBody,
    CheckboxGroup,
    Button,
    Skeleton,
    Divider,
    Link,
    useDisclosure,
    Checkbox,
} from "@heroui/react";
import useIsMobile from "@/lib/isMobile";
import { AddToCart, CartIcon, BaybayaniLogo } from "@/components/icons";
import CartItem from "@/pages/Customer/CartPage/Cart/CartItem";
import CheckoutModalIndex from "@/pages/Customer/CartPage/CheckoutModal/CheckoutModalIndex";
import { useFetchCartItems } from "@/data/supabase/useFetchCartItemsUI";
export default function Cart() {
    const [selectedItemsId, setSelectedItemsId] = useState<string[]>([]);
    const {
        isOpen: checkoutModalIsOpen,
        onOpen: checkoutModalOnOpen,
        onOpenChange: checkoutModalOnOpenChange,
    } = useDisclosure();

    const isMobile = useIsMobile();
    const { items, loading, errorMsg, refetch } = useFetchCartItems(
        "cb20faec-72c0-4c22-b9d4-4c50bfb9e66f",
    );
    const allCartItems = items ?? [];

    const selectedSubtotal = useMemo(
        () =>
            allCartItems
                .filter((i) => selectedItemsId.includes(i.cart_item_user_id))
                .reduce((sum, i) => sum + i.subtotal, 0),
        [selectedItemsId, allCartItems],
    );

    useEffect(() => {
        setSelectedItemsId((prev) => {
            const validIds = new Set(
                allCartItems.map((i) => i.cart_item_user_id),
            );
            const next = prev.filter((id) => validIds.has(id));
            if (next.length === prev.length) return prev;
            return next;
        });
    }, [allCartItems]);

    // const selectedItems = useMemo(() => {
    //     return allCartItems.filter((i) =>
    //         selectedItemsId.includes(i.cart_item_user_id),
    //     );
    // }, [selectedItemsId, allCartItems]);

    const allIds = useMemo(
        () => allCartItems.map((i) => i.cart_item_user_id),
        [allCartItems],
    );

    const isAllSelected =
        allIds.length > 0 && selectedItemsId.length === allIds.length;

    const isIndeterminate =
        selectedItemsId.length > 0 && selectedItemsId.length < allIds.length;

    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-center w-full md:w-3/4 md:mx-auto px-5">
                <div className="flex items-center gap-2">
                    <BaybayaniLogo className="size-7" />
                    <h2 className="text-xl sm:text-3xl font-semibold">
                        Baybayani <span className="text-default-400">|</span>{" "}
                        Cart
                    </h2>
                </div>

                {errorMsg ? (
                    <span className="text-danger text-sm">{errorMsg}</span>
                ) : loading && !allCartItems.length ? (
                    <>
                        <Skeleton className="h-4 w-32 rounded-lg" />
                    </>
                ) : (
                    <>
                        <span className="text-default-500 text-sm">
                            {allCartItems.length < 1
                                ? "No items in Cart"
                                : `${allCartItems.length} ${allCartItems.length === 1 ? "item" : "items"} in Cart`}
                        </span>
                    </>
                )}
            </div>

            {!loading && allCartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center w-full md:w-3/4 md:mx-auto py-16 px-5 text-center">
                    <CartIcon className="size-40" />

                    <h3 className="text-xl font-semibold mb-2">
                        Your cart is empty
                    </h3>
                    <p className="text-default-500 mb-6">
                        Looks like you haven't added anything yet.
                    </p>

                    <Link href="/">
                        <Button
                            color="default"
                            startContent={<BaybayaniLogo className="size-5" />}
                        >
                            Go to Shop
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-3/4 md:mx-auto p-5">
                    <div className="sm:w-3/4">
                        <Checkbox
                            isSelected={isAllSelected}
                            isIndeterminate={isIndeterminate}
                            onValueChange={(checked) => {
                                setSelectedItemsId(checked ? allIds : []);
                            }}
                            isDisabled={allIds.length === 0}
                            className="mb-2"
                            color="success"
                        >
                            Select All
                        </Checkbox>

                        {/* Left side: cart list or skeletons */}
                        <CheckboxGroup
                            key="cart-group"
                            value={selectedItemsId}
                            onChange={(val) => {
                                if (Array.isArray(val)) setSelectedItemsId(val);
                            }}
                            className="mb-3"
                        >
                            {loading && !allCartItems.length ? (
                                <>
                                    {[...Array(3)].map((_, i) => (
                                        <CartItem
                                            key={`skeleton-${i}`}
                                            cartItemUserId={""}
                                            value={`loading-${i}`}
                                        />
                                    ))}
                                </>
                            ) : (
                                allCartItems.map((cart_item) => (
                                    <CartItem
                                        key={cart_item.cart_item_user_id}
                                        cartItemUserId={
                                            cart_item.cart_item_user_id
                                        }
                                        value={cart_item.cart_item_user_id}
                                        onDeleted={() => refetch()}
                                        onUpdated={() => refetch()}
                                    />
                                ))
                            )}
                        </CheckboxGroup>
                    </div>
                    {/* Right side: Order summary skeleton */}
                    <Card
                        className="w-full sm:w-1/4 self-start sticky top-40 bottom-23 z-20 shadow-sm border border-default-200 rounded-lg"
                        isBlurred={isMobile}
                    >
                        <CardBody className="gap-1">
                            {loading && !allCartItems.length ? (
                                <>
                                    <Skeleton className="h-5 w-32 mb-3 rounded-md" />
                                    <Divider className="my-1" />
                                    <Skeleton className="h-3 w-full mb-2 rounded-md" />
                                    <Skeleton className="h-3 w-2/3 mb-4 rounded-md" />
                                    <Skeleton className="h-10 w-full rounded-lg" />
                                </>
                            ) : (
                                <>
                                    <span className="mb-2">Order Summary</span>
                                    <div className="w-full flex flex-row mb-2 justify-between items-center">
                                        <span className="text-xs text-default-500">
                                            Total Price
                                        </span>
                                        <span className="text-default-600 font-bold">
                                            ₱{selectedSubtotal.toLocaleString()}
                                        </span>
                                    </div>
                                    <Button
                                        color="success"
                                        startContent={
                                            <AddToCart className="size-6" />
                                        }
                                        onPress={checkoutModalOnOpen}
                                        isDisabled={
                                            selectedItemsId.length === 0
                                        }
                                    >
                                        Proceed to Checkout
                                    </Button>
                                </>
                            )}
                        </CardBody>
                    </Card>
                </div>
            )}
            <CheckoutModalIndex
                checkoutModalIsOpen={checkoutModalIsOpen}
                checkoutModalOnOpenChange={checkoutModalOnOpenChange}
                selectedItemsId={selectedItemsId}
                selectedSubtotal={selectedSubtotal}
            />
        </>
    );
}
