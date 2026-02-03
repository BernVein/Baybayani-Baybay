import { PhotoIcon, RightArrow, PlusIcon } from "@/components/icons";
import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    addToast,
    useDisclosure,
    Divider,
} from "@heroui/react";
import { ItemInitialDetail } from "@/pages/Admin/ProductsComponent/ProductTableComponent/AddItemModalComponent/AddVariantModalComponent/ItemInitialDetail";
import { AddVariantModal } from "@/pages/Admin/ProductsComponent/ProductTableComponent/AddItemModalComponent/AddVariantModal";
import { useState, useEffect } from "react";
import { ItemDB } from "@/model/db/additem";
import { VariantList } from "@/pages/Admin/ProductsComponent/ProductTableComponent/AddItemModalComponent/VariantList";
export function AddItemModal({
    itemHasVariant,
    isOpen,
    onOpenChange,
}: {
    itemHasVariant: boolean;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const {
        isOpen: isOpenAddVar,
        onOpen: onOpenAddVar,
        onOpenChange: onOpenChangeAddVar,
    } = useDisclosure();

    const [item, setItem] = useState<ItemDB>({
        name: "",
        categoryId: "",
        shortDescription: "",
        unitOfMeasure: "",
        tagId: "",
        variants: [],
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    function validate(): boolean {
        if (!item.name.trim()) return false;
        if (!item.categoryId) return false;
        if (!item.unitOfMeasure.trim()) return false;
        return true;
    }

    useEffect(() => {
        setIsSubmitted(false);
        setItem({
            name: "",
            categoryId: "",
            shortDescription: "",
            unitOfMeasure: "",
            tagId: "",
            variants: [],
        });
    }, [isOpen]);

    return (
        <>
            <Modal
                isDismissable={false}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="xl"
                scrollBehavior="inside"
                disableAnimation
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <div className="flex flex-col gap-2">
                                    <span className="text-lg font-semibold">
                                        Add Item{" "}
                                        <span className="font-extrabold">
                                            {itemHasVariant
                                                ? "with variant"
                                                : "without variant"}
                                        </span>
                                    </span>
                                    <span className="text-sm text-default-500 italic">
                                        Changes here are temporary. The item
                                        will be officially added only when you
                                        click the{" "}
                                        <span className="text-success-500 font-semibold">
                                            Add Item
                                        </span>{" "}
                                        button below.
                                    </span>
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <span className="text-lg font-semibold">
                                    Set Item Details
                                </span>
                                <ItemInitialDetail
                                    item={item}
                                    setItem={setItem}
                                    isSubmitted={isSubmitted}
                                />

                                <div className="flex flex-col gap-3 mt-2">
                                    <Button
                                        startContent={
                                            <PhotoIcon className="w-5" />
                                        }
                                        className="w-full"
                                    >
                                        Add Photos
                                    </Button>

                                    {(itemHasVariant ||
                                        item.variants.length === 0) && (
                                        <Button
                                            startContent={
                                                itemHasVariant ? (
                                                    <PlusIcon className="w-5" />
                                                ) : (
                                                    <RightArrow className="w-5" />
                                                )
                                            }
                                            className="w-full"
                                            color="success"
                                            onPress={() => {
                                                setIsSubmitted(true);
                                                if (validate()) {
                                                    onOpenAddVar();
                                                } else {
                                                    addToast({
                                                        title: "Empty Required Fields.",
                                                        description:
                                                            "Please fill in all required fields.",
                                                        timeout: 3000,
                                                        color: "danger",
                                                        shouldShowTimeoutProgress:
                                                            true,
                                                    });
                                                }
                                            }}
                                        >
                                            {itemHasVariant
                                                ? "Add Variant"
                                                : item.variants.length === 0
                                                  ? "Proceed"
                                                  : "Edit Details"}
                                        </Button>
                                    )}
                                </div>
                                <div>
                                    {itemHasVariant && (
                                        <>
                                            <Divider className="my-4" />
                                            <p className="text-base font-semibold mb-2">
                                                Variant List
                                            </p>
                                        </>
                                    )}

                                    <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2">
                                        <VariantList
                                            itemHasVariant={itemHasVariant}
                                            item={item}
                                            setItem={setItem}
                                        />
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter className="justify-between items-center">
                                <span className="text-sm text-default-500 italic">
                                    <span className="text-red-500">*</span>{" "}
                                    Required field
                                </span>

                                <div className="flex gap-2">
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={onClose}
                                    >
                                        Cancel
                                    </Button>
                                    <Button color="success">Add Item</Button>
                                </div>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <AddVariantModal
                isOpenAddVar={isOpenAddVar}
                onOpenChangeAddVar={onOpenChangeAddVar}
                itemHasVariant={itemHasVariant}
                itemUnitOfMeasure={item.unitOfMeasure}
                onAddVariant={(newVariant) =>
                    setItem((prev) => ({
                        ...prev,
                        variants: [
                            ...prev.variants,
                            {
                                ...newVariant,
                                name: itemHasVariant
                                    ? newVariant.name
                                    : prev.name,
                            },
                        ],
                    }))
                }
            />
        </>
    );
}
