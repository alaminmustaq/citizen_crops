"use client";

import PageLayout from "@/components/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BasicTableLayout from "@/components/table/basic-table-layout"; 
import columns from "../config/columns"; 
import { useProject } from "@/domains/project/hook/useProject";
import { useAppSelector } from "@/hooks/use-redux";
const Employee = () => {
 const { actions, projectState } = useProject(); // projectState.data will have projects
  const projectData = useAppSelector((state) => state.project.projectData);
  let project = projectData.project;
 

  return (
      <Card className="w-full">
          <CardHeader className="border-none mb-0">
              <CardTitle className="text-lg font-semibold text-default-800 tracking-tight">
                  Project Employee
              </CardTitle>
          </CardHeader>

          <CardContent className="px-6 pb-6">
              <BasicTableLayout
                  columns={columns(actions)}
                  state={{ data: project.assigned_employees || [] }}
              />
          </CardContent>
      </Card>
  );
};

export default Employee;
