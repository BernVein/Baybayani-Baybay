import { Card, CardBody, Divider } from "@heroui/react";
import {
	KeyIcon,
	PendingIcon,
	SoloUserIcon,
	UserIcon,
	GroupUserIcon,
} from "@/components/icons";

export function UsersSummary() {
	return (
		<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
			<Card className="w-full">
				<CardBody className="gap-y-3">
					<span className="text-default-500">TOTAL CUSTOMERS</span>
					<div className="flex flex-col item-center">
						<div className="flex flex-row items-center justify-between">
							<div className="flex flex-row items-center">
								<span className="text-3xl font-bold">19</span>
								<div className="text-default-500 flex flex-row items-center gap-1 ml-3">
									<SoloUserIcon className="w-5" />
									<span className="text-default-500">10</span>
									<Divider
										orientation="vertical"
										className="h-6 m-1"
									/>
									<UserIcon className="w-5" />
									<span>4</span>
								</div>
							</div>

							<div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-500/70">
								<GroupUserIcon className="w-6 h-6 text-white" />
							</div>
						</div>
						<span className="text-default-500">
							+3 vs last month
						</span>
					</div>
				</CardBody>
				<div className="absolute bottom-0 left-0 w-full h-1 bg-green-500/70 rounded-t-md"></div>
			</Card>
			<Card className="w-full">
				<CardBody className="gap-y-3">
					<span className="text-default-500">TOTAL ADMINS</span>
					<div className="flex flex-col item-center">
						<div className="flex flex-row items-center justify-between">
							<div className="flex flex-row items-center gap-2">
								<span className="text-3xl font-bold">5</span>
							</div>

							<div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-500/70">
								<KeyIcon className="w-6 h-6 text-white" />
							</div>
						</div>
						<span className="text-default-500">
							+2 vs last month
						</span>
					</div>
				</CardBody>
				<div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500/70 rounded-t-md"></div>
			</Card>
			<Card className="w-full">
				<CardBody className="gap-y-3">
					<span className="text-default-500">
						TOTAL USERS WAITING FOR APPROVAL
					</span>
					<div className="flex flex-col item-center">
						<div className="flex flex-row items-center justify-between">
							<div className="flex flex-row items-center gap-2">
								<span className="text-3xl font-bold">14</span>
							</div>
							<div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500/70">
								<PendingIcon className="w-6 h-6 text-white" />
							</div>
						</div>
						<span className="text-default-500">
							last user applied on Jan 2, 2026
						</span>
					</div>
				</CardBody>
				<div className="absolute bottom-0 left-0 w-full h-1 bg-red-500/70 rounded-t-md"></div>
			</Card>
		</div>
	);
}
