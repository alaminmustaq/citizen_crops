"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import { Icon } from "@iconify/react";
import { Cup, Eye, Increase, Session } from "@/components/svg";
import { useDashboardFetchQuery } from "@/domains/dashboard/services/dashboardApi";
import { useSelector } from "react-redux";
import { translate } from "@/lib/utils";

const ReportsArea = () => {
    const { dashboardData } = useSelector((state) => state.dashboard);
    const translation_state = useSelector((state) => state.auth.translation);
 

    
    // const reports = [
    //     {
    //         id: 1,
    //         name: "Salarry Generated",
    //         count: "3,321",
    //         rate: "10",
    //         isUp: true,
    //         icon: <Icon icon="heroicons:users-20-solid" className="h-4 w-4" />,
    //         color: "primary",
    //     },
    // ];

    return (
        <>
            {dashboardData.salaryGenerated?.map((item, index) => {
              const iconName = item.icon;
              const IconComponent = LucideIcons[iconName] || LucideIcons.FileText;
                return (
                    <Card key={`report-card-${index}`}>
                        <CardHeader className="flex-col-reverse sm:flex-row flex-wrap gap-2  border-none mb-0 pb-0">
                            <span className="text-sm font-medium text-default-900 flex-1">
                                   {translate(item.name,
                                                                                translation_state
                                                                            )}
                               
                            </span>
                            <span
                                className={cn(
                                    "flex-none h-9 w-9 flex justify-center items-center bg-default-100 rounded-full",
                                    {
                                        "bg-primary/10 text-primary":
                                            item.color === "primary",
                                        "bg-info/10 text-info":
                                            item.color === "info",
                                        "bg-warning/10 text-warning":
                                            item.color === "warning",
                                        "bg-destructive/10 text-destructive":
                                            item.color === "destructive",
                                    }
                                )}
                            >
                                <IconComponent className="w-4 h-4" />
                            </span>
                        </CardHeader>
                        <CardContent className="pb-4 px-4">
                            <div className="text-2xl font-semibold text-default-900 mb-2.5">
                                  {translate(item.count,
                                                                                translation_state
                                                                            )}
                            </div>
                            <div className="flex items-center font-semibold gap-1">
                                {item.isUp ? (
                                    <>
                                        <span className="text-gray-400">
                                            {item.rate}%
                                        </span>
                                        <Icon
                                            icon="heroicons:arrow-trending-up-16-solid"
                                            className="text-gray-400 text-xl"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <span className="text-gray-500">
                                            {item.rate}
                                        </span>
                                        <Icon
                                            icon="heroicons:arrow-trending-down-16-solid"
                                            className="text-gray-500 text-xl"
                                        />
                                    </>
                                )}
                            </div>
                            <div className="mt-1 text-xs text-default-600">
                                vs Previous 30 Days
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </>
    );
};

export default ReportsArea;
