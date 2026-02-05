import { PhotoIcon } from "@/components/icons";
import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Divider,
} from "@heroui/react";
import { ItemInitialDetail } from "@/pages/Admin/ProductsComponent/ProductTableComponent/AddItemModalComponent/AddVariantModalComponent/ItemInitialDetail";
import { AddEditVariantModal } from "@/pages/Admin/ProductsComponent/ProductTableComponent/AddItemModalComponent/AddEditVariantModal";
import { useState, useEffect } from "react";
import { ItemDB } from "@/model/db/additem";
import { VariantList } from "@/pages/Admin/ProductsComponent/ProductTableComponent/AddItemModalComponent/VariantList";
import { CloseWarningModal } from "@/pages/Admin/ProductsComponent/ProductTableComponent/AddItemModalComponent/CloseWarningModal";
import { AddVariantButton } from "@/pages/Admin/ProductsComponent/ProductTableComponent/AddItemModalComponent/AddVariantButton";
import { AddPhotoModal } from "@/pages/Admin/ProductsComponent/ProductTableComponent/AddItemModalComponent/AddPhotoModal";

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

    const {
        isOpen: isOpenWarning,
        onOpen: onOpenWarning,
        onOpenChange: onOpenChangeWarning,
    } = useDisclosure();

    const {
        isOpen: isOpenPhoto,
        onOpen: onOpenPhoto,
        onOpenChange: onOpenChangePhoto,
    } = useDisclosure();

    const [item, setItem] = useState<ItemDB>({
        name: "",
        categoryId: "",
        shortDescription: "",
        unitOfMeasure: "",
        tagId: "",
        itemImages: [null, null, null, null],
        variants: [],
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const selectedCount = item.itemImages.filter(Boolean).length;

    function validate(): boolean {
        if (!item.name.trim()) return false;
        if (!item.categoryId) return false;
        if (!item.unitOfMeasure.trim()) return false;
        if (selectedCount === 0) return false;
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
            itemImages: [null, null, null, null],
            variants: [],
        });
    }, [isOpen]);

    const isItemPristine = () => {
        const defaultItem: ItemDB = {
            name: "",
            categoryId: "",
            shortDescription: "",
            unitOfMeasure: "",
            tagId: "",
            itemImages: [null, null, null, null],
            variants: [],
        };

        const isDefaultItem =
            item.name === defaultItem.name &&
            item.categoryId === defaultItem.categoryId &&
            item.shortDescription === defaultItem.shortDescription &&
            item.unitOfMeasure === defaultItem.unitOfMeasure &&
            item.tagId === defaultItem.tagId &&
            item.variants.length === 0;

        const noImages = item.itemImages.every((img) => img === null);

        return isDefaultItem && noImages;
    };

    return (
        <>
            <Modal
                isDismissable={false}
                isOpen={isOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        if (!isItemPristine()) {
                            onOpenWarning();
                        } else {
                            onOpenChange(false);
                        }
                    } else {
                        onOpenChange(true);
                    }
                }}
                size="xl"
                scrollBehavior="inside"
                disableAnimation
            >
                <ModalContent>
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
                                    Changes here are temporary. The item will be
                                    officially added only when you click the{" "}
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
                                    startContent={<PhotoIcon className="w-5" />}
                                    className="w-full gap-1"
                                    onPress={onOpenPhoto}
                                    color={
                                        isSubmitted && selectedCount === 0
                                            ? "danger"
                                            : "default"
                                    }
                                >
                                    {isSubmitted && selectedCount === 0
                                        ? "Photo is required"
                                        : "Add Photos"}
                                    {selectedCount > 0 && `(${selectedCount})`}
                                    <span className="text-red-500">*</span>{" "}
                                </Button>

                                {(itemHasVariant ||
                                    item.variants.length === 0) && (
                                    <AddVariantButton
                                        itemHasVariant={itemHasVariant}
                                        item={item}
                                        onOpenAddVar={onOpenAddVar}
                                        setIsSubmitted={setIsSubmitted}
                                        validate={validate}
                                    />
                                )}
                            </div>
                            <div>
                                {itemHasVariant && (
                                    <>
                                        <Divider className="my-4" />
                                        <p className="text-base font-semibold mb-2">
                                            Variant List{" "}
                                            {item.variants.length
                                                ? `(${item.variants.length})`
                                                : ""}
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
                                <span className="text-red-500">*</span> Required
                                field
                            </span>

                            <div className="flex gap-2">
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={() => {
                                        if (!isItemPristine()) onOpenWarning();
                                        else onOpenChange(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color="success"
                                    isDisabled={
                                        itemHasVariant &&
                                        item.variants.length < 2
                                    }
                                >
                                    Add Item
                                </Button>
                            </div>
                        </ModalFooter>
                    </>
                </ModalContent>
            </Modal>
            <AddEditVariantModal
                isOpenAddVar={isOpenAddVar}
                onOpenChangeAddVar={onOpenChangeAddVar}
                itemHasVariant={itemHasVariant}
                itemUnitOfMeasure={item.unitOfMeasure}
                onAddEditVariant={(newVariant) =>
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
                defaultVariant={null}
            />
            <CloseWarningModal
                isOpenWarning={isOpenWarning}
                onOpenChangeWarning={onOpenChangeWarning}
                onConfirmClose={() => {
                    onOpenChange(false);
                }}
            />
            <AddPhotoModal
                isOpen={isOpenPhoto}
                onOpenChange={onOpenChangePhoto}
                images={item.itemImages}
                setImages={(newImages) => {
                    // if newImages is a function (SetStateAction), resolve it
                    const resolved =
                        typeof newImages === "function"
                            ? newImages(item.itemImages)
                            : newImages;

                    setItem((prev) => ({
                        ...prev,
                        itemImages: resolved,
                    }));
                }}
            />
        </>
    );
}
