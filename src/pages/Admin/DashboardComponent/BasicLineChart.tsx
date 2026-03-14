import ReactECharts from "echarts-for-react";
import { Skeleton } from "@heroui/react";

interface BasicLineChartProps {
	data?: { date: string; amount: number }[];
	loading: boolean;
}

export function BasicLineChart({ data, loading }: BasicLineChartProps) {
	if (loading) {
		return <Skeleton className="w-full h-[300px] rounded-lg" />;
	}

	const option = {
		tooltip: {
			trigger: "axis",
			formatter: "{b}: ₱{c}",
		},

		xAxis: {
			type: "category",
			data: data?.map((d) => d.date) ?? [],
			name: "Date",
			nameLocation: "middle",
			nameGap: 30,
			axisLabel: {
				fontSize: 12,
				rotate: 45,
			},
		},
		yAxis: {
			type: "value",
			name: "Revenue (₱)",
			nameLocation: "middle",
			nameGap: 40,
			nameRotate: 90,
			axisLabel: { fontSize: 12 },
		},

		grid: {
			top: 20,
			right: 20,
			bottom: 60,
			left: 60,
		},

		series: [
			{
				data: data?.map((d) => d.amount) ?? [],
				type: "line",
				smooth: true,
				lineStyle: {
					width: 3,
					color: "#4ade80",
				},
				itemStyle: {
					color: "#4ade80",
				},
				areaStyle: {
					color: "rgba(34,197,94,0.15)",
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
