import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    NumberInput,
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
                                    isRequired
                                    labelPlacement="outside"
                                    className="w-1/3"
                                />
                                <NumberInput
                                    label="Stocks"
                                    isRequired
                                    labelPlacement="outside"
                                    className="w-1/3"
                                />
                                <NumberInput
                                    label="Retail Price"
                                    formatOptions={{
                                        style: "decimal",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }}
                                    isRequired
                                    startContent={
                                        <div className="pointer-events-none flex items-center">
                                            <span className="text-default-400 text-small">
                                                ₱
                                            </span>
                                        </div>
                                    }
                                    labelPlacement="outside"
                                    className="w-1/3"
                                />
                            </div>

                            <div className="flex flex-row gap-2 items-center">
                                <NumberInput
                                    label="Wholesale Price"
                                    formatOptions={{
                                        style: "decimal",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }}
                                    startContent={
                                        <div className="pointer-events-none flex items-center">
                                            <span className="text-default-400 text-small">
                                                ₱
                                            </span>
                                        </div>
                                    }
                                    labelPlacement="outside"
                                    className="w-1/2"
                                />
                                <NumberInput
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
                                Add Variant
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
