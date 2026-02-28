import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Button,
	useDisclosure,
} from "@heroui/react";

import { EyeIcon, PencilIcon } from "@/components/icons";
import { UserProfile } from "@/model/userProfile";

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
	console.log(isOpenViewUserDetail, onOpenChangeViewUserDetail);
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
									<span className="font-bold text-sm">
										{new Date(
											userProfile.created_at ?? "",
										).toLocaleDateString("en-US", {
											year: "numeric",
											month: "short",
											day: "numeric",
										})}
									</span>
									<span className="text-xs text-default-500 italic">
										{Math.floor(
											(new Date().getTime() -
												new Date(
													userProfile.created_at ??
														"",
												).getTime()) /
												(1000 * 60 * 60 * 24),
										)}{" "}
										day/s ago
									</span>
								</div>
							</TableCell>
							<TableCell>
								<div className="flex flex-row items-center gap-1">
									<Button
										isIconOnly
										size="sm"
										variant="light"
										onPress={onOpenViewUserDetail}
									>
										<EyeIcon className="w-5" />
									</Button>

									<Button
										isIconOnly
										size="sm"
										variant="light"
									>
										<PencilIcon className="w-5" />
									</Button>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
