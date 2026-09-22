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
import { useAllowanceTypes } from "@/domains/allowance/allowance-types/hook/useAllowanceTypes";

const AllowanceTypesPage = () => {
    const { actions, allowanceState } = useAllowanceTypes();
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
                        form={allowanceState.form}
                        fields={filterFields(allowanceState.form)}
                        onSubmit={() => actions.onFilter}
                    />
                    <ReportActions
                        form={allowanceState.form}
                        onAction={actions.onFilter}
                        onReset={actions.onReset}
                        showPdf={false}
                        showExcel={false}
                    />
                </div>
            )}
            <BasicTableLayout
                addPermission={"create-holiday-type"}
                addButtonLabel="Add Allowance Types"
                columns={columns(actions)}
                state={allowanceState}
            />

            <BasicModel
                title={
                    allowanceState?.form?.watch("id")
                        ? "Edit Allowance Types"
                        : "Create Allowance Types"
                }
                submitLabel={
                    allowanceState?.form?.watch("id") ? "Update" : "Create"
                }
                cancelLabel="Cancel"
                size="sm"
                form={allowanceState.form}
                fields={fields}
                actions={actions} // <-- pass full actions like BranchPage
            />
        </PageLayout>
    );
};

export default AllowanceTypesPage;
