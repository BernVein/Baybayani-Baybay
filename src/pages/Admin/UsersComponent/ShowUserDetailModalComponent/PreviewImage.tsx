import { Modal, ModalContent, Image, Button, ModalBody } from "@heroui/react";
import { XIcon } from "@/components/icons";

export function PreviewImage({
	isPreviewOpen,
	onPreviewOpenChange,
	selectedImage,
}: {
	isPreviewOpen: boolean;
	onPreviewOpenChange: (isOpen: boolean) => void;
	selectedImage: string;
}) {
	return (
		<Modal
			isOpen={isPreviewOpen}
			onOpenChange={onPreviewOpenChange}
			size="4xl"
			scrollBehavior="inside"
			backdrop="blur"
			hideCloseButton
			className="bg-transparent shadow-none"
		>
			<ModalContent>
				<ModalBody className="p-0 relative flex items-center justify-center">
					<Button
						isIconOnly
						className="absolute top-4 right-4 z-50 bg-background/50 backdrop-blur-md"
						radius="full"
						variant="flat"
						onPress={() => onPreviewOpenChange(false)}
					>
						<XIcon className="size-6" />
					</Button>
					{selectedImage && (
						<Image
							src={selectedImage}
							alt="Full Preview"
							className="max-h-[85vh] w-auto object-contain rounded-xl"
							removeWrapper
						/>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
