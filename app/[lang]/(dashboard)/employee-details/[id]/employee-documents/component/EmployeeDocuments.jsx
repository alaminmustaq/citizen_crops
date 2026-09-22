"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BasicTableLayout from "@/components/table/basic-table-layout";
import columns from "../config/columns"; 

import { useDocument } from "@/domains/document/hook/useDocument"; 
import { useAppSelector } from "@/hooks/use-redux";

const EmployeeDocuments = () => {
  // document actions (edit / delete)
  const { actions } = useDocument();

  // Get the currently selected employee from Redux
  const employData = useAppSelector((state) => state.employ.employData);
  const employee = employData.employee;

  return (
    <Card className="w-full">
      <CardHeader className="border-none mb-0">
        <CardTitle className="text-lg font-semibold text-default-800 tracking-tight">
          Employee Documents
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <BasicTableLayout
          search={false}
          columns={columns(actions)}
          state={{
            data: employee?.document_details || [],
            pagination: true,
                        isFetching: false,
          }}
        />
      </CardContent>
    </Card>
  );
};

export default EmployeeDocuments;
