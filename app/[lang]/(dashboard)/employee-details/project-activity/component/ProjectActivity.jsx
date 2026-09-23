"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BasicTableLayout from "@/components/table/basic-table-layout";
import columns from "../config/columns"; 
import { useEmploy } from "@/domains/employ/hook/useEmploy"; // similar to useProject
import { useAppSelector } from "@/hooks/use-redux";

const ProjectActivity = () => {
  const { actions } = useEmploy();   // same pattern like useProject()
  const employData = useAppSelector((state) => state.employ.employData);
  const employee = employData.employee;

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
          state={{ data: employee?.projectEmployees || [] }}
        />
      </CardContent>
    </Card>
  );
};

export default ProjectActivity;
