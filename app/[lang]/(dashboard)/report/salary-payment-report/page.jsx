"use client";

import { useEffect, useState } from "react";
import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import { DynamicForm } from "@/components/form/dynamic-form";
import formFields from "./config/fields";
import columns from "./config/columns";
import { useReport } from "@/domains/report/hook/useReport";
import ReportActions from "@/components/report/ReportActions";
import CollapsibleToggleButton from "@/components/ui/CollapsibleToggleButton";
import { useFetchFeatureSettingsQuery } from "@/domains/settings/services/featureSettingApi";
import {
    enforceProjectFeatureFormState,
    filterProjectFeatureItems,
    isProjectFeatureEnabled,
} from "@/lib/menu-features";

const SalaryPaymentReportPage = () => {
    const { actions, reportState } = useReport("hrm/salary-payments", "salary-payment-report");
    const [filtersOpen, setFiltersOpen] = useState(true);

    const { data: featureSettings } = useFetchFeatureSettingsQuery();
    const projectEnabled = isProjectFeatureEnabled(featureSettings);

    const projectId = reportState.form.watch("project_id");
    const scopeType = reportState.form.watch("scope_type");

    useEffect(() => {
        enforceProjectFeatureFormState(reportState.form, projectEnabled);
    }, [reportState.form, projectEnabled, projectId, scopeType]);

    return (
        <PageLayout>
            {/* Filter Header */}
            <div className="mb-4 flex justify-between items-center">
                <CollapsibleToggleButton
                    isOpen={filtersOpen}
                    onToggle={() => setFiltersOpen((prev) => !prev)}
                />
            </div>

            {/* Collapsible Filter Panel */}
            {filtersOpen && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-md shadow mb-6 transition-all duration-300">
                    <DynamicForm
                        form={reportState.form}
                        fields={filterProjectFeatureItems(
                            formFields(
                                reportState.form,
                                reportState.user,
                            ),
                            projectEnabled,
                        )}
                        onSubmit={() => actions.handleAction("filter")}
                    />

                    <ReportActions
                        form={reportState.form}
                        onAction={actions.handleAction}
                        onReset={actions.onReset}
                    />
                </div>
            )}

            {/* Payment Report Table */}
            <BasicTableLayout
                columns={filterProjectFeatureItems(
                    columns(
                        {},
                        projectEnabled,
                    ),
                    projectEnabled,
                )}
                state={reportState}
                search
                addPermission={null}
            />
        </PageLayout>
    );
};

export default SalaryPaymentReportPage;
