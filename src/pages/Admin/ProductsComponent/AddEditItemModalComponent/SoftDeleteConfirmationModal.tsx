import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
} from "@heroui/react";
import { TrashIcon } from "@/components/icons";

export function SoftDeleteConfirmationModal({
	isOpen,
	onOpenChange,
	title,
	name,
	type,
	onConfirm,
	isLoading,
}: {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	name: string;
	type: "Item" | "Variant";
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
							<div className="flex items-center justify-center h-12 w-12 rounded-full bg-danger/10 text-danger">
								<TrashIcon className="w-6 h-6" />
							</div>
							<h2 className="text-xl font-bold text-danger">
								{title}
							</h2>
						</ModalHeader>

						<ModalBody className="py-4 text-center">
							<div className="flex flex-col gap-4">
								<p className="text-default-600">
									Are you sure you want to delete this{" "}
									{type.toLowerCase()}:{" "}
									<span className="font-bold text-default-900">
										{name}
									</span>
									?
								</p>
								<div className="bg-danger/5 rounded-lg p-3 border border-danger/20 text-sm text-danger text-left">
									<p className="font-bold mb-1 uppercase tracking-tighter">
										Warning:
									</p>
									<p>
										This action will hide the{" "}
										{type.toLowerCase()} from the system.{" "}
										{type === "Item" &&
											"This will also delete all associated variants."}
									</p>
								</div>
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
								color="danger"
								isLoading={isLoading}
								onPress={() => {
									onConfirm();
								}}
							>
								Delete {type}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
