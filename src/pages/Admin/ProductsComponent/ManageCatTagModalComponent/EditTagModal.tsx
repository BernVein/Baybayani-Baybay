import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    addToast,
} from "@heroui/react";
import { Tag } from "@/data/supabase/useFetchTags";
import { updateTag } from "@/data/supabase/Customer/Products/updateTag";
import { useState, useEffect } from "react";

export function EditTagModal({
    isOpenEditTag,
    onOpenChangeEditTag,
    selectedTag,
    refetch,
}: {
    isOpenEditTag: boolean;
    onOpenChangeEditTag: () => void;
    selectedTag: Tag | null;
    refetch: () => Promise<void>;
}) {
    const [tagName, setTagName] = useState(selectedTag?.tag_name || "");
    const [loading, setLoading] = useState(false);
    console.log(tagName, typeof tagName);
    useEffect(() => {
        setTagName(selectedTag?.tag_name || "");
    }, [selectedTag]);

    const handleUpdate = async () => {
        if (!selectedTag) return;

        setLoading(true);

        try {
            const result = await updateTag({
                tag_id: selectedTag.tag_id,
                tag_name: tagName,
            });

            if (!result.success) {
                addToast({
                    title: "Error",
                    description: result.error,
                    color: "danger",
                    shouldShowTimeoutProgress: true,
                });
                setLoading(false);
                return;
            }

            addToast({
                title: "Success",
                description: `Tag "${tagName}" updated successfully!`,
                color: "success",
                shouldShowTimeoutProgress: true,
            });

            onOpenChangeEditTag();
            await refetch();
        } catch (err: any) {
            addToast({
                title: "Error",
                description: err.message || String(err),
                color: "danger",
                shouldShowTimeoutProgress: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpenEditTag}
            onOpenChange={onOpenChangeEditTag}
            disableAnimation
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>Edit Tag</ModalHeader>
                        <ModalBody>
                            <Input
                                placeholder="Edit Tag Name"
                                defaultValue={selectedTag?.tag_name}
                                onValueChange={setTagName}
                            />
                        </ModalBody>
                        <ModalFooter className="flex gap-2">
                            <Button
                                color="danger"
                                variant="light"
                                onPress={onClose}
                            >
                                Close
                            </Button>
                            <Button
                                color="success"
                                onPress={handleUpdate}
                                isLoading={loading}
                                isDisabled={loading || tagName.trim() === ""}
                            >
                                Update
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
