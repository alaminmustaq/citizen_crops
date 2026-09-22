"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import { DynamicForm } from "@/components/form/dynamic-form";
import formFields from "./config/fields";
import columns from "./config/columns";
import { useReport } from "@/domains/report/hook/useReport";
import { Button } from "@/components/ui/button";
import ReportActions from "@/components/report/ReportActions";

const FinanceReportDetailsPage = () => {
    const { actions, reportState } = useReport("finance/financial-records","financial-records");
    console.log(reportState.data);
    
    return (
        <PageLayout>
            <div className="bg-white p-6 rounded-md shadow mb-6">
                <DynamicForm
                    form={reportState.form}
                    fields={formFields(reportState.form)}
                    onSubmit={() => actions.handleAction("filter")}
                />

                <ReportActions
                    form={reportState.form}
                    onAction={actions.handleAction}
                    onReset={actions.onReset}
                />
            </div>

            <BasicTableLayout
                columns={columns()}
                state={reportState}
                search
                addPermission={null} 
            />
        </PageLayout>
    );
};

export default FinanceReportDetailsPage;
