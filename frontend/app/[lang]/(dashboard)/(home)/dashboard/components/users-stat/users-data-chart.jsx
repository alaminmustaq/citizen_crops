"use client";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useThemeStore } from "@/store";
import { useTheme } from "next-themes";
import { themes } from "@/config/themes";
import { getGridConfig } from "@/lib/apex-chart-options";
import { useSelector } from "react-redux";

const UsersDataChart = ({ height = 160 }) => {
  const { dashboardData } = useSelector((state) => state.dashboard);

  // Extract snapshot data
  const toolSnapshot = dashboardData?.toolSnapshotTable || [];

  // Prepare series
  const categories = toolSnapshot.map(item => item.type); // ["Distributed", "Returned", "Lost", "Damaged"]
  const counts = toolSnapshot.map(item => parseInt(item.count, 10) || 0);

  const { theme: config } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((theme) => theme.name === config);

  const series = [
    {
      name: "Tools",
      data: counts,
    },
  ];

  const options = {
    chart: {
      type: "bar",
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: [
      `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].primary})`,
      `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].success})`,
      `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].destructive})`,
      `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].warning})`,
    ],
    grid: getGridConfig(
      `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].chartGird})`
    ),
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: theme?.cssVars[mode === "dark" ? "dark" : "light"].text,
          fontSize: "12px",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      show: true,
      labels: {
        style: {
          colors: theme?.cssVars[mode === "dark" ? "dark" : "light"].text,
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      theme: mode === "dark" ? "dark" : "light",
    },
  };

  return <Chart options={options} series={series} type="bar" height={height} width="100%" />;
};

export default UsersDataChart;
