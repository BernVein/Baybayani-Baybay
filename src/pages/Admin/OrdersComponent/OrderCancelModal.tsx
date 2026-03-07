import {
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	Input,
	Button,
	ModalFooter,
} from "@heroui/react";

import { useState } from "react";

export function OrderCancelModal({
	isOpenCancelModal,
	onOpenChangeCancelModal,
	onConfirm,
}: {
	isOpenCancelModal: boolean;
	onOpenChangeCancelModal: (isOpen: boolean) => void;
	onConfirm: (reason: string) => void;
}) {
	const [reason, setReason] = useState("");

	const handleConfirm = (onClose: () => void) => {
		onConfirm(reason);
		setReason("");
		onClose();
	};

	return (
		<Modal
			backdrop="blur"
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
								value={reason}
								onValueChange={setReason}
							/>
						</ModalBody>
						<ModalFooter>
							<Button
								color="danger"
								variant="light"
								onPress={() => {
									setReason("");
									onClose();
								}}
							>
								Close
							</Button>
							<Button
								color="success"
								onPress={() => handleConfirm(onClose)}
								isDisabled={!reason.trim()}
							>
								Confirm
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
