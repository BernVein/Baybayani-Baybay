import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
} from "@heroui/react";
import { ExclamationCircle } from "@/components/icons";

export function InsufficientStockModal({
	isOpen,
	onOpenChange,
	itemName,
	variantName,
	unitOfMeasure,
	requestedQuantity,
	availableStock,
	targetStatus,
}: {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	itemName: string;
	unitOfMeasure: string;
	variantName: string;
	requestedQuantity: number;
	availableStock: number;
	targetStatus: string;
}) {
	return (
		<Modal backdrop="blur"
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			size="md"
			disableAnimation
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col items-center gap-1 text-center">
							<div className="flex items-center justify-center h-12 w-12 rounded-full bg-danger/10 text-danger mb-2">
								<ExclamationCircle className="w-6 h-6" />
							</div>
							<h2 className="text-xl font-bold text-danger">
								Insufficient Stock
							</h2>
						</ModalHeader>
						<ModalBody className="text-center py-4">
							<p className="text-default-600 mb-4">
								Cannot move order to{" "}
								<span className="font-semibold text-default-900">
									{targetStatus}
								</span>{" "}
								status because the remaining stock cannot
								accommodate this request.
							</p>
							<div className="bg-default-100 p-4 rounded-xl text-left border border-default-200">
								{itemName !== variantName && (
									<div className="flex justify-between mb-1">
										<span className="text-sm text-default-500">
											Item:
										</span>
										<span className="text-base font-medium text-default-900">
											{itemName}
										</span>
									</div>
								)}

								<div className="flex justify-between mb-1">
									<span className="text-sm text-default-500">
										{itemName !== variantName
											? "Variant"
											: "Item"}
									</span>
									<span className="text-base font-medium text-default-900">
										{variantName}
									</span>
								</div>
								<hr className="my-2 border-default-200" />
								<div className="flex justify-between mb-1">
									<span className="text-sm text-default-500">
										Requested:
									</span>
									<span className="text-base font-bold text-danger">
										{requestedQuantity} {unitOfMeasure}s
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-sm text-default-500">
										Available:
									</span>
									<span className="text-base font-bold text-warning">
										{availableStock} {unitOfMeasure}s
									</span>
								</div>
							</div>
						</ModalBody>
						<ModalFooter className="flex justify-end">
							<Button
								color="danger"
								variant="light"
								onPress={onClose}
								className="px-8 font-semibold"
							>
								Close
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
