import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  SelectItem,
} from "@heroui/react";

import { SoloUserIcon, UserIcon, KeyIcon, PhotoIcon } from "@/components/icons";
import ModalAwareSelect from "@/lib/ModalAwareSelect";

export function AddUserModal({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  return (
    <>
      <Modal
        disableAnimation
        isDismissable={false}
        isOpen={isOpen}
        scrollBehavior="inside"
        size="xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add User
              </ModalHeader>
              <ModalBody>
                <span className="text-lg font-semibold">User Detail</span>
                <div className="flex flex-row gap-2 items-center">
                  <Input
                    className="w-1/2"
                    label="Name"
                    labelPlacement="outside"
                  />
                  <Input
                    className="w-1/2"
                    label="Username"
                    labelPlacement="outside"
                  />
                </div>

                <div className="flex flex-row gap-2 items-center">
                  <ModalAwareSelect
                    className="w-1/2"
                    label="Role"
                    labelPlacement="outside"
                  >
                    <SelectItem
                      key="1"
                      startContent={<SoloUserIcon className="w-5" />}
                    >
                      Individual
                    </SelectItem>
                    <SelectItem
                      key="2"
                      startContent={<UserIcon className="w-5" />}
                    >
                      Cooperative
                    </SelectItem>
                    <SelectItem
                      key="3"
                      startContent={<KeyIcon className="w-5" />}
                    >
                      Admin
                    </SelectItem>
                  </ModalAwareSelect>
                  <ModalAwareSelect
                    className="w-1/2"
                    label="Status"
                    labelPlacement="outside"
                  >
                    <SelectItem key="1">Active</SelectItem>
                    <SelectItem key="2">Suspended</SelectItem>
                    <SelectItem key="3">Pending</SelectItem>
                  </ModalAwareSelect>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <Button
                    className="mt-2 w-full"
                    startContent={<PhotoIcon className="w-5" />}
                  >
                    Add Profile
                  </Button>
                  <Button
                    className="mt-2 w-full"
                    startContent={<PhotoIcon className="w-5" />}
                  >
                    Add Valid ID
                  </Button>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="success" onPress={onClose}>
                  Update
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
