import { useState, ChangeEvent, FormEvent } from "react";
import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Image,
} from "@heroui/react";
import { TrashIcon } from "@/components/icons";

type ImageSlot = File | null;

export function AddPhotoModal({
    isOpen,
    onOpenChange,
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [images, setImages] = useState<ImageSlot[]>([null, null, null, null]);

    const handleFileChange =
        (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0] ?? null;
            if (!file) return;
            setImages((prev) => {
                const next = [...prev];
                next[index] = file;
                return next;
            });
        };

    const handleRemoveImage = (index: number) => {
        setImages((prev) => {
            const next = [...prev];
            next[index] = null;
            return next;
        });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // Here you can upload `images` with your own API logic.
        // e.g. const formData = new FormData(); images.forEach(...)
        console.log("Uploading images:", images);
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="lg"
                scrollBehavior="inside"
                disableAnimation
            >
                <ModalContent>
                    {(onClose) => (
                        <form onSubmit={handleSubmit}>
                            <ModalHeader className="flex flex-col gap-1">
                                Upload Item Images
                            </ModalHeader>

                            <ModalBody>
                                <div className="grid grid-cols-2 gap-4">
                                    {images.map((file, index) => (
                                        <div className="relative w-full">
                                            <label className="flex flex-col items-center justify-center border border-dashed border-default-300 rounded-lg p-3 cursor-pointer hover:border-success">
                                                {file ? (
                                                    <Image
                                                        src={URL.createObjectURL(
                                                            file,
                                                        )}
                                                        alt={`Preview ${index + 1}`}
                                                        radius="lg"
                                                        shadow="sm"
                                                        className="w-full h-32 object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-sm text-default-500">
                                                        Click to select image{" "}
                                                        {index + 1}
                                                    </span>
                                                )}

                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleFileChange(
                                                        index,
                                                    )}
                                                />
                                            </label>

                                            {file && (
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    color="danger"
                                                    variant="solid"
                                                    className="absolute top-1 right-1 z-10"
                                                    onPress={() =>
                                                        handleRemoveImage(index)
                                                    }
                                                >
                                                    <TrashIcon className="w-5" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </ModalBody>

                            <ModalFooter>
                                <Button variant="flat" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="success" type="submit">
                                    Add
                                </Button>
                            </ModalFooter>
                        </form>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
