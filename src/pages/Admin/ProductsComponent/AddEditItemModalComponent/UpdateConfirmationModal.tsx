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

export interface ChangeDetail {
	field: string;
	oldValue: string;
	newValue: string;
}

export function UpdateConfirmationModal({
	isOpen,
	onOpenChange,
	changes,
	onConfirm,
	isLoading,
}: {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	changes: ChangeDetail[];
	onConfirm: () => void;
	isLoading: boolean;
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
								Confirm Updates
							</h2>
						</ModalHeader>

						<ModalBody className="py-4">
							<div className="flex flex-col gap-4">
								<div className="text-center text-default-600">
									<p className="text-sm font-medium">
										You are about to finalize the following
										changes:
									</p>
								</div>

								<div className="bg-default-50 rounded-lg p-3 border border-default-200">
									{changes.length > 0 ? (
										<div className="flex flex-col gap-3">
											{changes.map((change, index) => (
												<div
													key={index}
													className="flex flex-col gap-1"
												>
													<span className="text-xs font-bold text-default-400 uppercase tracking-wider">
														{change.field}
													</span>
													<div className="flex flex-col gap-1 pl-2 border-l-2 border-success/30">
														<span className="text-sm text-danger line-through opacity-70">
															{change.oldValue ||
																"(Empty)"}
														</span>
														<span className="text-sm text-success font-medium">
															{change.newValue ||
																"(Empty)"}
														</span>
													</div>
													{index <
														changes.length - 1 && (
														<Divider className="mt-2 opacity-50" />
													)}
												</div>
											))}
										</div>
									) : (
										<p className="text-center text-sm text-default-400 italic">
											No significant changes detected.
										</p>
									)}
								</div>

								<p className="text-sm text-center text-default-500 italic mt-2">
									The changes here will be finalized.
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
								Confirm Update
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
