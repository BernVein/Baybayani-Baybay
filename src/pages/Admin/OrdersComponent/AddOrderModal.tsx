import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Spinner,
} from "@heroui/react";
import { useState } from "react";
import { SearchBarAutocomplete } from "./AddOrderModalComponent/SearchBarAutocomplete";
import ItemInfoModal from "@/pages/Customer/ShopPage/ItemInfoModal/ItemInfoModalIndex";
import { deleteMultipleCartItems } from "@/data/supabase/Customer/Cart/deleteMultipleCartItems";
import { OrderCartItems } from "@/pages/Admin/OrdersComponent/AddOrderModalComponent/OrderCartItems";
import { useFetchCartItems } from "@/data/supabase/Customer/Cart/useFetchCartItemsUI";
export function AddOrderModal({
    isOpenAddOrder,
    onOpenChangeAddOrder,
}: {
    isOpenAddOrder: boolean;
    onOpenChangeAddOrder: () => void;
}) {
    const [itemId, setItemId] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const {
        isOpen: isOpenItemInfo,
        onOpen: onOpenItemInfo,
        onOpenChange: onOpenChangeItemInfo,
    } = useDisclosure();

    const { items: cartItems, refetch } = useFetchCartItems(
        "cb20faec-72c0-4c22-b9d4-4c50bfb9e66f",
    );

    const handleClose = async () => {
        setIsLoading(true);
        if (cartItems.length > 0) {
            const allIds = cartItems.map((item) => item.cart_item_user_id);
            try {
                await deleteMultipleCartItems(allIds);
            } catch (error) {
                console.error("Failed to clear cart on modal close:", error);
            }
        }

        setItemId("");
        setIsLoading(false);
        onOpenChangeAddOrder();
    };

    return (
        <>
            <Modal
                isOpen={isOpenAddOrder}
                onOpenChange={(open) => {
                    if (!open) {
                        handleClose();
                    }
                }}
                disableAnimation
                isDismissable={false}
                size="xl"
                scrollBehavior="inside"
                closeButton={
                    isLoading ? <Spinner color="danger" size="sm" /> : undefined
                }
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
                            <SearchBarAutocomplete
                                setItemId={setItemId}
                                onOpenItemInfo={onOpenItemInfo}
                            />

                            <OrderCartItems
                                cartItems={cartItems}
                                refetch={refetch}
                            />
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
