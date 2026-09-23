"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BasicTableLayout from "@/components/table/basic-table-layout"; 
import columns from "../config/columns"; 
import { useProject } from "@/domains/project/hook/useProject";
import { useAppSelector } from "@/hooks/use-redux";


const ToolAssignments = () => {
    const { actions, projectState } = useProject(); // same pattern like useProject()
    const projectData = useAppSelector((state) => state.project.projectData);
    const project = projectData.project;
    const { data, ...other } = projectState; 
    



  return (
      <Card className="w-full">
          <CardHeader className="border-none mb-0">
              <CardTitle className="text-lg font-semibold text-default-800 tracking-tight">
                  Tool Assignments
              </CardTitle>
          </CardHeader>

          <CardContent className="px-6 pb-6">
              <BasicTableLayout
                  columns={columns(actions)}
        
                  state={{
                    ...other,
                    data: project?.tool_distribution_items || [],
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