import ReactECharts from "echarts-for-react";

export function BasicLineChart() {
  const option = {
    tooltip: {
      trigger: "axis",
      formatter: "{b}: ₱{c}",
    },

    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      name: "Day",
      nameLocation: "middle",
      nameGap: 30,
      axisLabel: {
        fontSize: 14,
      },
      nameTextStyle: {
        fontSize: 16,
        fontWeight: "bold",
      },
    },
    yAxis: {
      type: "value",
      name: "Revenue (₱)",
      nameLocation: "middle",
      nameGap: 30,
      nameRotate: 90,
      axisLabel: { fontSize: 14 },
      nameTextStyle: {
        fontSize: 16,
        fontWeight: "bold",
      },
    },

    grid: {
      top: 20,
      right: 20,
      bottom: 30,
      left: 20,
    },

    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: "line",
        lineStyle: {
          width: 3,
          color: "#4ade80",
        },
        itemStyle: {
          color: "#4ade80", // points color
        },
        areaStyle: {
          color: "rgba(34,197,94,0.15)",
        },
      },
    ],
  };

  return (
    <div>
      <ReactECharts option={option} />
    </div>
  );
}
