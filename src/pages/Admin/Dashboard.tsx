import { DashboardSummary } from "@/pages/Admin/DashboardComponents/DashboardSummary";
import { Card, CardBody } from "@heroui/react";
import { BasicLineChart } from "@/pages/Admin/DashboardComponents/BasicLineChart";
import { DashboardTableLowStock } from "@/pages/Admin/DashboardComponents/DashboardTableLowStock";
import { GroupedBarChart } from "@/pages/Admin/DashboardComponents/GroupedBarChart";
export default function Dashboard() {
	return (
		<div className="flex flex-col gap-8">
			<div className="flex items-center justify-between gap-2">
				<div className="text-3xl font-semibold">Dashboard</div>
				<div className="flex flex-row gap-1 items-center text-muted-foreground">
					<div className="text-base text-default-500">
						Logged in as{" "}
					</div>
					<div className="text-lg font-semibold">Admin Bern Vein</div>
				</div>
			</div>
			<DashboardSummary />
			<div className="flex flex-row gap-3 items-stretch h-[380px]">
				<Card className="w-3/4 p-4">
					<CardBody>
						<span className="text-default-500">REVENUE TREND</span>
						<BasicLineChart />
					</CardBody>
				</Card>

				<Card className="w-1/4 p-4">
					<CardBody className="gap-2 overflow-hidden">
						<span className="text-default-500">
							LOW STOCK ITEMS
						</span>
						<DashboardTableLowStock />
					</CardBody>
				</Card>
			</div>
			<div className="flex flex-row gap-3 items-stretch h-[380px]">
				<Card className="w-3/4 p-4">
					<span className="text-default-500">ORDER TREND</span>
					<GroupedBarChart />
				</Card>
			</div>
		</div>
	);
}
