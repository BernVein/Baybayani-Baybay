import { ChangeEvent, FormEvent } from "react";
import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Image,
} from "@heroui/react";
import { TrashIcon, CursorIcon } from "@/components/icons";

export function AddPhotoModal({
    isOpen,
    onOpenChange,
    images,
    setImages,
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    images: (File | null)[];
    setImages: React.Dispatch<React.SetStateAction<(File | null)[]>>;
}) {
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
        console.log(images);
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
                                            <label className="flex flex-col items-center h-32 justify-center border border-dashed border-default-300 rounded-lg p-3 cursor-pointer hover:border-success">
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
                                                    <div className="flex flex-row items-center">
                                                        <CursorIcon className="w-7" />
                                                        <span className="text-sm text-default-500">
                                                            Select image{" "}
                                                            {index + 1}
                                                        </span>
                                                    </div>
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
                                                    className="absolute top-2 right-2 z-10"
                                                    onPress={() =>
                                                        handleRemoveImage(index)
                                                    }
                                                    startContent={
                                                        <TrashIcon className="w-5" />
                                                    }
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </ModalBody>

                            <ModalFooter>
                                <Button
                                    color="success"
                                    type="submit"
                                    onPress={onClose}
                                >
                                    Confirm
                                </Button>
                            </ModalFooter>
                        </form>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
