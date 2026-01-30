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

export function AddVariantModal({
    itemUnitOfMeasure,
    itemHasVariant,
    isOpenAddVar,
    onOpenChangeAddVar,
    // onAddVariant,
}: {
    itemUnitOfMeasure: string;
    itemHasVariant: boolean;
    isOpenAddVar: boolean;
    onOpenChangeAddVar: () => void;
    // onAddVariant: (variant: VariantDB) => void;
}) {
    return (
        <Modal
            isOpen={isOpenAddVar}
            onOpenChange={onOpenChangeAddVar}
            disableAnimation
            scrollBehavior="inside"
            size="xl"
            isDismissable={false}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <span className="font-semibold">
                                {itemHasVariant
                                    ? "Add Variant"
                                    : "Set Additional Details"}
                            </span>
                        </ModalHeader>
                        <ModalBody>
                            <>
                                {itemHasVariant && (
                                    <div className="flex flex-row gap-2 items-center">
                                        <Input
                                            label="Variant Name"
                                            isRequired
                                            labelPlacement="outside-top"
                                            description="Enter the variant name"
                                        />
                                    </div>
                                )}
                                <Divider />
                                <span className="text-lg font-semibold">
                                    Set Item Stock Details
                                </span>
                                <div className="flex flex-row gap-2 items-center">
                                    <NumberInput
                                        label="Stocks"
                                        isRequired
                                        labelPlacement="outside-top"
                                        description="Enter the acquired stock quantity"
                                        className="w-1/2"
                                        endContent={
                                            <div className="pointer-events-none flex items-center">
                                                <span className="text-default-400 text-small">
                                                    {itemUnitOfMeasure}
                                                </span>
                                            </div>
                                        }
                                    />
                                    <DatePicker
                                        className="w-1/2"
                                        label="Date Delivered"
                                        labelPlacement="outside-top"
                                        isRequired
                                        description="Enter the date the stock was delivered"
                                    />
                                </div>

                                <div className="flex flex-row gap-2 items-center">
                                    <Input
                                        label="Supplier"
                                        isRequired
                                        labelPlacement="outside-top"
                                        description="Enter the supplier name"
                                        className="w-1/2"
                                    />
                                    <NumberInput
                                        label="Total Buying Price"
                                        isRequired
                                        labelPlacement="outside-top"
                                        description="Enter the total price on purchase"
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
                                </span>
                                <div className="flex flex-col gap-2 items-center">
                                    <NumberInput
                                        label="Low Stock Alert Threshold"
                                        isRequired
                                        labelPlacement="outside-top"
                                        endContent={
                                            <div className="pointer-events-none flex items-center">
                                                <span className="text-default-400 text-small">
                                                    {itemUnitOfMeasure}
                                                </span>
                                            </div>
                                        }
                                        description="Notification will trigger when the stock level reaches this threshold"
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
                                        labelPlacement="outside-top"
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
                                        description="Enter the retail price of the item"
                                    />
                                    <NumberInput
                                        label="Wholesale Price"
                                        isRequired
                                        labelPlacement="outside-top"
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
                                        description="Enter the wholesale price of the item"
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
                                        labelPlacement="outside-top"
                                        endContent={
                                            <div className="pointer-events-none flex items-center">
                                                <span className="text-default-400 text-small">
                                                    {itemUnitOfMeasure}
                                                </span>
                                            </div>
                                        }
                                        description="Enter the minimum quantity required for wholesale purchase"
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
                            <Button
                                color="success"
                                onPress={() => {
                                    // onAddVariant(variant); // variant = your form state object
                                    onClose(); // close the modal
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
