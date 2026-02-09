import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

import { ExclamationCircle } from "@/components/icons";

export function CloseWarningModal({
  isOpenWarning,
  onOpenChangeWarning,
  onConfirmClose,
}: {
  isOpenWarning: boolean;
  onOpenChangeWarning: (open: boolean) => void;
  onConfirmClose: () => void;
}) {
  return (
    <>
      <Modal
        disableAnimation
        isOpen={isOpenWarning}
        size="sm"
        onOpenChange={onOpenChangeWarning}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col items-center gap-2 text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-danger/10 text-danger">
                  <ExclamationCircle className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-semibold text-danger">
                  Confirm Exit
                </h2>
              </ModalHeader>

              <ModalBody className="text-center text-default-600">
                <p className="text-sm leading-relaxed">
                  Are you sure you want to exit? All changes will be lost.
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
                    onClose();
                    onConfirmClose();
                  }}
                >
                  Exit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
