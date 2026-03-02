import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Button,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownSection,
	DropdownItem,
	useDisclosure,
} from "@heroui/react";
import { ShowUserDetailModal } from "@/pages/Admin/UsersComponent/ShowUserDetailModal";
import { EyeIcon, PencilIcon } from "@/components/icons";
import { UserProfile } from "@/model/userProfile";
import { useState } from "react";
export function UsersTableMobile({
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

	return (
		<div className="sm:hidden flex-1 min-h-0 flex flex-col">
			<Table isHeaderSticky className="overflow-y-auto h-full w-full">
				<TableHeader>
					<TableColumn>USER INFO</TableColumn>
					<TableColumn>DATE REGISTERED</TableColumn>
					<TableColumn>ACTIONS</TableColumn>
				</TableHeader>

				<TableBody emptyContent={"No users found."}>
					{(userProfiles ?? []).map((userProfile) => (
						<TableRow key={userProfile.user_id}>
							<TableCell>
								<div className="flex flex-row items-center gap-2">
									<div className="flex flex-col items-start">
										<span className="text-sm font-bold">
											{userProfile.user_name}
										</span>
										<span className="text-sm italic text-default-500">
											{userProfile.user_role}
										</span>
										<div className="flex flex-row items-center gap-1">
											<span
												className={`w-2 h-2 rounded-full ${
													userProfile.user_status ===
													"Approved"
														? "bg-green-400"
														: userProfile.user_status ===
															  "For Approval"
															? "bg-yellow-400"
															: userProfile.user_status ===
																  "Rejected"
																? "bg-red-400"
																: userProfile.user_status ===
																	  "Suspended"
																	? "bg-gray-400"
																	: "bg-gray-300"
												}`}
											/>
											<span className="text-default-500 italic text-xs">
												{userProfile.user_status}
											</span>
										</div>
									</div>
								</div>
							</TableCell>

							<TableCell>
								<div className="flex flex-col items-start">
									{userProfile.created_at &&
										!isNaN(
											new Date(
												userProfile.created_at,
											).getTime(),
										) && (
											<>
												<span className="font-bold text-base">
													{new Date(
														userProfile.created_at,
													).toLocaleDateString(
														"en-US",
														{
															year: "numeric",
															month: "short",
															day: "numeric",
														},
													)}
												</span>

												<span className="text-sm text-default-500 italic">
													{(() => {
														const created =
															new Date(
																userProfile.created_at,
															);
														const today =
															new Date();

														created.setHours(
															0,
															0,
															0,
															0,
														);
														today.setHours(
															0,
															0,
															0,
															0,
														);

														const diff = Math.floor(
															(today.getTime() -
																created.getTime()) /
																(1000 *
																	60 *
																	60 *
																	24),
														);

														if (diff === 0)
															return "Today";
														if (diff === 1)
															return "1 day ago";
														return `${diff} days ago`;
													})()}
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
			<ShowUserDetailModal
				isOpen={isOpenViewUserDetail}
				onOpenChange={onOpenChangeViewUserDetail}
				selectedUserProfile={selectedUserProfile}
			/>
		</div>
	);
}
