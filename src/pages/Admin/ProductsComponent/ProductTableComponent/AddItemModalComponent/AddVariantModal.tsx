import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    NumberInput,
    Input,
} from "@heroui/react";
import { DBVariant } from "@/pages/Admin/ProductsComponent/AddItemModal";
import { useState, useEffect } from "react";
export function AddVariantModal({
    isOpenAddVar,
    onOpenChangeAddVar,
    tempVariant,
    setTempVariant,
    handleAddVariant,
}: {
    isOpenAddVar: boolean;
    onOpenChangeAddVar: (isOpen: boolean) => void;
    tempVariant: DBVariant;
    setTempVariant: React.Dispatch<React.SetStateAction<DBVariant>>;
    handleAddVariant: () => void;
}) {
    const [isSubmittedAddVar, setIsSubmittedAddVar] = useState(false);
    useEffect(() => {
        if (isOpenAddVar) {
            setIsSubmittedAddVar(false);
        }
    }, [isOpenAddVar]);
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
                                    value={tempVariant.name}
                                    onValueChange={(value) =>
                                        setTempVariant((prev) => ({
                                            ...prev,
                                            name: value,
                                        }))
                                    }
                                    isInvalid={
                                        isSubmittedAddVar &&
                                        !tempVariant.name.trim()
                                    }
                                />
                                <NumberInput
                                    label="Stocks"
                                    isRequired
                                    labelPlacement="outside"
                                    className="w-1/3"
                                    value={tempVariant.stocks}
                                    onValueChange={(value) =>
                                        setTempVariant((prev) => ({
                                            ...prev,
                                            stocks: value,
                                        }))
                                    }
                                    isInvalid={
                                        isSubmittedAddVar &&
                                        (tempVariant.stocks === undefined ||
                                            tempVariant.stocks === null)
                                    }
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
                                    value={tempVariant.priceRetail}
                                    onValueChange={(value) =>
                                        setTempVariant((prev) => ({
                                            ...prev,
                                            priceRetail: value,
                                        }))
                                    }
                                    isInvalid={
                                        isSubmittedAddVar &&
                                        (tempVariant.priceRetail ===
                                            undefined ||
                                            tempVariant.priceRetail === null)
                                    }
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
                                    value={
                                        tempVariant.priceWholesale ?? undefined
                                    }
                                    onValueChange={(value) =>
                                        setTempVariant((prev) => ({
                                            ...prev,
                                            priceWholesale: value,
                                        }))
                                    }
                                />
                                <NumberInput
                                    label="Wholesale Min Qty"
                                    labelPlacement="outside"
                                    className="w-1/2"
                                    value={
                                        tempVariant.wholesaleMinQty ?? undefined
                                    }
                                    onValueChange={(value) =>
                                        setTempVariant((prev) => ({
                                            ...prev,
                                            wholesaleMinQty: value,
                                        }))
                                    }
                                    isDisabled={
                                        !tempVariant.priceWholesale ||
                                        tempVariant.priceWholesale <= 0
                                    }
                                    isInvalid={
                                        isSubmittedAddVar &&
                                        tempVariant.priceWholesale !==
                                            undefined &&
                                        tempVariant.priceWholesale !== null &&
                                        tempVariant.priceWholesale > 0 &&
                                        (!tempVariant.stocks ||
                                            tempVariant.stocks <= 0 ||
                                            !tempVariant.wholesaleMinQty ||
                                            tempVariant.wholesaleMinQty <= 0)
                                    }
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
                            <Button
                                color="success"
                                onPress={() => {
                                    setIsSubmittedAddVar(true);
                                    const isValidWholesale =
                                        !tempVariant.priceWholesale ||
                                        tempVariant.priceWholesale <= 0 ||
                                        (tempVariant.wholesaleMinQty !==
                                            undefined &&
                                            tempVariant.wholesaleMinQty !==
                                                null &&
                                            tempVariant.wholesaleMinQty > 0);

                                    if (
                                        tempVariant.name.trim() &&
                                        tempVariant.stocks !== 0 &&
                                        tempVariant.priceRetail !== undefined &&
                                        tempVariant.priceRetail !== null &&
                                        isValidWholesale
                                    ) {
                                        handleAddVariant();
                                        onClose();
                                        setIsSubmittedAddVar(false);
                                    }
                                }}
                            >
                                Add Variant
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
