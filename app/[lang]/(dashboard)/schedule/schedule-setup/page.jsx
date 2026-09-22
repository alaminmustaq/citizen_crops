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
import { useScheduleSetup } from "@/domains/schedule/schedule-setup/hook/useScheduleSetup";
import { useFetchFeatureSettingsQuery } from "@/domains/settings/services/featureSettingApi";
import {
    enforceProjectFeatureFormState,
    filterProjectFeatureItems,
    isProjectFeatureEnabled,
} from "@/lib/menu-features";

const ScheduleSetupPage = () => {
    const { actions, scheduleState } = useScheduleSetup();
    const [filtersOpen, setFiltersOpen] = useState(false);
    const { data: featureSettings } = useFetchFeatureSettingsQuery();
    const projectEnabled = isProjectFeatureEnabled(featureSettings);
    const projectId = scheduleState.form.watch("project_id");
    const type = scheduleState.form.watch("type");

    useEffect(() => {
        enforceProjectFeatureFormState(scheduleState.form, projectEnabled);
    }, [scheduleState.form, projectEnabled, projectId, type]);

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
                        form={scheduleState.form}
                        fields={filterProjectFeatureItems(filterFields(scheduleState.form), projectEnabled)}
                        onSubmit={() => actions.onFilter}
                    />
                    <ReportActions
                        form={scheduleState.form}
                        onAction={actions.onFilter}
                        onReset={actions.onReset}
                        showPdf={false}
                        showExcel={false}
                    />
                </div>
            )}
            <BasicTableLayout
                addPermission={"create-schedule"}
                addButtonLabel={{
                    ScheduleSetup: {
                        label: "Add Schedule",
                        action: actions.onScheduleSetup,
                        permission: "create-schedule",
                    },
                    DeleteGroupApplication: {
                        label: "Delete Group Schedule",
                        action: actions.onDeleteGroupApplication,
                        permission: "delete-group-schedule",
                    },
                }}
                columns={filterProjectFeatureItems(columns(actions), projectEnabled)}
                state={scheduleState}
                // filterCustom={{
                //     status: {
                //         multiple: true,
                //         values: [
                //             { key: "approved", value: "Approved" },
                //             { key: "rejected", value: "Rejected" },
                //         ],
                //     }
                // }}
            />

            <BasicModel
                title={
                    scheduleState.form.watch("mode") === "view"
                        ? "Schedule Details"
                        : scheduleState.form.watch("id")
                          ? "Edit Schedule Setup"
                          : "Create Schedule Setup"
                }
                submitLabel={
                    scheduleState.form.watch("mode") === "view"
                        ? null
                        : scheduleState.form.watch("id")
                          ? "Update"
                          : "Create"
                }
                cancelLabel="Close"
                size="2xl"
                form={scheduleState.form}
                fields={filterProjectFeatureItems(fields(actions, scheduleState.form), projectEnabled)}
                actions={actions}
            />
        </PageLayout>
    );
};

export default ScheduleSetupPage;
