import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@heroui/react";
import { ExclamationCircle } from "@/components/icons";

export function CloseWarningModal({
    isOpenWarning,
    onOpenChangeWarning,
    onConfirmClose,
}: {
    isOpenWarning: boolean;
    onOpenChangeWarning: (open: boolean) => void;
    onConfirmClose: () => void;
}) {
    return (
        <>
            <Modal
                isOpen={isOpenWarning}
                onOpenChange={onOpenChangeWarning}
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
                                    Confirm Exit
                                </h2>
                            </ModalHeader>

                            <ModalBody className="text-center text-default-600">
                                <p className="text-sm leading-relaxed">
                                    Are you sure you want to exit? All changes
                                    will be lost.
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
                                        onClose();
                                        onConfirmClose();
                                    }}
                                >
                                    Exit
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
