import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Divider,
} from "@heroui/react";
import { ExclamationCircle } from "@/components/icons";

export function StockAdjustmentConfirmationModal({
	isOpen,
	onOpenChange,
	adjustmentType,
	currentStock,
	adjustmentAmount,
	newStock,
	onConfirm,
	isLoading,
	itemUnitOfMeasure,
}: {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	adjustmentType: "Acquisition" | "Loss";
	currentStock: number;
	adjustmentAmount: number;
	newStock: number;
	onConfirm: () => void;
	isLoading: boolean;
	itemUnitOfMeasure: string;
}) {
	const isLoss = adjustmentType === "Loss";

	return (
		<Modal
			disableAnimation
			isOpen={isOpen}
			size="md"
			onOpenChange={onOpenChange}
			scrollBehavior="inside"
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col items-center gap-2 text-center pb-2">
							<div
								className={`flex items-center justify-center h-12 w-12 rounded-full ${isLoss ? "bg-danger/10 text-danger" : "bg-success/10 text-success"}`}
							>
								<ExclamationCircle className="w-6 h-6" />
							</div>
							<h2
								className={`text-xl font-bold ${isLoss ? "text-danger" : "text-success"}`}
							>
								Confirm Stock{" "}
								{isLoss ? "Deduction" : "Addition"}
							</h2>
						</ModalHeader>

						<ModalBody className="py-4">
							<div className="flex flex-col gap-4">
								<div className="text-center text-default-600">
									<p className="text-sm font-medium">
										You are about to{" "}
										{isLoss ? "deduct" : "add"}{" "}
										<span className="font-bold">
											{adjustmentAmount}{" "}
											{itemUnitOfMeasure}s
										</span>
										.
									</p>
								</div>

								<div className="bg-default-50 rounded-lg p-4 border border-default-200">
									<div className="flex flex-col gap-3">
										<div className="flex justify-between items-center text-sm">
											<span className="text-default-500 font-medium uppercase tracking-wider text-xs">
												Current Stock:
											</span>
											<span className="font-bold text-default-700">
												{currentStock}{" "}
												{itemUnitOfMeasure}s
											</span>
										</div>
										<Divider className="opacity-50" />
										<div className="flex justify-between items-center text-sm">
											<span className="text-default-500 font-medium uppercase tracking-wider text-xs">
												{isLoss
													? "Deduction"
													: "Addition"}
												:
											</span>
											<span
												className={`font-bold ${isLoss ? "text-danger" : "text-success"}`}
											>
												{isLoss ? "-" : "+"}
												{adjustmentAmount}{" "}
												{itemUnitOfMeasure}s
											</span>
										</div>
										<Divider className="opacity-50" />
										<div className="flex justify-between items-center">
											<span className="text-default-700 font-bold uppercase tracking-wider text-xs">
												Resulting Stock:
											</span>
											<span className="font-black text-lg text-default-900 underline decoration-2 decoration-primary underline-offset-4">
												{newStock} {itemUnitOfMeasure}s
											</span>
										</div>
									</div>
								</div>

								<p className="text-xs text-center text-default-500 italic mt-2">
									This action will be recorded in the stock
									history and updated in the database.
								</p>
							</div>
						</ModalBody>

						<ModalFooter className="flex justify-end gap-3 pt-4 border-t border-default-100">
							<Button
								color="default"
								variant="flat"
								onPress={onClose}
							>
								Cancel
							</Button>
							<Button
								color={isLoss ? "danger" : "success"}
								isLoading={isLoading}
								onPress={() => {
									onConfirm();
								}}
							>
								Confirm Change
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
