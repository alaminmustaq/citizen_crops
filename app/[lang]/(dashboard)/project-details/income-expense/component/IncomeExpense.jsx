"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BasicTableLayout from "@/components/table/basic-table-layout";
import { useFinancialRecords } from "@/domains/finance/hook/useFinancialRecords";
import columns from "../config/columns"; 
import { useAppSelector } from "@/hooks/use-redux";

const IncomeExpense = () => {
  const { actions, financialState } = useFinancialRecords();
  
   const projectData = useAppSelector((state) => state.project.projectData);
   let project = projectData.project;
   console.log("Project Financial Records:", project);

  // Flatten and filter project-specific records
   const projectFinancialRecords = (project.financial_records || []).map(
       (record) => {
           return {
               id: record.id,
               transaction_type:
                   record.financial_type === "income" ? "Income" : "Expense",
               date: record.receive_payment_date?.split(" ")[0] || "—",
               description: record.reference_remarks || "—",
               amount: record.total_amount || 0,
           };
       }
   );

  const filteredState = {
    ...financialState,
    data: projectFinancialRecords,
  };

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
          state={{data: projectFinancialRecords }}
        />
      </CardContent>
    </Card>
  );
};

export default IncomeExpense;
