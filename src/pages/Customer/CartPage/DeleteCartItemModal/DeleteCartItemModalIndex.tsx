import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
} from "@heroui/react";
import { ExclamationCircle } from "@/components/icons";
import { CartItemUser } from "@/model/cartItemUser";
export default function DeleteCartItemModalIndex({
	cartItemUser,
	isOpen,
	onOpenChange,
	variant_name_to_delete,
}: {
	cartItemUser: CartItemUser;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	variant_name_to_delete: string;
}) {
	console.log(cartItemUser);
	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col items-center gap-2 text-center">
							<div className="flex items-center justify-center h-12 w-12 rounded-full bg-danger/10 text-danger">
								<ExclamationCircle className="w-6 h-6" />
							</div>
							<h2 className="text-lg font-semibold text-danger">
								Delete item
							</h2>
						</ModalHeader>

						<ModalBody className="text-center text-default-600">
							<p className="text-sm leading-relaxed">
								Are you sure you want to remove{" "}
								<span className="font-semibold text-default-800">
									{variant_name_to_delete}
								</span>{" "}
								from your cart?
							</p>
							<p className="text-xs text-default-500 mt-1">
								This action cannot be undone.
							</p>
						</ModalBody>

						<ModalFooter className="flex justify-center gap-3 pt-4">
							<Button
								variant="flat"
								color="default"
								className="px-6"
								onPress={onClose}
							>
								Cancel
							</Button>
							<Button
								color="danger"
								className="px-6 font-semibold"
								onPress={onClose}
							>
								Delete
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
