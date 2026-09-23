"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BasicTableLayout from "@/components/table/basic-table-layout";
import columns from "../config/columns";
import { useEmploy } from "@/domains/employ/hook/useEmploy"; // similar to useProject
import { useAppSelector } from "@/hooks/use-redux";
import { useEffect } from "react";

const ProjectActivity = () => {
    const { actions, employState } = useEmploy(); // same pattern like useProject()
    const employData = useAppSelector((state) => state.employ.employData);
    const employee = employData.employee;
    const { data, ...other } = employState;
    // useEffect(()=>{
    //     other.refetch();
    // },[])

    return (
        <Card className="w-full">
            <CardHeader className="border-none mb-0">
                <CardTitle className="text-lg font-semibold text-default-800 tracking-tight">
                    Project Activities
                </CardTitle>
            </CardHeader>

            <CardContent className="px-6 pb-6">
                <BasicTableLayout
                    columns={columns(actions)}
                    state={{
                        ...other,
                        data: employee?.projectEmployees || [],
                    }}
                    filterCustom={{
                        status: {
                            multiple: false,
                            values: [
                                { key: "0", value: "Active" },
                                { key: "1", value: "Inactive" }, 
                            ],
                        }
                    }}
                    searchKey="project_activity"
                />
            </CardContent>
        </Card>
    );
};

export default ProjectActivity;
