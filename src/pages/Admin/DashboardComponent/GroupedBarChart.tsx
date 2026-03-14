import ReactECharts from "echarts-for-react";
import { Skeleton } from "@heroui/react";

interface GroupedBarChartProps {
	data?: { date: string; completed: number; cancelled: number }[];
	loading: boolean;
}

export function GroupedBarChart({ data, loading }: GroupedBarChartProps) {
	if (loading) {
		return <Skeleton className="w-full h-[300px] rounded-lg m-4" />;
	}

	const option = {
		tooltip: {
			trigger: "axis",
			axisPointer: {
				type: "shadow",
			},
		},
		legend: {
			data: ["Completed", "Cancelled"],
			top: 0,
		},
		grid: {
			top: 40,
			left: "8%",
			right: "4%",
			bottom: "15%",
			containLabel: true,
		},
		xAxis: {
			type: "category",
			data: data?.map((d) => d.date) ?? [],
			axisLabel: {
				rotate: 45,
			},
		},
		yAxis: {
			type: "value",
			name: "Orders",
		},
		series: [
			{
				name: "Completed",
				type: "bar",
				data: data?.map((d) => d.completed) ?? [],
				itemStyle: {
					color: "#4ade80",
				},
			},
			{
				name: "Cancelled",
				type: "bar",
				data: data?.map((d) => d.cancelled) ?? [],
				itemStyle: {
					color: "#ef4444",
				},
			},
		],
	};

	return (
		<div className="h-[300px]">
			<ReactECharts
				option={option}
				style={{ height: "100%", width: "100%" }}
			/>
		</div>
	);
}
