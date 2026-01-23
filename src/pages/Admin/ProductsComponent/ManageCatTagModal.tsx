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
    ListboxSection,
    useDisclosure,
} from "@heroui/react";
import { PencilIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { EditCatModal } from "@/pages/Admin/ProductsComponent/ManageCatTagModalComponent/EditCatModal";
import { DeleteCatModal } from "@/pages/Admin/ProductsComponent/ManageCatTagModalComponent/DeleteCatModal";
import { EditTagModal } from "@/pages/Admin/ProductsComponent/ManageCatTagModalComponent/EditTagModal";
import { DeleteTagModal } from "@/pages/Admin/ProductsComponent/ManageCatTagModalComponent/DeleteTagModal";

export function ManageCatTagModal({
    isOpen,
    onOpenChange,
}: {
    isOpen: boolean;
    onOpenChange: () => void;
}) {
    const {
        isOpen: isOpenEditCat,
        onOpen: onOpenEditCat,
        onOpenChange: onOpenChangeEditCat,
    } = useDisclosure();
    const {
        isOpen: isOpenDeleteCat,
        onOpen: onOpenDeleteCat,
        onOpenChange: onOpenChangeDeleteCat,
    } = useDisclosure();
    const {
        isOpen: isOpenEditTag,
        onOpen: onOpenEditTag,
        onOpenChange: onOpenChangeEditTag,
    } = useDisclosure();
    const {
        isOpen: isOpenDeleteTag,
        onOpen: onOpenDeleteTag,
        onOpenChange: onOpenChangeDeleteTag,
    } = useDisclosure();
    return (
        <>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                scrollBehavior="inside"
                size="lg"
            >
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
                                        <ListboxSection title="Categories">
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
                                                            onPress={
                                                                onOpenEditCat
                                                            }
                                                        >
                                                            <PencilIcon className="w-4" />
                                                        </Button>
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            color="danger"
                                                            variant="light"
                                                            onPress={
                                                                onOpenDeleteCat
                                                            }
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
                                                            onPress={
                                                                onOpenEditCat
                                                            }
                                                        >
                                                            <PencilIcon className="w-4" />
                                                        </Button>
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            color="danger"
                                                            variant="light"
                                                            onPress={
                                                                onOpenDeleteCat
                                                            }
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
                                                            onPress={
                                                                onOpenEditCat
                                                            }
                                                        >
                                                            <PencilIcon className="w-4" />
                                                        </Button>
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            color="danger"
                                                            variant="light"
                                                            onPress={
                                                                onOpenDeleteCat
                                                            }
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
                                                            onPress={
                                                                onOpenEditCat
                                                            }
                                                        >
                                                            <PencilIcon className="w-4" />
                                                        </Button>
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            color="danger"
                                                            variant="light"
                                                            onPress={
                                                                onOpenDeleteCat
                                                            }
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
                                                            onPress={
                                                                onOpenEditCat
                                                            }
                                                        >
                                                            <PencilIcon className="w-4" />
                                                        </Button>
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            color="danger"
                                                            variant="light"
                                                            onPress={
                                                                onOpenDeleteCat
                                                            }
                                                        >
                                                            <TrashIcon className="w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </ListboxItem>
                                        </ListboxSection>
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
                                        <ListboxSection title="Tags">
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
                                                            onPress={
                                                                onOpenEditTag
                                                            }
                                                        >
                                                            <PencilIcon className="w-4" />
                                                        </Button>
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            color="danger"
                                                            variant="light"
                                                            onPress={
                                                                onOpenDeleteTag
                                                            }
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
                                                            onPress={
                                                                onOpenEditTag
                                                            }
                                                        >
                                                            <PencilIcon className="w-4" />
                                                        </Button>
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            color="danger"
                                                            variant="light"
                                                            onPress={
                                                                onOpenDeleteTag
                                                            }
                                                        >
                                                            <TrashIcon className="w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </ListboxItem>
                                        </ListboxSection>
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
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <EditCatModal
                isOpenEditCat={isOpenEditCat}
                onOpenChangeEditCat={onOpenChangeEditCat}
            />
            <DeleteCatModal
                isOpenDeleteCat={isOpenDeleteCat}
                onOpenChangeDeleteCat={onOpenChangeDeleteCat}
            />
            <EditTagModal
                isOpenEditTag={isOpenEditTag}
                onOpenChangeEditTag={onOpenChangeEditTag}
            />
            <DeleteTagModal
                isOpenDeleteTag={isOpenDeleteTag}
                onOpenChangeDeleteTag={onOpenChangeDeleteTag}
            />
        </>
    );
}
