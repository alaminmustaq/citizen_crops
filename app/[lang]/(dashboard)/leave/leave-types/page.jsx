"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import BasicModel from "@/components/model/basic-model";
import columns from "./config/columns";
import fields from "./config/fields";
import { DynamicForm } from "@/components/form/dynamic-form";
import filterFields from "./config/filterFields";
import ReportActions from "@/components/report/ReportActions";
import { useState } from "react";
import CollapsibleToggleButton from "@/components/ui/CollapsibleToggleButton";
import { useLeaveTypes } from "@/domains/leave/leave-types/hook/useLeaveTypes";

const LeaveTypesPage = () => {
    const { actions, leaveState } = useLeaveTypes();
    const [filtersOpen, setFiltersOpen] = useState(false);

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
                        form={leaveState.form}
                        fields={filterFields(leaveState.form)}
                        onSubmit={() => actions.onFilter}
                    />
                    <ReportActions
                        form={leaveState.form}
                        onAction={actions.onFilter}
                        onReset={actions.onReset}
                        showPdf={false}
                        showExcel={false}
                    />
                </div>
            )}
            <BasicTableLayout
                addPermission={"create-leave-type"}
                addButtonLabel="Add Leave Types"
                columns={columns(actions)}
                state={leaveState}
            />

            <BasicModel
                title={
                    leaveState?.form?.watch("id")
                        ? "Edit Leave Types"
                        : "Create Leave Types"
                }
                submitLabel={
                    leaveState?.form?.watch("id") ? "Update" : "Create"
                }
                cancelLabel="Cancel"
                size="2xl"
                form={leaveState.form}
                fields={fields}
                actions={actions} // <-- pass full actions like BranchPage
            />
        </PageLayout>
    );
};

export default LeaveTypesPage;
