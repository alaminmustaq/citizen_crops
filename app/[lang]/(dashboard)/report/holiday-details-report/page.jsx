"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import { DynamicForm } from "@/components/form/dynamic-form";
import formFields from "./config/fields";
import columns from "./config/columns";
import { useReport } from "@/domains/report/hook/useReport";
import ReportActions from "@/components/report/ReportActions";

const LeaveDetailsReportPage = () => {
    const { actions, reportState } = useReport(
       "holiday/holiday_posting",
        "holiday_posting"
    );

    return (
        <PageLayout>
            {/* Filters */}
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

            {/* Table */}
            <BasicTableLayout
                columns={columns()}
                state={reportState}
                search={true}
                addPermission={null}
            />
        </PageLayout>
    );
};

export default LeaveDetailsReportPage;
