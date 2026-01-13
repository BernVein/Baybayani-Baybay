import { DashboardSummary } from "@/pages/Admin/DashboardComponents/DashboardSummary";
import {
	Card,
	CardBody,
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Avatar,
} from "@heroui/react";
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
						<Table
							isHeaderSticky
							removeWrapper
							className="overflow-y-auto"
						>
							<TableHeader>
								<TableColumn>ITEM</TableColumn>
								<TableColumn>NEEDED</TableColumn>
							</TableHeader>

							<TableBody emptyContent={"No low stock item."}>
								<TableRow key="1">
									<TableCell>
										<div className="flex flex-row items-center gap-2">
											<Avatar size="sm" />
											<span>Tony Reichert</span>
										</div>
									</TableCell>
									<TableCell>5 kg</TableCell>
								</TableRow>
								<TableRow key="2">
									<TableCell>
										<div className="flex flex-row items-center gap-2">
											<Avatar size="sm" />
											<span>Tony Reichert</span>
										</div>
									</TableCell>
									<TableCell>5 kg</TableCell>
								</TableRow>
								<TableRow key="3">
									<TableCell>
										<div className="flex flex-row items-center gap-2">
											<Avatar size="sm" />
											<span>Tony Reichert</span>
										</div>
									</TableCell>
									<TableCell>5 kg</TableCell>
								</TableRow>
								<TableRow key="4">
									<TableCell>
										<div className="flex flex-row items-center gap-2">
											<Avatar size="sm" />
											<span>Tony Reichert</span>
										</div>
									</TableCell>
									<TableCell>5 kg</TableCell>
								</TableRow>
								<TableRow key="1">
									<TableCell>
										<div className="flex flex-row items-center gap-2">
											<Avatar size="sm" />
											<span>Tony Reichert</span>
										</div>
									</TableCell>
									<TableCell>5 kg</TableCell>
								</TableRow>
								<TableRow key="2">
									<TableCell>
										<div className="flex flex-row items-center gap-2">
											<Avatar size="sm" />
											<span>Tony Reichert</span>
										</div>
									</TableCell>
									<TableCell>5 kg</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</CardBody>
				</Card>
			</div>
		</div>
	);
}
