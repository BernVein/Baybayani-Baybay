import { CartItemUser } from "@/model/cartItemUser";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { AddToCart } from "@/components/icons";

export default function CheckoutModalIndex({
  checkoutModalIsOpen,
  checkoutModalOnOpenChange,
  selectedItems,
  selectedSubtotal,
}: {
  checkoutModalIsOpen: boolean;
  checkoutModalOnOpenChange: () => void;
  selectedItems: CartItemUser[];
  selectedSubtotal: number;
}) {
  return (
    <>
      <Modal
        scrollBehavior="inside"
        isOpen={checkoutModalIsOpen}
        onOpenChange={checkoutModalOnOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Checkout Summary
              </ModalHeader>
              <ModalBody>
                {selectedItems.length === 0 ? (
                  <p className="text-default-500 text-center py-4">
                    No items selected.
                  </p>
                ) : (
                  <div className="space-y-6">
                    {selectedItems.map((item) => (
                      <div
                        key={item.cart_item_user_id}
                        className="flex items-start gap-4 pb-4 border-b border-default-200"
                      >
                        {/* Product image */}
                        <div className="w-30 h-20 overflow-hidden rounded-md">
                          <img
                            src={item.item.item_img[0]}
                            alt={item.item.item_title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Text details */}
                        <div className="flex flex-col w-full gap-1">
                          {/* product name */}
                          <p className="font-semibold text-sm">
                            {item.variant_snapshot.variant_snapshot_name}
                          </p>

                          {/* unit price */}
                          <div className="flex justify-between text-xs text-default-500">
                            <span className="font-medium text-default-600">
                              Unit Price
                            </span>
                            <span>
                              ₱
                              {item.variant_snapshot.variant_snapshot_price_retail.toLocaleString()}
                            </span>
                          </div>
                          {/* price variant */}
                          <div className="flex justify-between text-xs text-default-500">
                            <span className="font-medium text-default-600">
                              Price Variant
                            </span>
                            <span>{item.price_variant}</span>
                          </div>

                          {/* quantity */}
                          <div className="flex justify-between text-xs text-default-500">
                            <span className="font-medium text-default-600">
                              Quantity
                            </span>
                            <span>
                              {item.quantity} {item.item.item_sold_by}
                              {item.quantity > 1 ? "s" : ""}
                            </span>
                          </div>

                          {/* subtotal */}
                          <div className="flex justify-between text-sm font-semibold mt-1">
                            <span className="text-default-600">Subtotal</span>
                            <span>₱{item.subtotal.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ModalBody>

              <ModalFooter className="flex flex-col gap-4">
                {/* Total Price Section */}
                <div className="w-full flex justify-between items-center px-1 pb-2 pt-3">
                  <span className="text-default-600 text-sm sm:text-base font-medium">
                    Total Price:
                  </span>
                  <span className="font-bold text-lg">
                    ₱{selectedSubtotal.toLocaleString()}
                  </span>
                </div>

                {/* Buttons Section */}
                <div className="w-full flex justify-end gap-2">
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>

                  <Button
                    color="success"
                    onPress={onClose}
                    isDisabled={selectedItems.length === 0}
                    startContent={<AddToCart className="size-6" />}
                  >
                    Checkout
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
