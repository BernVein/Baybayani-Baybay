import { Button, Card, CardBody, DateRangePicker } from "@heroui/react";
import { useOutletContext } from "react-router-dom";
import { useState, useMemo } from "react";
import { parseDate, getLocalTimeZone, today } from "@internationalized/date";

import { DashboardSummary } from "@/pages/Admin/DashboardComponent/DashboardSummary";
import { BasicLineChart } from "@/pages/Admin/DashboardComponent/BasicLineChart";
import { DashboardTable } from "@/pages/Admin/DashboardComponent/DashboardTable";
import { GroupedBarChart } from "@/pages/Admin/DashboardComponent/GroupedBarChart";
import { DashboardIcon, ExcelIcon } from "@/components/icons";
import useIsMobile from "@/lib/isMobile";
import { useDashboardStats } from "@/data/supabase/Admin/Dashboard/useDashboardStats";

export default function Dashboard() {
	const isMobile = useIsMobile();
	const { profile } = useOutletContext<any>();

	// Default date range: 1st of current month to today
	const now = today(getLocalTimeZone());
	const firstDayOfMonth = parseDate(
		`${now.year}-${String(now.month).padStart(2, "0")}-01`,
	);

	const [dateValue, setDateValue] = useState({
		start: firstDayOfMonth,
		end: now,
	});

	// Format for Supabase query
	const formattedRange = useMemo(
		() => ({
			start: new Date(
				dateValue.start.year,
				dateValue.start.month - 1,
				dateValue.start.day,
			).toISOString(),
			end: new Date(
				dateValue.end.year,
				dateValue.end.month - 1,
				dateValue.end.day,
				23,
				59,
				59,
			).toISOString(),
		}),
		[dateValue],
	);

	const { stats, loading } = useDashboardStats(formattedRange);

	return (
		<div className="flex flex-col gap-8 p-4">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
				<div className="flex flex-row items-center gap-2">
					<DashboardIcon className="w-10" />
					<div className="text-3xl font-semibold">Dashboard</div>
				</div>
				<div className="flex flex-row gap-1 items-center text-muted-foreground">
					<div className="text-base text-default-500">
						Logged in as{" "}
					</div>
					<div className="text-lg font-semibold">
						{profile?.user_name ?? "Admin"}
					</div>
				</div>
			</div>
			<div className="flex flex-row items-center justify-between">
				<DateRangePicker
					showMonthAndYearPickers
					className="max-w-xs"
					label="Set Date Range"
					value={dateValue}
					onChange={(val: any) => val && setDateValue(val)}
				/>
				<Button
					isIconOnly={isMobile}
					size={isMobile ? "lg" : "md"}
					startContent={<ExcelIcon className="w-5" />}
				>
					{!isMobile && "Export Report"}
				</Button>
			</div>

			<DashboardSummary stats={stats} loading={loading} />

			<div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-stretch h-full sm:min-h-[380px]">
				<Card className="w-full sm:col-span-3 p-4">
					<CardBody>
						<span className="text-default-500 mb-4">
							REVENUE TREND
						</span>
						<BasicLineChart
							data={stats?.revenueTrend}
							loading={loading}
						/>
					</CardBody>
				</Card>

				<Card className="w-full sm:col-span-1 p-4 sm:h-full min-h-[380px]">
					<CardBody className="gap-2 overflow-hidden">
						<span className="text-default-500 mb-2">
							LOW STOCK ITEMS
						</span>
						<DashboardTable
							loading={loading}
							emptyContent="No low stock items."
							data={stats?.lowStockItems.map((item: any) => ({
								name: item.name,
								value: `${item.stock} ${item.unit}`,
								image: item.image,
							}))}
						/>
					</CardBody>
				</Card>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-stretch h-full sm:min-h-[380px]">
				<Card className="w-full sm:col-span-3 p-4">
					<span className="text-default-500 pt-4 pl-4 mb-4">
						ORDER TREND
					</span>
					<GroupedBarChart
						data={stats?.orderTrend}
						loading={loading}
					/>
				</Card>
				<Card className="w-full sm:col-span-1 p-4 sm:h-full min-h-[380px]">
					<CardBody className="gap-2 overflow-hidden">
						<span className="text-default-500 mb-2">
							TOP ORDERED ITEMS
						</span>
						<DashboardTable
							loading={loading}
							emptyContent="No orders in this range."
							data={stats?.topOrderedItems.map((item: any) => ({
								name: item.name,
								value: `${item.count} orders`,
								image: item.image,
							}))}
						/>
					</CardBody>
				</Card>
			</div>
		</div>
	);
}
