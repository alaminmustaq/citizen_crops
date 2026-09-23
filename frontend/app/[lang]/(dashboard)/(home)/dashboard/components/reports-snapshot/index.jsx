"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportsChart from "./reports-chart";
import { useThemeStore } from "@/store";
import { useTheme } from "next-themes";
import { themes } from "@/config/themes";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DashboardSelect from "@/components/dasboard-select";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDashboardFetchQuery } from "@/domains/dashboard/services/dashboardApi";
import { setDashboardData } from "@/domains/dashboard/model/dashboardSlice"; 
import { translate } from "@/lib/utils";

const ReportsSnapshot = () => {
  const dispatch = useDispatch();
  const { data, isLoading } = useDashboardFetchQuery();
  const { dashboardData } = useSelector((state) => state.dashboard); 
  const translation_state = useSelector((state) => state.auth.translation);


  const chartData = dashboardData?.chartSeries || [];



  // Theme setup
  const { theme: config } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((theme) => theme.name === config);
  const primary = `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].primary})`;
  const warning = `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].warning})`;
  const success = `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].success})`;
  const info = `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].info})`;

  // Helper to map color name to HSL
  const getHslColor = (colorName) => {
    switch (colorName) {
      case "primary":
        return primary;
      case "success":
        return success;
      case "info":
        return info;
      case "warning":
        return warning;
      default:
        return primary;
    }
  };

  if (isLoading) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        {translate("Loading dashboard data",translation_state)}...
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="border-none pb-0">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex-1">
            <div className="text-xl font-semibold text-default-900 whitespace-nowrap">
              {translate("Workforce Overview",translation_state)}
            </div>
            <span className="text-xs text-default-600">
              {translate("Demographic properties of your workforce",translation_state)}
            </span>
          </div>
          {/* <div className="flex-none">
            <DashboardSelect />
          </div> */}
        </div>
      </CardHeader>

      <CardContent className="p-1 md:p-5">
        <Tabs defaultValue={dashboardData.data?.value || "employee"}>
          <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6 justify-start w-full bg-transparent h-full">
              {dashboardData.data?.map((item, index) => (
                <TabsTrigger
                  key={`report-trigger-${index}`}
                  value={item.value}
                  className={cn(
                    "flex flex-col gap-1.5 p-4 overflow-hidden items-start relative before:absolute before:left-1/2 before:-translate-x-1/2 before:bottom-1 before:h-[2px] before:w-9 before:bg-primary/50 dark:before:bg-primary-foreground before:hidden data-[state=active]:before:block",
                    {
                      "bg-primary/30 data-[state=active]:bg-primary/50 dark:bg-primary/70":
                        item.color === "primary",
                      "bg-warning/30 data-[state=active]:bg-warning/50 dark:bg-orange-500":
                        item.color === "warning",
                      "bg-success/30 data-[state=active]:bg-success/50 dark:bg-green-500":
                        item.color === "success",
                      "bg-info/30 data-[state=active]:bg-info/50 dark:bg-cyan-500":
                        item.color === "info",
                    }
                  )}
                >
                  <span className="text-sm text-default-800 dark:text-primary-foreground font-semibold capitalize relative z-10 text-wrap text-start">
                    {translate(item.text,translation_state)}
                  </span>
                  <span
                    className={`text-lg font-semibold text-${item.color}/80 dark:text-primary-foreground`}
                  >
                    {item.total}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList> 

          {/* Dynamic chart content */}
          {chartData.map((chart, index) => {
            const chartHsl = getHslColor(chart.color);
            return (
              <TabsContent key={`report-tab-${index}`} value={chart.value}>
                <ReportsChart
                  // Deep clone the series to prevent ApexCharts from mutating frozen state
                  series={chart.series.map((s) => ({ ...s, data: [...s.data] }))}
                  chartColor={chartHsl}
                />
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ReportsSnapshot;
