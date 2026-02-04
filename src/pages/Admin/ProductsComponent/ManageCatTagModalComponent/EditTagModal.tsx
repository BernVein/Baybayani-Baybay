import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
} from "@heroui/react";
import { Tag } from "@/data/supabase/useFetchTags";

export function EditTagModal({
    isOpenEditTag,
    onOpenChangeEditTag,
    selectedTag,
}: {
    isOpenEditTag: boolean;
    onOpenChangeEditTag: () => void;
    selectedTag: Tag | null;
}) {
    return (
        <Modal
            isOpen={isOpenEditTag}
            onOpenChange={onOpenChangeEditTag}
            disableAnimation
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Edit Tag
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                placeholder="Edit Tag Name"
                                defaultValue={selectedTag?.tag_name}
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
