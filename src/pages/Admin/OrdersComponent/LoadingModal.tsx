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
}: {
	isOpenLoading: boolean;
	onOpenChangeLoading: (isOpen: boolean) => void;
}) {
	return (
		<Modal backdrop="blur"
			disableAnimation
			isOpen={isOpenLoading}
			onOpenChange={onOpenChangeLoading}
			hideCloseButton
			isDismissable={false}
			isKeyboardDismissDisabled
		>
			<ModalContent>
				<>
					<ModalHeader className="flex flex-col items-center text-lg font-semibold">
						Processing Order
					</ModalHeader>

					<ModalBody className="flex flex-col items-center justify-center gap-4 py-8">
						<Spinner size="lg" color="success" />

						<div className="text-center">
							<p className="text-sm text-default-600">
								Please wait while we update the order.
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
