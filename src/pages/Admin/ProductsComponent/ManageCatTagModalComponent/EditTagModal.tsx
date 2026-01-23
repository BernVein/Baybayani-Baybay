import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
} from "@heroui/react";

export function EditTagModal({
    isOpenEditTag,
    onOpenChangeEditTag,
}: {
    isOpenEditTag: boolean;
    onOpenChangeEditTag: () => void;
}) {
    return (
        <Modal isOpen={isOpenEditTag} onOpenChange={onOpenChangeEditTag}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Edit Tag
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                placeholder="Edit Tag Name"
                                defaultValue="Tag Name 1"
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
