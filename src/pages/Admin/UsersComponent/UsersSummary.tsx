import { Card, CardBody, Divider, Skeleton } from "@heroui/react";

import {
	KeyIcon,
	PendingIcon,
	SoloUserIcon,
	UserIcon,
	GroupUserIcon,
} from "@/components/icons";
import { useUsersSummary } from "@/data/supabase/Admin/Users/useUsersSummary";

export function UsersSummary() {
	const {
		individual,
		cooperative,
		admin,
		forApproval,
		lastApplicationDate,
		loading,
	} = useUsersSummary();

	return (
		<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
			<Card className="w-full">
				<CardBody className="gap-y-3">
					<span className="text-default-500 uppercase">
						Total Customers
					</span>
					<div className="flex flex-col item-center">
						<div className="flex flex-row items-center justify-between">
							<div className="flex flex-row items-center">
								<Skeleton
									isLoaded={!loading}
									className="rounded-lg"
								>
									<span className="text-3xl font-bold">
										{individual + cooperative}
									</span>
								</Skeleton>
								<div className="text-default-500 flex flex-row items-center gap-1 ml-3">
									<SoloUserIcon className="w-5" />
									<Skeleton
										isLoaded={!loading}
										className="rounded-lg"
									>
										<span className="text-default-500">
											{individual}
										</span>
									</Skeleton>
									<Divider
										className="h-6 m-1"
										orientation="vertical"
									/>
									<UserIcon className="w-5" />
									<Skeleton
										isLoaded={!loading}
										className="rounded-lg"
									>
										<span>{cooperative}</span>
									</Skeleton>
								</div>
							</div>

							<div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-500/70">
								<GroupUserIcon className="w-6 h-6 text-white" />
							</div>
						</div>
						<span className="text-default-500">
							Verified buyers in the system
						</span>
					</div>
				</CardBody>
				<div className="absolute bottom-0 left-0 w-full h-1 bg-green-500/70 rounded-t-md" />
			</Card>
			<Card className="w-full">
				<CardBody className="gap-y-3">
					<span className="text-default-500 uppercase">
						Total Admins
					</span>
					<div className="flex flex-col item-center">
						<div className="flex flex-row items-center justify-between">
							<div className="flex flex-row items-center gap-2">
								<Skeleton
									isLoaded={!loading}
									className="rounded-lg"
								>
									<span className="text-3xl font-bold">
										{admin}
									</span>
								</Skeleton>
							</div>

							<div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-500/70">
								<KeyIcon className="w-6 h-6 text-white" />
							</div>
						</div>
						<span className="text-default-500">
							Active administrators
						</span>
					</div>
				</CardBody>
				<div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500/70 rounded-t-md" />
			</Card>
			<Card className="w-full">
				<CardBody className="gap-y-3">
					<span className="text-default-500 uppercase">
						Pending Approvals
					</span>
					<div className="flex flex-col item-center">
						<div className="flex flex-row items-center justify-between">
							<div className="flex flex-row items-center gap-2">
								<Skeleton
									isLoaded={!loading}
									className="rounded-lg"
								>
									<span className="text-3xl font-bold">
										{forApproval}
									</span>
								</Skeleton>
							</div>
							<div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500/70">
								<PendingIcon className="w-6 h-6 text-white" />
							</div>
						</div>
						<Skeleton
							isLoaded={!loading}
							className="rounded-lg w-3/5"
						>
							<span className="text-default-500">
								{lastApplicationDate
									? `Last application on ${new Date(lastApplicationDate).toLocaleDateString()}`
									: "No pending applications"}
							</span>
						</Skeleton>
					</div>
				</CardBody>
				<div className="absolute bottom-0 left-0 w-full h-1 bg-red-500/70 rounded-t-md" />
			</Card>
		</div>
	);
}
