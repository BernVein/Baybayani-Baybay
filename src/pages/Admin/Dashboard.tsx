import { DashboardSummary } from "@/pages/Admin/DashboardComponents/DashboardSummary";
import { Card, CardBody } from "@heroui/react";
import { BasicLineChart } from "./DashboardComponents/BasicLineChart";
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
			<div className="flex flex-row items-center gap-2">
				<Card className="w-1/2">
					<CardBody>
						<span className="text-default-500">REVENUE TREND</span>
						<BasicLineChart />
					</CardBody>
				</Card>
				<Card className="w-1/2">
					<CardBody>
						<span className="text-default-500">ORDER TREND</span>
					</CardBody>
				</Card>
			</div>
		</div>
	);
}
