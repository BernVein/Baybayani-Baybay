import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  addToast,
} from "@heroui/react";
import { useState } from "react";

import { ExclamationCircle } from "@/components/icons";
import { CartItemUser } from "@/model/cartItemUser";
import { deleteCartItem } from "@/data/supabase/Customer/Cart/deleteCartItem";
export default function DeleteCartItemModalIndex({
  cartItemUser,
  isOpen,
  onOpenChange,
  variant_name_to_delete,
  onDeleted,
}: {
  cartItemUser: CartItemUser;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  variant_name_to_delete: string;
  onDeleted?: () => Promise<void> | void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete(id: string, onClose: () => void) {
    setIsLoading(true);
    try {
      await deleteCartItem(id);
      if (onDeleted) await onDeleted();
      addToast({
        title: "Item removed from cart",
        description: `${variant_name_to_delete} has been removed from your cart.`,
        color: "success",
        severity: "success",
        shouldShowTimeoutProgress: true,
      });
      onClose();
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  }

  return (
    <Modal
      disableAnimation
      isOpen={isOpen}
      size="sm"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col items-center gap-2 text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-danger/10 text-danger">
                <ExclamationCircle className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-semibold text-danger">Delete item</h2>
            </ModalHeader>

            <ModalBody className="text-center text-default-600">
              <p className="text-sm leading-relaxed">
                Are you sure you want to remove{" "}
                <span className="font-semibold text-default-800">
                  {variant_name_to_delete}
                </span>{" "}
                from your cart?
              </p>
              <p className="text-xs text-default-500 mt-1">
                This action cannot be undone.
              </p>
            </ModalBody>

            <ModalFooter className="flex justify-center gap-3 pt-4">
              <Button
                className="px-6"
                color="default"
                variant="flat"
                onPress={onClose}
              >
                Cancel
              </Button>
              <Button
                className="px-6 font-semibold"
                color="danger"
                isLoading={isLoading}
                onPress={() => {
                  handleDelete(cartItemUser.cart_item_user_id, onClose);
                }}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
