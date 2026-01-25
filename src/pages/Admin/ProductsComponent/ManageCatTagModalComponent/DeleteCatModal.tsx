import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/react";
import { ExclamationCircle } from "@/components/icons";

export function DeleteCatModal({
    isOpenDeleteCat,
    onOpenChangeDeleteCat,
}: {
    isOpenDeleteCat: boolean;
    onOpenChangeDeleteCat: () => void;
}) {
    return (
        <Modal
            isOpen={isOpenDeleteCat}
            onOpenChange={onOpenChangeDeleteCat}
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
                                Delete Category
                            </h2>
                        </ModalHeader>

                        <ModalBody className="text-center text-default-600">
                            <p className="text-sm leading-relaxed">
                                Are you sure you want to remove{" "}
                                <span className="font-semibold text-default-800">
                                    Category 1
                                </span>
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
