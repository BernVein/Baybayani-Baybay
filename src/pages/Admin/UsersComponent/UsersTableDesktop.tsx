import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Avatar,
	Button,
	Chip,
	useDisclosure,
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
	console.log(isOpenViewUserDetail, onOpenChangeViewUserDetail);

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
									<span className="font-bold text-base">
										{new Date(
											userProfile.created_at ?? "",
										).toLocaleDateString("en-US", {
											year: "numeric",
											month: "short",
											day: "numeric",
										})}
									</span>
									<span className="text-sm text-default-500 italic">
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
