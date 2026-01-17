import { SoloUserIcon, UserIcon, KeyIcon, PhotoIcon } from "@/components/icons";
import {
	Button,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Input,
	Select,
	SelectItem,
} from "@heroui/react";

export function AddUserModal({
	isOpen,
	onOpenChange,
}: {
	isOpen: boolean;
	onOpenChange: () => void;
}) {
	return (
		<>
			<Modal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				size="xl"
				scrollBehavior="inside"
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Add User
							</ModalHeader>
							<ModalBody>
								<span className="text-lg font-semibold">
									User Detail
								</span>
								<div className="flex flex-row gap-2 items-center">
									<Input
										key="1"
										label="Name"
										labelPlacement="outside"
										className="w-1/2"
									/>
									<Input
										key="1"
										label="Username"
										labelPlacement="outside"
										className="w-1/2"
									/>
								</div>

								<div className="flex flex-row gap-2 items-center">
									<Select
										labelPlacement="outside"
										label="Role"
										className="w-1/2"
									>
										<SelectItem
											key="1"
											startContent={
												<SoloUserIcon className="w-5" />
											}
										>
											Individual
										</SelectItem>
										<SelectItem
											key="2"
											startContent={
												<UserIcon className="w-5" />
											}
										>
											Cooperative
										</SelectItem>
										<SelectItem
											key="3"
											startContent={
												<KeyIcon className="w-5" />
											}
										>
											Admin
										</SelectItem>
									</Select>
									<Select
										labelPlacement="outside"
										label="Status"
										className="w-1/2"
									>
										<SelectItem key="1">Active</SelectItem>
										<SelectItem key="2">
											Suspended
										</SelectItem>
										<SelectItem key="3">Pending</SelectItem>
									</Select>
								</div>
								<div className="flex flex-row gap-2 items-center">
									<Button
										startContent={
											<PhotoIcon className="w-5" />
										}
										className="mt-2 w-full"
									>
										View Profile
									</Button>
									<Button
										startContent={
											<PhotoIcon className="w-5" />
										}
										className="mt-2 w-full"
									>
										View ID
									</Button>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button
									color="danger"
									variant="light"
									onPress={onClose}
								>
									Cancel
								</Button>
								<Button color="success" onPress={onClose}>
									Update
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
