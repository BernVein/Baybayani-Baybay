import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    addToast,
} from "@heroui/react";
import { ExclamationCircle } from "@/components/icons";
import { Tag } from "@/data/supabase/useFetchTags";
import { deleteTag } from "@/data/supabase/Customer/Products/deleteTag";
import { useState } from "react";

export function DeleteTagModal({
    isOpenDeleteTag,
    onOpenChangeDeleteTag,
    selectedTag,
    refetch,
}: {
    isOpenDeleteTag: boolean;
    onOpenChangeDeleteTag: () => void;
    selectedTag: Tag | null;
    refetch: () => Promise<void>;
}) {
    const [loading, setLoading] = useState(false);
    const handleDelete = async () => {
        if (!selectedTag) return;

        try {
            setLoading(true);
            const result = await deleteTag(selectedTag.tag_id);

            if (!result.success) {
                if (result.error === "TAG_IN_USE") {
                    addToast({
                        title: "Tag in use",
                        description: `There are ${result.count} item/s with this tag. Reassign items with this tag`,
                        color: "danger",
                        shouldShowTimeoutProgress: true,
                    });
                    onOpenChangeDeleteTag();
                } else {
                    addToast({
                        title: "Error",
                        description: result.error,
                        color: "danger",
                        shouldShowTimeoutProgress: true,
                    });
                }
                setLoading(false);
                return;
            }
            setLoading(false);
            onOpenChangeDeleteTag();
            addToast({
                title: "Success",
                description: `Tag ${selectedTag.tag_name} deleted successfully!`,
                color: "success",
                shouldShowTimeoutProgress: true,
            });
            refetch();
        } catch (err) {
            setLoading(false);
            addToast({
                title: "Error",
                description: err as string,
                color: "danger",
                shouldShowTimeoutProgress: true,
            });
        }
    };

    return (
        <Modal
            isOpen={isOpenDeleteTag}
            onOpenChange={onOpenChangeDeleteTag}
            size="sm"
            disableAnimation
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col items-center gap-2 text-center">
                            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-danger/10 text-danger">
                                <ExclamationCircle className="w-6 h-6" />
                            </div>
                            <h2 className="text-lg font-semibold text-danger">
                                Delete Tag
                            </h2>
                        </ModalHeader>

                        <ModalBody className="text-center text-default-600">
                            <p className="text-sm leading-relaxed">
                                Are you sure you want to remove{" "}
                                <span className="font-semibold text-default-800">
                                    {selectedTag?.tag_name}
                                </span>
                            </p>
                            <p className="text-xs text-default-500 mt-1">
                                This action cannot be undone.
                            </p>
                        </ModalBody>

                        <ModalFooter className="flex justify-center gap-3 pt-4">
                            <Button
                                variant="flat"
                                color="default"
                                className="px-6"
                                onPress={onClose}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="danger"
                                className="px-6 font-semibold"
                                onPress={handleDelete}
                                isLoading={loading}
                            >
                                Delete
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
