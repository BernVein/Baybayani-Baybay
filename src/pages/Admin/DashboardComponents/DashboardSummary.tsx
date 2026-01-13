import { Card, CardBody, Divider } from "@heroui/react";
import {
	PesoIcon,
	CheckIcon,
	ClockIcon,
	TotalOrdersIcon,
	UserIcon,
	ExclamationCircle,
	SoloUserIcon,
} from "@/components/icons";

export function DashboardSummary() {
	return (
		<div className="flex flex-row gap-3 items-center">
			<Card className="w-1/4">
				<CardBody className="gap-y-3">
					<span className="text-default-500">TOTAL REVENUE</span>
					<div className="flex flex-col item-center">
						<div className="flex flex-row items-center justify-between">
							<div className="flex flex-row items-center">
								<span className="text-2xl">₱</span>
								<span className="text-3xl font-bold">
									428,590
								</span>
							</div>

							<div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-500/50">
								<PesoIcon className="w-4 h-4 text-white" />
							</div>
						</div>
						<span className="text-default-500">
							+12.5% vs last month
						</span>
					</div>
				</CardBody>
				<div className="absolute bottom-0 left-0 w-full h-1 bg-green-500/30 rounded-t-md"></div>
			</Card>
			<Card className="w-1/4">
				<CardBody className="gap-y-3">
					<span className="text-default-500">TOTAL ORDERS</span>
					<div className="flex flex-col item-center">
						<div className="flex flex-row items-center justify-between">
							<div className="flex flex-row items-center gap-2">
								<span className="text-3xl font-bold">32</span>
								<div className="text-default-500 flex flex-row items-center gap-1 ml-3">
									<ClockIcon className="w-5" />
									<span className="text-default-500">20</span>
									<Divider
										orientation="vertical"
										className="h-6 m-1"
									/>
									<CheckIcon className="w-5" />
									<span>12</span>
								</div>
							</div>

							<div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500/50">
								<TotalOrdersIcon className="w-6 h-6 text-white" />
							</div>
						</div>
						<span className="text-default-500">
							-4.3% vs last month
						</span>
					</div>
				</CardBody>
				<div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500/30 rounded-t-md"></div>
			</Card>
			<Card className="w-1/4">
				<CardBody className="gap-y-3">
					<span className="text-default-500">TOTAL CUSTOMERS</span>
					<div className="flex flex-col item-center">
						<div className="flex flex-row items-center justify-between">
							<div className="flex flex-row items-center gap-2">
								<span className="text-3xl font-bold">14</span>
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
							<div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-500/50">
								<UserIcon className="w-6 h-6 text-white" />
							</div>
						</div>
						<span className="text-default-500">
							+3 vs last month
						</span>
					</div>
				</CardBody>
				<div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500/30 rounded-t-md"></div>
			</Card>
			<Card className="w-1/4">
				<CardBody className="gap-y-3">
					<span className="text-default-500">LOW STOCK</span>
					<div className="flex flex-col item-center">
						<div className="flex flex-row items-center justify-between">
							<div className="flex flex-row items-center gap-2">
								<span className="text-3xl font-bold">5</span>
								<span>items </span>
							</div>

							<div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500/50">
								<ExclamationCircle className="w-6 h-6 text-white" />
							</div>
						</div>
						<span className="text-default-500 italic">
							View low stock items here
						</span>
					</div>
				</CardBody>
				<div className="absolute bottom-0 left-0 w-full h-1 bg-red-500/30 rounded-t-md"></div>
			</Card>
		</div>
	);
}
