"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import UsersDataChart from "./users-data-chart";
import UsersDataTable from "./users-data-table";
import { useSelector } from "react-redux";
import { translate } from "@/lib/utils";

const UsersStat = () => {
    const { dashboardData } = useSelector((state) => state.dashboard); 
    const translation_state = useSelector((state) => state.auth.translation); 
    
    return (
        <Card>
            <CardHeader className="border-none pb-0 mb-5">
                <div className="flex items-center gap-1">
                    <div className="flex-1">
                        <div className="text-xl font-semibold text-default-900">
                            {translate("Tool Distribution",translation_state)}
                        </div>
                        <span className="text-xs text-default-600 ml-1">
                            {translate("Status of Tools in Last 30 Days",translation_state)}
                        </span>
                    </div>
                    {/* <div className="flex-none flex items-center gap-1">
                        <span className="text-4xl font-semibold text-primary">
                            63
                        </span>
                        <span className="text-2xl text-success">
                            <Icon icon="heroicons:arrow-trending-up-16-solid" />
                        </span>
                    </div> */}
                </div>
            </CardHeader>
            <CardContent className="px-5 pb-0">
                <p className="text-xs font-medium text-default-800">
                  {translate("Tools Issued vs Returned",translation_state)}
                </p>
                <UsersDataChart />
                <UsersDataTable
                    toolSnapshotTable={dashboardData.toolSnapshotTable}
                />
            </CardContent>
        </Card>
    );
};

export default UsersStat;
