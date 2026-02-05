import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    addToast,
} from "@heroui/react";
import { ExclamationCircle } from "@/components/icons";
import { deleteMultipleCartItems } from "@/data/supabase/Customer/Cart/deleteMultipleCartItems";
import { useState } from "react";

export default function DeleteMultipleCartItemsModal({
    selectedItemsId,
    isOpen,
    onOpenChange,
    onDeleted,
}: {
    selectedItemsId: string[];
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onDeleted?: () => Promise<void> | void;
}) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleDelete(onClose: () => void) {
        setIsLoading(true);
        try {
            await deleteMultipleCartItems(selectedItemsId);
            if (onDeleted) await onDeleted();
            addToast({
                title: "Items removed from cart",
                description: `${selectedItemsId.length} items have been removed from your cart.`,
                color: "success",
                severity: "success",
                shouldShowTimeoutProgress: true,
            });
            onClose();
        } catch (err) {
            console.error(err);
            addToast({
                title: "Error",
                description: "Failed to remove items from cart.",
                color: "danger",
                severity: "danger",
            });
        }
        setIsLoading(false);
    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="sm"
            disableAnimation
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col items-center gap-2 text-center">
                            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-danger/10 text-danger">
                                <ExclamationCircle className="w-6 h-6" />
                            </div>
                            <h2 className="text-lg font-semibold text-danger">
                                Delete multiple items
                            </h2>
                        </ModalHeader>

                        <ModalBody className="text-center text-default-600">
                            <p className="text-sm leading-relaxed">
                                Are you sure you want to remove{" "}
                                <span className="font-semibold text-default-800">
                                    {selectedItemsId.length}
                                </span>{" "}
                                selected items from your cart?
                            </p>
                            <p className="text-xs text-default-500 mt-1">
                                This action cannot be undone.
                            </p>
                        </ModalBody>

                        <ModalFooter className="flex justify-center gap-3 pt-4">
                            <Button
                                variant="flat"
                                color="default"
                                className="px-6"
                                onPress={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="danger"
                                className="px-6 font-semibold"
                                onPress={() => {
                                    handleDelete(onClose);
                                }}
                                isLoading={isLoading}
                            >
                                Delete All
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
