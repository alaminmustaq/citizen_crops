"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BasicTableLayout from "@/components/table/basic-table-layout";
import columns from "../config/columns"; 
import { useEmploy } from "@/domains/employ/hook/useEmploy"; // similar to useProject
import { useAppSelector } from "@/hooks/use-redux";

const ToolAssignments = () => { 
  const { actions, employState } = useEmploy(); // same pattern like useProject()
  const employData = useAppSelector((state) => state.employ.employData);
  const employee = employData.employee;
  const { data, ...other } = employState;

  return ( 
    <Card className="w-full">
      <CardHeader className="border-none mb-0">
        <CardTitle className="text-lg font-semibold text-default-800 tracking-tight">
          Assigned Tools
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 pb-6">
      <BasicTableLayout
                    columns={columns(actions)}
                    state={{
                        ...other,
                        data: employee?.tool_distributions || [],
                    }}
                    filterCustom={{
                        status: {
                            multiple: true,
                            values: [
                                { key: "distributed", value: "Distributed" },
                                { key: "returned", value: "Returned" }, 
                                { key: "overdue", value: "Overdue" }, 
                                { key: "lost", value: "Lost" }, 
                                { key: "damaged", value: "Damaged" }, 
                            ],
                        }
                    }}
                    searchKey="tool_distributions"
                />  
      </CardContent>
    </Card>  
  );
};

export default ToolAssignments;