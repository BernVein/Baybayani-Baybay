import { DashboardSummary } from "@/pages/Admin/DashboardComponents/DashboardSummary";
import { Card, CardBody } from "@heroui/react";
import { BasicLineChart } from "@/pages/Admin/DashboardComponents/BasicLineChart";
import { DashboardTable } from "@/pages/Admin/DashboardComponents/DashboardTable";
import { GroupedBarChart } from "@/pages/Admin/DashboardComponents/GroupedBarChart";
export default function Dashboard() {
	return (
		<div className="flex flex-col gap-8 p-4">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
				<div className="text-3xl font-semibold">Dashboard</div>
				<div className="flex flex-row gap-1 items-center text-muted-foreground">
					<div className="text-base text-default-500">
						Logged in as{" "}
					</div>
					<div className="text-lg font-semibold">Admin Bern Vein</div>
				</div>
			</div>
			<DashboardSummary />
			<div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-stretch h-full sm:h-[380px]">
				<Card className="w-full sm:col-span-3 p-4">
					<CardBody>
						<span className="text-default-500">REVENUE TREND</span>
						<BasicLineChart />
					</CardBody>
				</Card>

				<Card className="w-full sm:col-span-1 p-4 sm:h-full h-[380px]">
					<CardBody className="gap-2 overflow-hidden">
						<span className="text-default-500">
							LOW STOCK ITEMS
						</span>
						<DashboardTable />
					</CardBody>
				</Card>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-stretch h-full sm:h-[380px]">
				<Card className="w-full sm:col-span-3 p-4">
					<span className="text-default-500 pt-4 pl-4">
						ORDER TREND
					</span>
					<GroupedBarChart />
				</Card>
				<Card className="w-full sm:col-span-1 p-4 sm:h-full h-[380px]">
					<CardBody className="gap-2 overflow-hidden">
						<span className="text-default-500">
							TOP ORDERED ITEMS
						</span>
						<DashboardTable />
					</CardBody>
				</Card>
			</div>
		</div>
	);
}
