import {
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	Button,
	ModalFooter,
} from "@heroui/react";

export function OrderCancelReasonModal({
	isOpenCancelReasonModal,
	onOpenChangeCancelReasonModal,
	cancelReason,
}: {
	isOpenCancelReasonModal: boolean;
	onOpenChangeCancelReasonModal: (isOpen: boolean) => void;
	cancelReason: string;
}) {
	return (
		<Modal
			backdrop="blur"
			isOpen={isOpenCancelReasonModal}
			onOpenChange={onOpenChangeCancelReasonModal}
			disableAnimation
			size="md"
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex items-center gap-2 text-danger">
							Order Cancelled
						</ModalHeader>

						<ModalBody>
							<div className="space-y-2">
								<p className="text-sm text-default-500">
									Reason provided by Baybayani:
								</p>

								<div className="rounded-lg bg-danger-50 border border-danger-200 p-4">
									<p className="text-sm text-danger-700 whitespace-pre-wrap">
										{cancelReason ||
											"No reason was provided."}
									</p>
								</div>
							</div>
						</ModalBody>

						<ModalFooter>
							<Button
								color="danger"
								onPress={onClose}
								variant="light"
							>
								Understood
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
