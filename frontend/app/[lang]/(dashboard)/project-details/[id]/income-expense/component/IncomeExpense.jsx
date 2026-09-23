"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BasicTableLayout from "@/components/table/basic-table-layout";
import { useProject } from "@/domains/project/hook/useProject";
import columns from "../config/columns"; 
import { useAppSelector } from "@/hooks/use-redux";

const IncomeExpense = () => {
    const { actions, projectState } = useProject(); // same pattern like useProject()
    const projectData = useAppSelector((state) => state.project.projectData);
    const project = projectData.project;
    const { data, ...other } = projectState; 

  return (
    <Card className="w-full">
      <CardHeader className="border-none mb-0">
        <CardTitle className="text-lg font-semibold text-default-800 tracking-tight">
          Income / Expense
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <BasicTableLayout
         columns={columns(actions)}
         state={{
            ...other,
            data: project?.financial_records || [],
        }}
        filterCustom={{
          transaction_type: {
              multiple: false,
              values: [
                  { key: "income", value: "income" },
                  { key: "expense", value: "Expense" }, 
              ],
          }
      }}
      search={false}
        />
      </CardContent>
    </Card>
  );
};

export default IncomeExpense;
