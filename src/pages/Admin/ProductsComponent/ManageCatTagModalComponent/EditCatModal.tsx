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

import { Category } from "@/data/supabase/useFetchCategories";
import { updateCategory } from "@/data/supabase/Admin/Products/updateCategory";
export function EditCatModal({
  isOpenEditCat,
  onOpenChangeEditCat,
  selectedCategory,
  refetch,
}: {
  isOpenEditCat: boolean;
  onOpenChangeEditCat: () => void;
  selectedCategory: Category | null;
  refetch: () => Promise<void>;
}) {
  const [categoryName, setCategoryName] = useState(
    selectedCategory?.category_name || "",
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCategoryName(selectedCategory?.category_name || "");
  }, [selectedCategory]);

  const handleUpdate = async () => {
    if (!selectedCategory) return;

    setLoading(true);

    try {
      const result = await updateCategory({
        category_id: selectedCategory.category_id,
        category_name: categoryName,
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
        description: `Category "${categoryName}" updated successfully!`,
        color: "success",
        shouldShowTimeoutProgress: true,
      });

      onOpenChangeEditCat();
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
      isOpen={isOpenEditCat}
      onOpenChange={onOpenChangeEditCat}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Edit Category Name
            </ModalHeader>
            <ModalBody>
              <Input
                defaultValue={selectedCategory?.category_name}
                placeholder="Edit Category Name"
                onValueChange={setCategoryName}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                color="success"
                isDisabled={loading || categoryName.trim() === ""}
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
