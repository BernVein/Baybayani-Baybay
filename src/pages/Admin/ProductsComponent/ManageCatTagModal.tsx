import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Listbox,
    ListboxItem,
} from "@heroui/react";
import { PencilIcon, PlusIcon, TrashIcon } from "@/components/icons";
export function ManageCatTagModal({
    isOpen,
    onOpenChange,
}: {
    isOpen: boolean;
    onOpenChange: () => void;
}) {
    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Manage Options
                            </ModalHeader>
                            <ModalBody className="flex flex-row gap-2 items-start">
                                <div className="flex flex-col gap-2 items-center">
                                    <div className="flex flex-row gap-2">
                                        <Input placeholder="Category" />
                                        <Button
                                            isIconOnly
                                            color="success"
                                            variant="light"
                                            startContent={
                                                <PlusIcon className="w-5" />
                                            }
                                        />
                                    </div>
                                    <Listbox aria-label="Actions">
                                        <ListboxItem
                                            key="1"
                                            className="hover:bg-transparent data-[hover=true]:bg-transparent"
                                        >
                                            <div className="flex justify-between items-center w-full">
                                                <span>Vegetable</span>
                                                <div className="flex flex-row items-center">
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="light"
                                                    >
                                                        <PencilIcon className="w-4" />
                                                    </Button>
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        color="danger"
                                                        variant="light"
                                                    >
                                                        <TrashIcon className="w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </ListboxItem>

                                        <ListboxItem
                                            key="2"
                                            className="hover:bg-transparent data-[hover=true]:bg-transparent"
                                        >
                                            <div className="flex justify-between items-center w-full">
                                                <span>Grain</span>
                                                <div className="flex flex-row items-center">
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="light"
                                                    >
                                                        <PencilIcon className="w-4" />
                                                    </Button>
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        color="danger"
                                                        variant="light"
                                                    >
                                                        <TrashIcon className="w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </ListboxItem>
                                        <ListboxItem
                                            key="3"
                                            className="hover:bg-transparent data-[hover=true]:bg-transparent"
                                        >
                                            <div className="flex justify-between items-center w-full">
                                                <span>Fruit</span>
                                                <div className="flex flex-row items-center">
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="light"
                                                    >
                                                        <PencilIcon className="w-4" />
                                                    </Button>
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        color="danger"
                                                        variant="light"
                                                    >
                                                        <TrashIcon className="w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </ListboxItem>
                                        <ListboxItem
                                            key="4"
                                            className="hover:bg-transparent data-[hover=true]:bg-transparent"
                                        >
                                            <div className="flex justify-between items-center w-full">
                                                <span>Poultry</span>
                                                <div className="flex flex-row items-center">
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="light"
                                                    >
                                                        <PencilIcon className="w-4" />
                                                    </Button>
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        color="danger"
                                                        variant="light"
                                                    >
                                                        <TrashIcon className="w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </ListboxItem>
                                        <ListboxItem
                                            key="5"
                                            className="hover:bg-transparent data-[hover=true]:bg-transparent"
                                        >
                                            <div className="flex justify-between items-center w-full">
                                                <span>Spice</span>
                                                <div className="flex flex-row items-center">
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="light"
                                                    >
                                                        <PencilIcon className="w-4" />
                                                    </Button>
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        color="danger"
                                                        variant="light"
                                                    >
                                                        <TrashIcon className="w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </ListboxItem>
                                    </Listbox>
                                </div>

                                <div className="flex flex-col gap-2 items-center">
                                    <div className="flex flex-row gap-2">
                                        <Input placeholder="Tags" />
                                        <Button
                                            isIconOnly
                                            color="success"
                                            variant="light"
                                            startContent={
                                                <PlusIcon className="w-5" />
                                            }
                                        />
                                    </div>
                                    <Listbox aria-label="Actions">
                                        <ListboxItem
                                            key="1"
                                            className="hover:bg-transparent data-[hover=true]:bg-transparent"
                                        >
                                            <div className="flex justify-between items-center w-full">
                                                <span>Fresh</span>
                                                <div className="flex flex-row items-center">
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="light"
                                                    >
                                                        <PencilIcon className="w-4" />
                                                    </Button>
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        color="danger"
                                                        variant="light"
                                                    >
                                                        <TrashIcon className="w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </ListboxItem>

                                        <ListboxItem
                                            key="2"
                                            className="hover:bg-transparent data-[hover=true]:bg-transparent"
                                        >
                                            <div className="flex justify-between items-center w-full">
                                                <span>Price Drop</span>
                                                <div className="flex flex-row items-center">
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="light"
                                                    >
                                                        <PencilIcon className="w-4" />
                                                    </Button>
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        color="danger"
                                                        variant="light"
                                                    >
                                                        <TrashIcon className="w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </ListboxItem>
                                    </Listbox>
                                </div>
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
        </>
    );
}
