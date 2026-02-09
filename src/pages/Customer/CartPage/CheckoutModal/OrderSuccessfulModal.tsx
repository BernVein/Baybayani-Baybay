import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Link,
} from "@heroui/react";

import { BaybayaniLogo, OrdersIcon } from "@/components/icons";
export function OrderSuccessfulModal({
  isOpenOrderSuccessful,
  onOpenChangeOrderSuccessful,
}: {
  isOpenOrderSuccessful: boolean;
  onOpenChangeOrderSuccessful: (isOpen: boolean) => void;
}) {
  return (
    <Modal
      disableAnimation
      isOpen={isOpenOrderSuccessful}
      onOpenChange={onOpenChangeOrderSuccessful}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Order Confirmation
            </ModalHeader>
            <ModalBody className="flex flex-col items-center justify-center gap-4">
              <BaybayaniLogo className="w-30" />

              <p className="text-lg font-semibold">Order confirmed</p>
              <p className="text-sm text-default-500">
                We’re currently placing your order
              </p>
            </ModalBody>

            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Link href="/orders">
                <Button
                  color="success"
                  startContent={<OrdersIcon className="w-5" />}
                  onPress={onClose}
                >
                  Go to orders
                </Button>
              </Link>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
