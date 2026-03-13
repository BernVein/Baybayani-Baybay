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
	useDisclosure,
	Pagination,
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
import { formatPHNumber } from "@/utils/formatPHNumber";
import { ShowUserDetailModal } from "./ShowUserDetailModal";

export function UsersTableDesktop({
	userProfiles,
	handleChangeUserStatus,
	page,
	totalPages,
	onChangePage,
}: {
	userProfiles: UserProfile[] | null;
	handleChangeUserStatus: (
		userID: string,
		userStatus: "Approved" | "For Approval" | "Rejected" | "Suspended",
	) => void;
	page: number;
	totalPages: number;
	onChangePage: (page: number) => void;
}) {
	const {
		isOpen: isOpenViewUserDetail,
		onOpen: onOpenViewUserDetail,
		onOpenChange: onOpenChangeViewUserDetail,
	} = useDisclosure();

	const [selectedUserProfile, setSelectedUserProfile] =
		useState<UserProfile | null>(null);
	console.log(selectedUserProfile);
	return (
		<div className="sm:flex hidden flex-1 min-h-0 flex-col">
			<Table
				isHeaderSticky
				className="overflow-y-auto h-full w-full"
				bottomContent={
					totalPages > 1 && (
						<div className="flex w-full justify-center">
							<Pagination
								isCompact
								showControls
								showShadow
								color="success"
								page={page}
								total={totalPages}
								onChange={onChangePage}
							/>
						</div>
					)
				}
			>
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
												<DropdownItem
													key="Approved"
													onPress={() => {
														handleChangeUserStatus(
															userProfile.user_id ??
																"",
															"Approved",
														);
													}}
												>
													Approved
												</DropdownItem>
												<DropdownItem
													key="For Approval"
													onPress={() => {
														handleChangeUserStatus(
															userProfile.user_id ??
																"",
															"For Approval",
														);
													}}
												>
													For Approval
												</DropdownItem>
												<DropdownItem
													key="Rejected"
													onPress={() => {
														handleChangeUserStatus(
															userProfile.user_id ??
																"",
															"Suspended",
														);
													}}
												>
													Suspended
												</DropdownItem>
												<DropdownItem
													key="Suspended"
													className="text-danger"
													color="danger"
													onPress={() => {
														handleChangeUserStatus(
															userProfile.user_id ??
																"",
															"Rejected",
														);
													}}
												>
													Rejected
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
			<ShowUserDetailModal
				selectedUserProfile={selectedUserProfile}
				isOpen={isOpenViewUserDetail}
				onOpenChange={onOpenChangeViewUserDetail}
			/>
		</div>
	);
}
