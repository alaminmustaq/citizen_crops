"use client";

import { useEffect, useState } from "react";
import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import columns from "./config/columns";
import fields from "./config/fields";
import filterFields from "./config/filterFields";
import BasicModel from "@/components/model/basic-model";
import { useSalary } from "@/domains/salary/hook/useSalary";
import ApprovedFields from "./config/ApprovedFields";
import PaySalaryModal from "./components/PaySalaryModal";
import BulkPaySalaryModal from "./components/BulkPaySalaryModal";
import ApprovedSalaryPreviewTable from "./components/ApprovedSalaryPreviewTable";
import CollapsibleToggleButton from "@/components/ui/CollapsibleToggleButton";
import { DynamicForm } from "@/components/form/dynamic-form";
import ReportActions from "@/components/report/ReportActions";
import { useFetchFeatureSettingsQuery } from "@/domains/settings/services/featureSettingApi";
import {
    enforceProjectFeatureFormState,
    filterProjectFeatureItems,
    isPartialPaymentFeatureEnabled,
    isProjectFeatureEnabled,
    isSalaryApprovalFeatureEnabled,
} from "@/lib/menu-features";

const SalaryGeneratePage = () => {
    const { actions, salaryState } = useSalary();
    const [filtersOpen, setFiltersOpen] = useState(false);
    const { data: featureSettings } = useFetchFeatureSettingsQuery();
    const projectEnabled = isProjectFeatureEnabled(featureSettings);
    const salaryApprovalEnabled = isSalaryApprovalFeatureEnabled(featureSettings);
    const partialPaymentEnabled = isPartialPaymentFeatureEnabled(featureSettings);
    const projectId = salaryState.form.watch("project_id");
    const scopeType = salaryState.form.watch("scope_type");

    useEffect(() => {
        enforceProjectFeatureFormState(salaryState.form, projectEnabled);
    }, [salaryState.form, projectEnabled, projectId, scopeType]);

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
                <div className="bg-white p-6 rounded-md shadow mb-6 transition-all duration-300">
                    <DynamicForm
                        form={salaryState.form}
                        fields={filterProjectFeatureItems(
                            filterFields(
                                salaryState.form,
                                salaryState.user,
                                salaryApprovalEnabled,
                            ),
                            projectEnabled,
                        )}
                        onSubmit={() => actions.onFilter}
                    />
                    <ReportActions
                        form={salaryState.form}
                        onAction={actions.onFilter}
                        onReset={actions.onReset}
                        showPdf={false}
                        showExcel={false}
                    />
                </div>
            )}

            <BasicTableLayout
                addButtonLabel={{
                    GenerateSalary: {
                        label: "Generate Salary",
                        action: actions.onGenerateSalary,
                        permission: "generate_salary",
                        color: "primary",
                    },
                    ...(salaryApprovalEnabled
                        ? {
                              ApprovedSalary: {
                                  label: "Approved Salary",
                                  action: actions.onApproveSalary,
                                  permission: "approved-salary",
                                  color: "success",
                              },
                          }
                        : {}),
                    ...(partialPaymentEnabled
                        ? {
                              BulkPaySalary: {
                                  label: (selectedRows) =>
                                      selectedRows?.length
                                          ? `Bulk Pay (${selectedRows.length})`
                                          : "Bulk Pay",
                                  action: (selectedRows, resetSelection) =>
                                      actions.onOpenBulkPayModal(
                                          selectedRows,
                                          resetSelection,
                                      ),
                                  permission: "approved-salary",
                                  color: "warning",
                                  disabled: (selectedRows) =>
                                      !selectedRows || selectedRows.length === 0,
                              },
                          }
                        : {}),
                }}
                columns={filterProjectFeatureItems(
                    columns(
                        actions,
                        projectEnabled,
                        salaryApprovalEnabled,
                        partialPaymentEnabled,
                    ),
                    projectEnabled,
                )}
                state={salaryState}
            />
            <BasicModel
                title={
                    salaryState?.form?.watch("model_for") == "approved_salary"
                        ? "Approved Salary"
                        : "Generate Salary"
                }
                submitLabel={
                    salaryState?.form?.watch("model_for") == "approved_salary"
                        ? "Approved"
                        : "Generate"
                }
                cancelLabel="Cancel"
                size="4xl"
                alwaysShowChildren={true}
                form={salaryState.form}
                fields={filterProjectFeatureItems(
                    salaryState?.form?.watch("model_for") == "approved_salary"
                        ? ApprovedFields(
                              salaryState.form,
                              actions,
                              salaryState.user,
                              partialPaymentEnabled,
                          )
                        : fields(
                              salaryState.form,
                              actions,
                              salaryState.user,
                              salaryApprovalEnabled,
                              partialPaymentEnabled,
                          ),
                    projectEnabled,
                )}
                actions={actions}
            >
                {(salaryState?.form?.watch("model_for") === "approved_salary" ||
                    salaryState?.form?.watch("pay_full")) && (
                    <ApprovedSalaryPreviewTable
                        form={salaryState.form}
                        actions={actions}
                        salaryState={salaryState}
                    />
                )}
            </BasicModel>
            <PaySalaryModal salaryState={salaryState} actions={actions} />
            <BulkPaySalaryModal salaryState={salaryState} actions={actions} />
        </PageLayout>
    );
};

export default SalaryGeneratePage;
