import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
} from "@heroui/react";
import { Category } from "@/data/supabase/useFetchCategories";

export function EditCatModal({
    isOpenEditCat,
    onOpenChangeEditCat,
    selectedCategory,
}: {
    isOpenEditCat: boolean;
    onOpenChangeEditCat: () => void;
    selectedCategory: Category | null;
}) {
    return (
        <Modal
            isOpen={isOpenEditCat}
            onOpenChange={onOpenChangeEditCat}
            disableAnimation
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Edit Category
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                placeholder="Edit Category Name"
                                defaultValue={selectedCategory?.category_name}
                            />
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
                                Save
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
