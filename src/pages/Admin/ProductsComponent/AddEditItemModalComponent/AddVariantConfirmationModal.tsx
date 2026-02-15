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
import { Variant } from "@/model/variant";

export function AddVariantConfirmationModal({
	isOpen,
	onOpenChange,
	variant,
	onConfirm,
	isLoading,
	itemUnitOfMeasure,
}: {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	variant: Variant;
	onConfirm: () => void;
	isLoading: boolean;
	itemUnitOfMeasure: string;
}) {
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
							<div className="flex items-center justify-center h-12 w-12 rounded-full bg-success/10 text-success">
								<ExclamationCircle className="w-6 h-6" />
							</div>
							<h2 className="text-xl font-bold text-success">
								Confirm New Variant
							</h2>
						</ModalHeader>

						<ModalBody className="py-4">
							<div className="flex flex-col gap-4">
								<div className="text-center text-default-600">
									<p className="text-sm font-medium">
										You are about to add a new variant:{" "}
										<span className="font-bold">
											{variant.variant_name || "Default"}
										</span>
									</p>
								</div>

								<div className="bg-default-50 rounded-lg p-3 border border-default-200">
									<div className="flex flex-col gap-2">
										<div className="flex justify-between text-sm">
											<span className="text-default-500">
												Retail Price:
											</span>
											<span className="font-semibold">
												₱
												{variant.variant_price_retail ||
													0}
											</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-default-500">
												Initial Stock:
											</span>
											<span className="font-semibold">
												{variant
													.variant_stock_latest_movement
													?.effective_stocks ||
													0}{" "}
												{itemUnitOfMeasure}
											</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-default-500">
												Low Stock Alert:
											</span>
											<span className="font-semibold">
												{variant.variant_low_stock_threshold ||
													0}{" "}
												{itemUnitOfMeasure}
											</span>
										</div>
										{variant.variant_price_wholesale && (
											<>
												<Divider className="my-1 opacity-50" />
												<div className="flex justify-between text-sm">
													<span className="text-default-500">
														Wholesale Price:
													</span>
													<span className="font-semibold">
														₱
														{
															variant.variant_price_wholesale
														}
													</span>
												</div>
												<div className="flex justify-between text-sm">
													<span className="text-default-500">
														Min. Wholesale Qty:
													</span>
													<span className="font-semibold">
														{
															variant.variant_wholesale_item
														}{" "}
														{itemUnitOfMeasure}
													</span>
												</div>
											</>
										)}
									</div>
								</div>

								<p className="text-sm text-center text-default-500 italic mt-2">
									This variant will be added directly to the
									database.
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
								color="success"
								isLoading={isLoading}
								onPress={() => {
									onConfirm();
								}}
							>
								Confirm Add
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
