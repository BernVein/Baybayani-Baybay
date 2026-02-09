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
import { useState, useEffect } from "react";

import { Tag } from "@/data/supabase/useFetchTags";
import { updateTag } from "@/data/supabase/Admin/Products/updateTag";

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
      disableAnimation
      isOpen={isOpenEditTag}
      onOpenChange={onOpenChangeEditTag}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Edit Tag Name</ModalHeader>
            <ModalBody>
              <Input
                defaultValue={selectedTag?.tag_name}
                placeholder="Edit Tag Name"
                onValueChange={setTagName}
              />
            </ModalBody>
            <ModalFooter className="flex gap-2">
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                color="success"
                isDisabled={loading || tagName.trim() === ""}
                isLoading={loading}
                onPress={handleUpdate}
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
