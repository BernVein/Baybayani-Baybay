import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
} from "@heroui/react";
import { CheckIcon } from "@/components/icons";
import { BaybayaniLogo } from "@/components/icons";
import { useNavigate } from "react-router-dom";

export function SignUpSuccessModal({
	isOpen,
	onOpenChange,
}: {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const navigate = useNavigate();
	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			disableAnimation
			hideCloseButton
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							Registration Successful!
						</ModalHeader>
						<ModalBody>
							<div className="flex flex-col gap-4 text-center items-center py-4">
								<div className="p-4 bg-success-50 rounded-full">
									<CheckIcon className="w-12 h-12 text-success" />
								</div>
								<div className="flex flex-col gap-2">
									<p className="text-xl font-bold">
										Account Created
									</p>
									<p className="text-default-600">
										Your account has been successfully
										registered and is now{" "}
										<span className="font-semibold text-success">
											pending approval
										</span>{" "}
										from our administrators.
									</p>
									<p className="text-default-500 text-sm italic">
										In the meantime, you can{" "}
									</p>
									<p className="text-default-500 text-sm italic">
										browse the shop to see our available
										products.
									</p>
								</div>
							</div>
						</ModalBody>
						<ModalFooter>
							<Button
								onPress={() => {
									onClose();
									// hard reset lol
									window.location.reload();
								}}
								variant="light"
								color="danger"
							>
								Close
							</Button>
							<Button
								startContent={<BaybayaniLogo className="w-5" />}
								onPress={() => {
									onClose();
									navigate("/shop");
								}}
							>
								Browse Shop
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
