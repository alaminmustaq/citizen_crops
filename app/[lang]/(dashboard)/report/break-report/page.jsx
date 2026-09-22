"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import { DynamicForm } from "@/components/form/dynamic-form";
import formFields from "./config/fields";
import columns from "./config/columns";
import { useReport } from "@/domains/report/hook/useReport";
import { Button } from "@/components/ui/button";
import ReportActions from "@/components/report/ReportActions";
import useAuth from "@/domains/auth/hooks/useAuth";
import { useEffect } from "react";
import { useFetchFeatureSettingsQuery } from "@/domains/settings/services/featureSettingApi";
import {
    enforceProjectFeatureFormState,
    filterProjectFeatureItems,
    isProjectFeatureEnabled,
} from "@/lib/menu-features";

const BreakReportPage = () => {
    const { actions, reportState } = useReport(
        "attendance-report/break-report",
        "break-report",
    );
    const { user } = useAuth();
    const { data: featureSettings } = useFetchFeatureSettingsQuery();
    const projectEnabled = isProjectFeatureEnabled(featureSettings);
    const projectId = reportState.form.watch("project_id");

    useEffect(() => {
        enforceProjectFeatureFormState(reportState.form, projectEnabled);
    }, [reportState.form, projectEnabled, projectId]);

    return (
        <PageLayout>
            <div className="bg-white p-6 rounded-md shadow mb-6 relative z-20">
                <DynamicForm
                    form={reportState.form}
                    fields={filterProjectFeatureItems(formFields(reportState.form, user), projectEnabled)}
                    onSubmit={() => actions.handleAction("filter")}
                />

                <ReportActions
                    form={reportState.form}
                    onAction={actions.handleAction}
                    onReset={actions.onReset}
                />
            </div>

            <BasicTableLayout
                columns={filterProjectFeatureItems(columns(), projectEnabled)}
                state={reportState}
                search
                addPermission={null}
                searchKey="employee_search"
            />
        </PageLayout>
    );
};

export default BreakReportPage;
