import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";

import { ExclamationCircle } from "@/components/icons";
import { Item } from "@/model/Item";

export function DeleteVariantModal({
  itemHasVariant,
  isOpenDeleteVar,
  onOpenChangeDeleteVar,
  selectedVarIndex,
  selectedVarName,
  setSelectedVarIndex,
  setItem,
}: {
  itemHasVariant: boolean;
  isOpenDeleteVar: boolean;
  onOpenChangeDeleteVar: (open: boolean) => void;
  selectedVarIndex: number | null;
  selectedVarName: string | null;
  setSelectedVarIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setItem: React.Dispatch<React.SetStateAction<Item>>;
}) {
  return (
    <>
      <Modal
        disableAnimation
        isOpen={isOpenDeleteVar}
        size="sm"
        onOpenChange={onOpenChangeDeleteVar}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col items-center gap-2 text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-danger/10 text-danger">
                  <ExclamationCircle className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-semibold text-danger">
                  Confirm Delete
                </h2>
              </ModalHeader>

              <ModalBody className="text-center text-default-600">
                <p className="text-sm leading-relaxed">
                  {itemHasVariant
                    ? `Delete ${selectedVarName} from the variant list?`
                    : "Delete item information?"}
                </p>
                <p className="text-xs text-default-500 mt-1">
                  This action cannot be undone.
                </p>
              </ModalBody>

              <ModalFooter className="flex justify-center gap-3 pt-4">
                <Button
                  className="px-6"
                  color="default"
                  variant="flat"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  className="px-6 font-semibold"
                  color="danger"
                  onPress={() => {
                    if (selectedVarIndex !== null) {
                      setItem((prev) => ({
                        ...prev,
                        item_variants: prev.item_variants.filter(
                          (_, i) => i !== selectedVarIndex,
                        ),
                      }));
                    }
                    onClose();
                    setSelectedVarIndex(null);
                  }}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
