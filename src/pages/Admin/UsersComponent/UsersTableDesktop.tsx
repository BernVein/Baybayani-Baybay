import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Avatar,
	Button,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownSection,
	DropdownItem,
	Chip,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
	Divider,
} from "@heroui/react";

import {
	EyeIcon,
	KeyIcon,
	PencilIcon,
	SoloUserIcon,
	GroupUserIcon,
} from "@/components/icons";
import { UserProfile } from "@/model/userProfile";
import { detectNetwork } from "@/utils/detectNetwork";
import { useState } from "react";
import { formatCreatedAt } from "@/utils/formatCreatedAt";

export function UsersTableDesktop({
	userProfiles,
	isLoading,
}: {
	userProfiles: UserProfile[] | null;
	isLoading: boolean;
}) {
	console.log(isLoading);
	const {
		isOpen: isOpenViewUserDetail,
		onOpen: onOpenViewUserDetail,
		onOpenChange: onOpenChangeViewUserDetail,
	} = useDisclosure();

	const [selectedUserProfile, setSelectedUserProfile] =
		useState<UserProfile | null>(null);

	const formatPHNumber = (phone: string) => {
		if (!phone) return "";

		let digits = phone.replace(/\D/g, "");

		if (digits.startsWith("639") && digits.length === 12) {
			digits = "0" + digits.slice(2);
		}

		if (digits.startsWith("9") && digits.length === 10) {
			digits = "0" + digits;
		}

		if (!digits.startsWith("09") || digits.length !== 11) {
			return phone;
		}

		return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
	};
	return (
		<div className="sm:flex hidden flex-1 min-h-0 flex-col">
			<Table isHeaderSticky className="overflow-y-auto h-full w-full">
				<TableHeader>
					<TableColumn>USER</TableColumn>
					<TableColumn>ROLE</TableColumn>
					<TableColumn>STATUS</TableColumn>
					<TableColumn>PHONE NUMBER</TableColumn>
					<TableColumn>DATE REGISTERED</TableColumn>
					<TableColumn>ACTIONS</TableColumn>
				</TableHeader>

				<TableBody emptyContent={"No users found."}>
					{(userProfiles ?? []).map((userProfile) => (
						<TableRow key={userProfile.user_id}>
							<TableCell>
								<div className="flex flex-row items-center gap-2">
									<Avatar
										size="md"
										src={userProfile.user_profile_img_url}
									/>
									<div className="flex flex-col items-start">
										<span className="text-base font-bold">
											{userProfile.user_name}
										</span>
										<span className="text-sm text-default-500 italic">
											{userProfile.login_user_name}
										</span>
									</div>
								</div>
							</TableCell>
							<TableCell>
								<div className="flex flex-row gap-1 items-center">
									{userProfile.user_role === "Admin" && (
										<KeyIcon className="w-5" />
									)}
									{userProfile.user_role === "Individual" && (
										<SoloUserIcon className="w-5" />
									)}
									{userProfile.user_role ===
										"Cooperative" && (
										<GroupUserIcon className="w-5" />
									)}
									{userProfile.user_role}
								</div>
							</TableCell>
							<TableCell>
								<Chip
									color={
										userProfile.user_status === "Approved"
											? "success"
											: userProfile.user_status ===
												  "For Approval"
												? "warning"
												: userProfile.user_status ===
													  "Rejected"
													? "danger"
													: "default"
									}
									variant="flat"
								>
									{userProfile.user_status}
								</Chip>
							</TableCell>
							<TableCell>
								<div className="flex flex-col items-start">
									<span className="text-base font-bold">
										{formatPHNumber(
											userProfile.user_phone_number,
										)}
									</span>
									<span className="text-sm text-default-500 italic">
										Probably{" "}
										{detectNetwork(
											formatPHNumber(
												userProfile.user_phone_number,
											),
										)}
									</span>
								</div>
							</TableCell>
							<TableCell>
								<div className="flex flex-col items-start">
									{formatCreatedAt(
										userProfile.created_at,
									) && (
										<>
											<span className="font-bold text-base">
												{
													formatCreatedAt(
														userProfile.created_at,
													)?.formattedDate
												}
											</span>

											<span className="text-sm text-default-500 italic">
												{
													formatCreatedAt(
														userProfile.created_at,
													)?.relativeText
												}
											</span>
										</>
									)}
								</div>
							</TableCell>
							<TableCell>
								<div className="flex flex-row items-center gap-1">
									<Button
										isIconOnly
										size="sm"
										variant="light"
										onPress={() => {
											setSelectedUserProfile(userProfile);
											onOpenViewUserDetail();
										}}
										startContent={
											<EyeIcon className="w-5" />
										}
									/>
									<Dropdown>
										<DropdownTrigger>
											<Button
												isIconOnly
												size="sm"
												variant="light"
												startContent={
													<PencilIcon className="w-5" />
												}
											/>
										</DropdownTrigger>
										<DropdownMenu>
											<DropdownSection title="Set Status">
												<DropdownItem key="Approved">
													Approved
												</DropdownItem>
												<DropdownItem key="For Approval">
													For Approval
												</DropdownItem>
												<DropdownItem key="Rejected">
													Rejected
												</DropdownItem>
												<DropdownItem
													key="Suspended"
													className="text-danger"
													color="danger"
												>
													Suspended
												</DropdownItem>
											</DropdownSection>
										</DropdownMenu>
									</Dropdown>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<Modal
				isOpen={isOpenViewUserDetail}
				onOpenChange={onOpenChangeViewUserDetail}
				disableAnimation
				size="xl"
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								View User Details
							</ModalHeader>
							<ModalBody>
								<div className="flex flex-row gap-2 items-center w-full justify-between">
									<div className="flex sm:flex-row flex-col gap-2 items-center">
										<Avatar
											className="w-20 h-20 text-large shrink-0 self-start sm:self-center"
											src={
												selectedUserProfile?.user_profile_img_url
											}
										/>
										<div className="flex flex-col items-start">
											<span className="text-base font-bold">
												{selectedUserProfile?.user_name}
											</span>
											<span className="text-sm text-default-500">
												Username:{" "}
												<span className="text-default-900">
													{
														selectedUserProfile?.login_user_name
													}
												</span>
											</span>
											<span className="text-sm text-default-500">
												Role:{" "}
												<span className="text-default-900">
													{
														selectedUserProfile?.user_role
													}
												</span>
											</span>
											<span className="text-sm text-default-500">
												Phone Number :{" "}
												<span className="text-default-900">
													{formatPHNumber(
														selectedUserProfile?.user_phone_number!,
													)}
												</span>
											</span>
										</div>
									</div>
									<Chip
										color={
											selectedUserProfile?.user_status ===
											"Approved"
												? "success"
												: selectedUserProfile?.user_status ===
													  "For Approval"
													? "warning"
													: selectedUserProfile?.user_status ===
														  "Rejected"
														? "danger"
														: "default"
										}
										variant="flat"
										className="self-start"
									>
										{selectedUserProfile?.user_status}
									</Chip>
								</div>
								<Divider />
								<p className="text-default-500">
									Registered on:{" "}
									{formatCreatedAt(
										selectedUserProfile?.created_at,
									) && (
										<>
											<span className="text-default-900">
												{
													formatCreatedAt(
														selectedUserProfile?.created_at,
													)?.formattedDate
												}{" "}
											</span>

											<span className="text-default-900 italic">
												(
												{
													formatCreatedAt(
														selectedUserProfile?.created_at,
													)?.relativeText
												}
												)
											</span>
										</>
									)}
								</p>
								<p>
									Lorem ipsum dolor sit amet, consectetur
									adipiscing elit. Nullam pulvinar risus non
									risus hendrerit venenatis. Pellentesque sit
									amet hendrerit risus, sed porttitor quam.
								</p>
								<p>
									Magna exercitation reprehenderit magna aute
									tempor cupidatat consequat elit dolor
									adipisicing. Mollit dolor eiusmod sunt ex
									incididunt cillum quis. Velit duis sit
									officia eiusmod Lorem aliqua enim laboris do
									dolor eiusmod. Et mollit incididunt nisi
									consectetur esse laborum eiusmod pariatur
									proident Lorem eiusmod et. Culpa deserunt
									nostrud ad veniam.
								</p>
							</ModalBody>
							<ModalFooter>
								<Button
									color="danger"
									variant="light"
									onPress={onClose}
								>
									Close
								</Button>
								<Button color="success" onPress={onClose}>
									Approve
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
}
