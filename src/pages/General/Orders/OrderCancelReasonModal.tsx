import {
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	Button,
	ModalFooter,
} from "@heroui/react";
import { formatCreatedAt } from "@/utils/formatCreatedAt";
import { ExclamationCircle } from "@/components/icons";

export function OrderCancelReasonModal({
	isOpenCancelReasonModal,
	onOpenChangeCancelReasonModal,
	cancelReason,
	status,
	lastUpdated,
}: {
	isOpenCancelReasonModal: boolean;
	onOpenChangeCancelReasonModal: (isOpen: boolean) => void;
	cancelReason: string;
	status: "Completed" | "Cancelled";
	lastUpdated?: string;
}) {
	const isCancelled = status === "Cancelled";
	const colorClass = isCancelled ? "text-danger" : "text-success";
	const bgColorClass = isCancelled ? "bg-danger-50" : "bg-success-50";
	const borderColorClass = isCancelled
		? "border-danger-200"
		: "border-success-200";

	const formattedTime = lastUpdated ? formatCreatedAt(lastUpdated) : null;

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
						<ModalHeader
							className={`flex items-center gap-2 ${colorClass}`}
						>
							<ExclamationCircle className="w-6" />
							Order {status}
						</ModalHeader>

						<ModalBody>
							<div className="space-y-4">
								<div className="flex flex-col gap-1">
									<p className="text-sm text-default-500 font-semibold text-center mt-2">
										Status updated on:
									</p>
									{formattedTime ? (
										<div className="flex flex-col items-center">
											<span className="text-lg font-bold">
												{formattedTime.formattedDate}
											</span>
											<span className="text-sm text-default-400 italic">
												({formattedTime.relativeText})
											</span>
										</div>
									) : (
										<p className="text-sm text-center text-default-400">
											Date not available
										</p>
									)}
								</div>

								{status === "Cancelled" && (
									<div className="space-y-2">
										<p className="text-sm text-default-500">
											Reason provided by Baybayani:
										</p>

										<div
											className={`rounded-lg ${bgColorClass} border ${borderColorClass} p-4`}
										>
											<p
												className={`text-sm ${
													isCancelled
														? "text-danger-700"
														: "text-success-700"
												} whitespace-pre-wrap`}
											>
												{cancelReason ||
													"No reason was provided."}
											</p>
										</div>
									</div>
								)}
							</div>
						</ModalBody>

						<ModalFooter>
							<Button
								color={isCancelled ? "danger" : "success"}
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
