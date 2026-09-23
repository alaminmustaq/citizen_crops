"use client";

import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useThemeStore } from "@/store";
import { useTheme } from "next-themes";
import { themes } from "@/config/themes";
import { useSelector } from "react-redux";
import { translate } from "@/lib/utils";

const UserStats = ({ height = 250 }) => {
  const { theme: config, isRtl } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((theme) => theme.name === config);

  // ✅ Get both dashboard data and users by department
  const { dashboardData } = useSelector((state) => state.dashboard);
    const translation_state = useSelector((state) => state.auth.translation);
  // const usersData = useSelector((state) => state.dashboard.usersData || []);

  const getColors = () => [
    `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].primary})`,
    `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].info})`,
    "hsl(30, 70%, 85%)",
    "hsl(150, 60%, 80%)",
  ];

  const baseOptions = (labels) => ({
    chart: { toolbar: { show: false } },
    labels,
    dataLabels: { enabled: false },
    colors: getColors(),
    tooltip: { theme: mode === "dark" ? "dark" : "light" },
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "14px",
              fontWeight: 600,
              colors: `hsl(${
                theme?.cssVars[
                  mode === "dark" || mode === "system" ? "dark" : "light"
                ].chartLabel
              })`,
            },
            value: {
              show: true,
              fontSize: "14px",
              fontWeight: 600,
              color: `hsl(${
                theme?.cssVars[
                  mode === "dark" || mode === "system" ? "dark" : "light"
                ].chartLabel
              })`,
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "16px",
              fontWeight: 600,
              color: `hsl(${
                theme?.cssVars[
                  mode === "dark" || mode === "system" ? "dark" : "light"
                ].chartLabel
              })`,
            },
          },
        },
      },
    },
    legend: {
      position: "bottom",
      labels: {
        colors: `hsl(${
          theme?.cssVars[
            mode === "dark" || mode === "system" ? "dark" : "light"
          ].chartLabel
        })`,
      },
      itemMargin: { horizontal: 10, vertical: 8 },
      markers: {
        width: 10,
        height: 10,
        radius: 10,
        offsetX: isRtl ? 5 : -5,
      },
    },
  });

  // ✅ Prepare chart data
  // const dashboardLabels = dashboardData.map((item) => item.text);
  // const dashboardSeries = dashboardData.map((item) => item.total);

  const usersLabels = dashboardData.department_by_employee?.map((item) =>  item.department);
  const usersSeries = dashboardData.department_by_employee?.map((item) => item.employee_count); 

  if (!usersSeries?.length) {
    return <p className="text-center text-sm text-default-500">No data available</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Employee by Department */}
      {usersSeries?.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-center mb-2 text-default-700">
             {translate(dashboardData?.pieChartOneTitle,
                                                translation_state
                                            )}
           
          </h3>
          <Chart
            options={baseOptions(usersLabels)}
            series={usersSeries}
            type="donut"
            height={height}
            width="100%"
          />
        </div>
      )}
    </div>
  );
};

export default UserStats;
