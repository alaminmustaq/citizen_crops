"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import BasicModel from "@/components/model/basic-model";
import columns from "./config/columns";
import fields from "./config/fields";
import { useForm } from "react-hook-form";
import { DynamicForm } from "@/components/form/dynamic-form";
import filterFields from "./config/filterFields";
import ReportActions from "@/components/report/ReportActions";
import { useEffect, useState } from "react";
import CollapsibleToggleButton from "@/components/ui/CollapsibleToggleButton";
import { usePunishmentGeneral } from "@/domains/punishment/punishment-general/hook/usePunishmentGeneral";
import { useFetchFeatureSettingsQuery } from "@/domains/settings/services/featureSettingApi";
import {
    enforceProjectFeatureFormState,
    filterProjectFeatureItems,
    isProjectFeatureEnabled,
} from "@/lib/menu-features";

const PunishmentGeneralPage = () => {
    const { actions, punishmentGeneralState, skippedEmployeesModal } =
        usePunishmentGeneral();
    const [filtersOpen, setFiltersOpen] = useState(false);
    const { data: featureSettings } = useFetchFeatureSettingsQuery();
    const projectEnabled = isProjectFeatureEnabled(featureSettings);
    const projectId = punishmentGeneralState.form.watch("project_id");
    const scopeType = punishmentGeneralState.form.watch("scope_type");
    console.log(punishmentGeneralState);

    const skippedForm = useForm({
        defaultValues: {
            openModel: false,
        },
    });

    useEffect(() => {
        skippedForm.setValue("openModel", !!skippedEmployeesModal.open);
    }, [skippedEmployeesModal.open, skippedForm]);

    useEffect(() => {
        enforceProjectFeatureFormState(punishmentGeneralState.form, projectEnabled);
    }, [punishmentGeneralState.form, projectEnabled, projectId, scopeType]);

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
                        form={punishmentGeneralState.form}
                        fields={filterProjectFeatureItems(filterFields(punishmentGeneralState.form), projectEnabled)}
                        onSubmit={() => actions.onFilter}
                    />
                    <ReportActions
                        form={punishmentGeneralState.form}
                        onAction={actions.onFilter}
                        onReset={actions.onReset}
                        showPdf={false}
                        showExcel={false}
                    />
                </div>
            )}
            <BasicTableLayout
                addPermission={"create-punishment"}
                addButtonLabel={{
                    PunishmentGeneral: {
                        label: "Add Punishment",
                        action: actions.onPunishmentGeneral,
                        permission: "create-punishment",
                        color: "primary",
                    },
                    DeleteGroupApplication: {
                        label: "Delete Group Punishment",
                        action: actions.onDeleteGroupApplication,
                        permission: "delete-group-punishment",
                        color: "destructive",
                    },
                }}
                columns={filterProjectFeatureItems(columns(actions), projectEnabled)}
                state={punishmentGeneralState}
            />

            <BasicModel
                title={
                    punishmentGeneralState.form.watch("mode") === "view"
                        ? "Punishment Details"
                        : punishmentGeneralState.form.watch("model_for") ===
                            "delete_group_punishment_general"
                          ? "Delete Group Punishment"
                          : punishmentGeneralState.form.watch("id")
                            ? "Edit Punishment"
                            : "Create Punishment"
                }
                submitLabel={
                    punishmentGeneralState.form.watch("mode") === "view"
                        ? null
                        : punishmentGeneralState?.form?.watch("model_for") ===
                            "delete_group_punishment_general"
                          ? "Delete"
                          : punishmentGeneralState.form.watch("id")
                            ? "Update"
                            : "Create"
                }
                cancelLabel="Close"
                size="5xl"
                form={punishmentGeneralState.form}
                fields={
                    punishmentGeneralState?.form?.watch("model_for") ==
                    "delete_group_punishment_general"
                        ? filterProjectFeatureItems(fields(punishmentGeneralState.form, actions), projectEnabled)
                        : filterProjectFeatureItems(fields(punishmentGeneralState.form, actions), projectEnabled)
                }
                actions={actions}
            />
            <BasicModel
                title={`Skipped Employees (${skippedEmployeesModal.data?.length || 0})`}
                submitLabel="Close"
                cancelLabel={null}
                size="2xl"
                form={skippedForm}
                fields={[]}
                actions={{
                    onCreate: () => {
                        skippedForm.setValue("openModel", false);
                        actions.onCloseSkippedModal();
                    },
                }}
            >
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Employee Code
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Full Name
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Work Email
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Note
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {(skippedEmployeesModal.data || []).map(
                                (employee, index) => (
                                    <tr
                                        key={employee.holiday_id || index}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {employee.employee_code || "-"}
                                        </td>

                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {employee.full_name || "-"}
                                        </td>

                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {employee.work_email || "-"}
                                        </td>

                                        <td className="px-4 py-3 text-sm">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${
                                                    employee.status ===
                                                    "rejected"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-gray-100 text-gray-700"
                                                }`}
                                            >
                                                {employee.status}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {employee.note ||
                                                "Punishment Deduction skipped"}
                                        </td>
                                    </tr>
                                ),
                            )}
                        </tbody>
                    </table>
                </div>
            </BasicModel>
        </PageLayout>
    );
};

export default PunishmentGeneralPage;
