import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    NumberInput,
    Divider,
    DatePicker,
    Input,
} from "@heroui/react";
// import { useState, useEffect } from "react";
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
            scrollBehavior="inside"
            size="xl"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Add Variant
                        </ModalHeader>
                        <ModalBody>
                            <>
                                <div className="flex flex-row gap-2 items-center">
                                    <Input
                                        label="Variant Name"
                                        isRequired
                                        labelPlacement="outside"
                                    />
                                </div>
                                <Divider />
                                <span className="text-lg font-semibold">
                                    Set Item Stock Details
                                </span>
                                <div className="flex flex-row gap-2 items-center">
                                    <NumberInput
                                        label="Stocks"
                                        isRequired
                                        labelPlacement="outside"
                                        className="w-1/2"
                                    />
                                    <DatePicker
                                        className="w-1/2"
                                        label="Date Delivered"
                                        labelPlacement="outside"
                                        isRequired
                                    />
                                </div>

                                <div className="flex flex-row gap-2 items-center">
                                    <Input
                                        label="Supplier"
                                        isRequired
                                        labelPlacement="outside"
                                        className="w-1/2"
                                    />
                                    <NumberInput
                                        label="Total Buying Price"
                                        isRequired
                                        labelPlacement="outside"
                                        className="w-1/2"
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
                                    />
                                </div>
                                <Divider />
                                <span className="text-lg font-semibold">
                                    For low stock notification
                                    <p className="text-sm text-default-500 italic">
                                        Set the stock level at which you’ll be
                                        notified that items are running low.
                                    </p>
                                </span>
                                <div className="flex flex-col gap-2 items-center">
                                    <NumberInput
                                        label="Low Stock Alert Threshold"
                                        isRequired
                                        labelPlacement="outside"
                                    />
                                </div>
                                <Divider />
                                <span className="text-lg font-semibold">
                                    Set Item Pricing
                                </span>
                                <div className="flex flex-row gap-2 items-center">
                                    <NumberInput
                                        label="Retail Price"
                                        isRequired
                                        labelPlacement="outside"
                                        className="w-1/2"
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
                                    />
                                    <NumberInput
                                        label="Wholesale Price"
                                        isRequired
                                        labelPlacement="outside"
                                        className="w-1/2"
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
                                    />
                                </div>
                                <Divider />
                                <span className="text-lg font-semibold">
                                    Set Wholesale Minimum Quantity
                                    <p className="text-sm text-default-500 italic">
                                        Applicable only if wholesale price is
                                        set
                                    </p>
                                </span>
                                <div className="flex flex-col gap-2 items-center">
                                    <NumberInput
                                        label="Wholesale Minimum Quantity"
                                        isRequired
                                        labelPlacement="outside"
                                    />
                                </div>
                            </>
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
