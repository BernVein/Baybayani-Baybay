import { ChangeEvent, FormEvent, DragEvent } from "react";
import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Image as HeroImage, // rename to avoid conflict
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
    images: (File | null | string)[];
    setImages: React.Dispatch<React.SetStateAction<(File | null | string)[]>>;
}) {
    // Helper: crop/resize and always square
    const processImage = (file: File): Promise<File> => {
        return new Promise((resolve, reject) => {
            const imgEl = new window.Image();
            const reader = new FileReader();

            reader.onload = (e) => {
                imgEl.src = e.target?.result as string;
            };
            reader.onerror = (err) => reject(err);

            imgEl.onload = () => {
                const size = 540;
                const canvas = document.createElement("canvas");

                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext("2d");

                if (!ctx) return reject("Cannot get canvas context");

                const minSide = Math.min(imgEl.width, imgEl.height);

                // Center crop coordinates
                const sx = (imgEl.width - minSide) / 2;
                const sy = (imgEl.height - minSide) / 2;

                // Fill white background first (for padding)
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, size, size);

                // Draw image
                ctx.drawImage(
                    imgEl,
                    sx,
                    sy,
                    minSide,
                    minSide,
                    0,
                    0,
                    size,
                    size,
                );

                canvas.toBlob(
                    (blob) => {
                        if (!blob) return reject("Canvas is empty");
                        const newFile = new File([blob], file.name, {
                            type: "image/jpeg",
                        });

                        resolve(newFile);
                    },
                    "image/jpeg",
                    0.9,
                );
            };

            reader.readAsDataURL(file);
        });
    };

    const handleFileChange =
        (index: number) => async (e: ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];

            if (!file) return;

            const processed = await processImage(file);

            setImages((prev) => {
                const next = [...prev];

                next[index] = processed;

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

    const handleDrop =
        (index: number) => async (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];

            if (!file) return;

            const processed = await processImage(file);

            setImages((prev) => {
                const next = [...prev];

                next[index] = processed;

                return next;
            });
        };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log(images);
    };

    return (
        <Modal
            disableAnimation
            isOpen={isOpen}
            scrollBehavior="inside"
            size="lg"
            onOpenChange={onOpenChange}
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
                                    <div
                                        key={index}
                                        className="relative w-full"
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop(index)}
                                    >
                                        <label className="flex flex-col items-center h-32 justify-center border border-dashed border-default-300 rounded-lg p-3 cursor-pointer hover:border-success">
                                            {file ? (
                                                <HeroImage
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-32 object-cover"
                                                    radius="lg"
                                                    shadow="sm"
                                                    src={
                                                        typeof file === "string"
                                                            ? file
                                                            : URL.createObjectURL(
                                                                  file,
                                                              )
                                                    }
                                                />
                                            ) : (
                                                <div className="flex flex-row items-center">
                                                    <CursorIcon className="w-7" />
                                                    <span className="text-sm text-default-500">
                                                        Select image {index + 1}
                                                    </span>
                                                </div>
                                            )}

                                            <input
                                                accept="image/*"
                                                className="hidden"
                                                type="file"
                                                onChange={handleFileChange(
                                                    index,
                                                )}
                                            />
                                        </label>

                                        {file && (
                                            <Button
                                                isIconOnly
                                                className="absolute top-2 right-2 z-10"
                                                color="danger"
                                                size="sm"
                                                startContent={
                                                    <TrashIcon className="w-5" />
                                                }
                                                variant="solid"
                                                onPress={() =>
                                                    handleRemoveImage(index)
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
    );
}
