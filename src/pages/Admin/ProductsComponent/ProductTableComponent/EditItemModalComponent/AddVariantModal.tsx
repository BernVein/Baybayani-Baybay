import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
} from "@heroui/react";

export function AddVariantModal({
    isOpenAddVar,
    onOpenChangeAddVar,
}: {
    isOpenAddVar: boolean;
    onOpenChangeAddVar: () => void;
}) {
    return (
        <Modal
            isOpen={isOpenAddVar}
            onOpenChange={onOpenChangeAddVar}
            disableAnimation
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Add Variant
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex flex-row gap-2 items-center">
                                <Input
                                    label="Variant Name"
                                    labelPlacement="outside"
                                    className="w-1/3"
                                />
                                <Input
                                    label="Stocks"
                                    labelPlacement="outside"
                                    className="w-1/3"
                                />
                                <Input
                                    label="Retail Price"
                                    labelPlacement="outside"
                                    className="w-1/3"
                                />
                            </div>

                            <div className="flex flex-row gap-2 items-center">
                                <Input
                                    label="Wholesale Price"
                                    labelPlacement="outside"
                                    className="w-1/2"
                                />
                                <Input
                                    label="Wholesale Min Qty"
                                    labelPlacement="outside"
                                    className="w-1/2"
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={onClose}
                            >
                                Close
                            </Button>
                            <Button color="success" onPress={onClose}>
                                Add
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
