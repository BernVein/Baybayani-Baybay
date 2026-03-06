import { Modal, ModalContent, Image, Button } from "@heroui/react";

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
		<Modal backdrop="blur"
			isOpen={isPreviewOpen}
			onOpenChange={onPreviewOpenChange}
			disableAnimation
			size="full"
			classNames={{
				base: "bg-black/90",
				closeButton: "text-white hover:bg-white/20 text-2xl p-2",
			}}
		>
			<ModalContent>
				{(onClose) => (
					<div className="relative w-full h-full flex items-center justify-center p-4">
						<Image
							src={selectedImage}
							alt="ID Preview"
							className="max-h-[95vh] w-auto object-contain rounded-lg"
							removeWrapper
						/>
						<div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
							<Button
								color="danger"
								variant="flat"
								onPress={onClose}
								className="font-bold"
							>
								Close Preview
							</Button>
						</div>
					</div>
				)}
			</ModalContent>
		</Modal>
	);
}
