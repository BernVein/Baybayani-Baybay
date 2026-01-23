import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
} from "@heroui/react";

export function EditCatModal({
    isOpenEditCat,
    onOpenChangeEditCat,
}: {
    isOpenEditCat: boolean;
    onOpenChangeEditCat: () => void;
}) {
    return (
        <Modal isOpen={isOpenEditCat} onOpenChange={onOpenChangeEditCat}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Edit Category
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                placeholder="Edit Category Name"
                                defaultValue="Category Name 1"
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
