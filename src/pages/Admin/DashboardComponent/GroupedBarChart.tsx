import ReactECharts from "echarts-for-react";

export function GroupedBarChart() {
  const option = {
    tooltip: {
      trigger: "item",
      axisPointer: {
        type: "shadow",
      },
      formatter: "{b}: {c}",
    },
    legend: {
      data: ["Completed", "Canceled"],
      top: 0,
      textStyle: {
        fontSize: 14,
        fontWeight: "bold",
      },
    },
    grid: {
      top: 40,
      left: "8%",
      right: "4%",
      bottom: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      name: "Day",
      nameLocation: "middle",
      nameGap: 30,
      axisLabel: {
        fontSize: 14,
        fontWeight: "normal",
      },
      nameTextStyle: {
        fontSize: 16,
        fontWeight: "bold",
      },
    },
    yAxis: {
      type: "value",
      name: "Orders Count",
      nameLocation: "middle",
      nameGap: 35,
      nameRotate: 90,
      axisLabel: {
        fontSize: 14,
        fontWeight: "normal",
      },
      nameTextStyle: {
        fontSize: 16,
        fontWeight: "bold",
      },
    },
    series: [
      {
        name: "Completed",
        type: "bar",
        data: [120, 200, 150, 80, 70, 110, 130],
        itemStyle: {
          color: "#4ade80",
        },
        emphasis: {
          focus: "series",
        },
      },
      {
        name: "Canceled",
        type: "bar",
        data: [20, 50, 30, 10, 15, 25, 40],
        itemStyle: {
          color: "#ef4444",
        },
        emphasis: {
          focus: "series",
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
