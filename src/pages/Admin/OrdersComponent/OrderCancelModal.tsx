import {
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	Input,
	Button,
	ModalFooter,
} from "@heroui/react";

export function OrderCancelModal({
	isOpenCancelModal,
	onOpenChangeCancelModal,
}: {
	isOpenCancelModal: boolean;
	onOpenChangeCancelModal: (isOpen: boolean) => void;
}) {
	return (
		<Modal backdrop="blur"
			isOpen={isOpenCancelModal}
			onOpenChange={onOpenChangeCancelModal}
			disableAnimation
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							Cancel Order
						</ModalHeader>
						<ModalBody>
							<Input
								label="Reason"
								placeholder="Enter reason for cancellation"
								isRequired
							/>
						</ModalBody>
						<ModalFooter>
							<Button
								color="danger"
								variant="light"
								onPress={onClose}
							>
								Close
							</Button>
							<Button color="success" onPress={onClose}>
								Confirm
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
