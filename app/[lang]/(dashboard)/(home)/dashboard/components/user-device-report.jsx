"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDashboardFetchQuery } from "@/domains/dashboard/services/dashboardApi";
import { setJobPositionData } from "@/domains/dashboard/model/dashboardSlice";
import { useThemeStore } from "@/store";
import { useTheme } from "next-themes";
import { themes } from "@/config/themes";
import { translate } from "@/lib/utils";

const UserDeviceReport = ({ height = 250 }) => {
    const dispatch = useDispatch();
    const { theme: config, isRtl } = useThemeStore();
    const { theme: mode } = useTheme();
    const theme = themes.find((theme) => theme.name === config);

    // Redux & API
    const { dashboardData } = useSelector((state) => state.dashboard);
    const translation_state = useSelector((state) => state.auth.translation);
    const { data, isLoading } = useDashboardFetchQuery();

    // ✅ On API success, store formatted job position data
    useEffect(() => {
        if (data?.employee_by_jobposition) {
            const formattedData = data.employee_by_jobposition.map(
                (item, index) => ({
                    id: index + 1,
                    job_position: item.job_position,
                    employee_count: item.employee_count,
                })
            );
            dispatch(setJobPositionData(formattedData));
        }
    }, [data, dispatch]);

    // ✅ Chart setup
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
                                    mode === "dark" || mode === "system"
                                        ? "dark"
                                        : "light"
                                ].chartLabel
                            })`,
                        },
                        value: {
                            show: true,
                            fontSize: "14px",
                            fontWeight: 600,
                            color: `hsl(${
                                theme?.cssVars[
                                    mode === "dark" || mode === "system"
                                        ? "dark"
                                        : "light"
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
                                    mode === "dark" || mode === "system"
                                        ? "dark"
                                        : "light"
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

    const labels = dashboardData.employee_by_jobposition?.map(
        (i) => i.job_position
    );
    const series = dashboardData.employee_by_jobposition?.map(
        (i) => i.employee_count
    );

    //  Loading and empty states
    if (isLoading) return <p>Loading...</p>;
    if (!series?.length)
        return (
            <p className="text-center text-sm text-default-500">
                No data available
            </p>
        );

    return (
        <Card>
            <CardHeader className="border-none pb-0 mb-5">
                <div className="flex items-center gap-1">
                    <h3 className="text-sm font-medium text-center mb-2 text-default-700">
                        {translate(
                            dashboardData?.pieChartTwoTitle,
                            translation_state
                        )}
                    </h3>
                </div>
            </CardHeader>

            <CardContent className="px-5 pb-0">
                <Chart
                    options={baseOptions(labels)}
                    series={series}
                    type="donut"
                    height={height}
                    width="100%"
                />
            </CardContent>
        </Card>
    );
};

export default UserDeviceReport;
