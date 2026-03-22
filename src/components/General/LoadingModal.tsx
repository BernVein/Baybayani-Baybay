import {
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	Spinner,
} from "@heroui/react";

export function LoadingModal({
	isOpenLoading,
	onOpenChangeLoading,
	title = "Processing...",
	message = "Please wait while we update the information.",
}: {
	isOpenLoading: boolean;
	onOpenChangeLoading: (isOpen: boolean) => void;
	title?: string;
	message?: string;
}) {
	return (
		<Modal
			backdrop="blur"
			disableAnimation
			isOpen={isOpenLoading}
			onOpenChange={onOpenChangeLoading}
			hideCloseButton
			isDismissable={false}
			isKeyboardDismissDisabled
		>
			<ModalContent>
				<>
					<ModalHeader className="flex flex-col items-center text-lg font-semibold pt-6">
						{title}
					</ModalHeader>

					<ModalBody className="flex flex-col items-center justify-center gap-4 py-8">
						<Spinner size="lg" color="success" />

						<div className="text-center">
							<p className="text-sm text-default-600">
								{message}
							</p>
							<p className="text-xs text-default-400 mt-1">
								This may take a few seconds...
							</p>
						</div>
					</ModalBody>
				</>
			</ModalContent>
		</Modal>
	);
}
