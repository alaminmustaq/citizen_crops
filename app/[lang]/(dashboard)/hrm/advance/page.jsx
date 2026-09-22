"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import BasicModel from "@/components/model/basic-model";
import { useAdvance } from "@/domains/Advance/hooks/useAdvance";
import fields from "./config/fields";
import advanceColumns from "./config/columns";
import filterFields from "./config/filterFields";
import { DynamicForm } from "@/components/form/dynamic-form";
import ReportActions from "@/components/report/ReportActions";
import CollapsibleToggleButton from "@/components/ui/CollapsibleToggleButton";
import { useEffect, useState } from "react";
import { useFetchFeatureSettingsQuery } from "@/domains/settings/services/featureSettingApi";
import {
    enforceProjectFeatureFormState,
    filterProjectFeatureItems,
    isProjectFeatureEnabled,
} from "@/lib/menu-features";

const AdvancePage = () => {
    const { actions, advanceState } = useAdvance();
    const [filtersOpen, setFiltersOpen] = useState(false);
    const { data: featureSettings } = useFetchFeatureSettingsQuery();
    const projectEnabled = isProjectFeatureEnabled(featureSettings);
    const projectId = advanceState.form.watch("project_id");
    const scopeType = advanceState.form.watch("scope_type");

    const mode = advanceState.form.watch("mode");
    const modelFor = advanceState.form.watch("model_for");

    useEffect(() => {
        enforceProjectFeatureFormState(advanceState.form, projectEnabled);
    }, [advanceState.form, projectEnabled, projectId, scopeType]);

    const getTitle = () => {
        if (mode === "view") return "View Advance";
        if (mode === "edit") return "Edit Advance";
        if (modelFor === "delete_group_advance") return "Bulk Delete Advance";
        return "Create Advance";
    };

    const getButtonLabel = () => {
        if (mode === "view") return null;
        if (mode === "edit") return "Update";
        if (modelFor === "delete_group_advance") return "Delete Selected";
        return "Create";
    };

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
                        form={advanceState.form}
                        fields={filterProjectFeatureItems(filterFields(advanceState.form, actions), projectEnabled)}
                        onSubmit={actions.onFilter}
                    />
                    <ReportActions
                        form={advanceState.form}
                        onAction={actions.onFilter}
                        onReset={actions.onReset}
                        showPdf={false}
                        showExcel={false}
                    />
                </div>
            )}

            <BasicTableLayout
                addPermission={"create-advance"}
                addButtonLabel={{
                    Advance: {
                        label: "Add Advance",
                        action: actions.onOpenModal,
                        permission: "create-advance",
                        color: "primary",
                    },
                    DeleteGroup: {
                        label: "Bulk Delete",
                        action: actions.onOpenDeleteGroupModal,
                        permission: "delete-group-advance",
                        color: "destructive",
                    },
                }}
                columns={filterProjectFeatureItems(advanceColumns(actions), projectEnabled)}
                state={advanceState}
                search={true}
            />

            <BasicModel
                title={getTitle()}
                submitLabel={getButtonLabel()}
                cancelLabel="Close"
                size="5xl"
                form={advanceState.form}
                fields={filterProjectFeatureItems(fields(advanceState.form, actions), projectEnabled)}
                actions={actions}
            />
        </PageLayout>
    );
};

export default AdvancePage;
