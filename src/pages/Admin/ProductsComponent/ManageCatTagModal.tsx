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
    Skeleton,
} from "@heroui/react";
import { PencilIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { EditCatModal } from "@/pages/Admin/ProductsComponent/ManageCatTagModalComponent/EditCatModal";
import { DeleteCatModal } from "@/pages/Admin/ProductsComponent/ManageCatTagModalComponent/DeleteCatModal";
import { EditTagModal } from "@/pages/Admin/ProductsComponent/ManageCatTagModalComponent/EditTagModal";
import { DeleteTagModal } from "@/pages/Admin/ProductsComponent/ManageCatTagModalComponent/DeleteTagModal";
import { useFetchCategories } from "@/data/supabase/useFetchCategories";
import { useFetchTags } from "@/data/supabase/useFetchTags";

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

    const { categories, loading: catLoading } = useFetchCategories();
    const { tags, loading: tagLoading } = useFetchTags();

    const ListSkeleton = () => (
        <div className="flex justify-between items-center w-full py-1">
            <Skeleton className="h-4 w-24 rounded-lg" />
            <div className="flex gap-2">
                <Skeleton className="h-6 w-6 rounded-md" />
                <Skeleton className="h-6 w-6 rounded-md" />
            </div>
        </div>
    );

    return (
        <>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                scrollBehavior="inside"
                size="lg"
                disableAnimation
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
                                            {catLoading ? (
                                                <>
                                                    <ListboxItem key="sk1">
                                                        <ListSkeleton />
                                                    </ListboxItem>
                                                    <ListboxItem key="sk2">
                                                        <ListSkeleton />
                                                    </ListboxItem>
                                                    <ListboxItem key="sk3">
                                                        <ListSkeleton />
                                                    </ListboxItem>
                                                </>
                                            ) : (
                                                categories.map((cat) => (
                                                    <ListboxItem
                                                        key={cat.category_id}
                                                        className="hover:bg-transparent data-[hover=true]:bg-transparent"
                                                    >
                                                        <div className="flex justify-between items-center w-full">
                                                            <span>
                                                                {
                                                                    cat.category_name
                                                                }
                                                            </span>
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
                                                ))
                                            )}
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
                                            {tagLoading ? (
                                                <>
                                                    <ListboxItem key="tsk1">
                                                        <ListSkeleton />
                                                    </ListboxItem>
                                                    <ListboxItem key="tsk2">
                                                        <ListSkeleton />
                                                    </ListboxItem>
                                                </>
                                            ) : (
                                                tags.map((tag) => (
                                                    <ListboxItem
                                                        key={tag.tag_id}
                                                        className="hover:bg-transparent data-[hover=true]:bg-transparent"
                                                    >
                                                        <div className="flex justify-between items-center w-full">
                                                            <span>
                                                                {tag.tag_name}
                                                            </span>
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
                                                ))
                                            )}
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
