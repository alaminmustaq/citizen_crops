"use client";
import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import columns from "./config/columns";
import fields from "./config/fields";
import BasicModel from "@/components/model/basic-model";
import { DynamicForm } from "@/components/form/dynamic-form";
import filterFields from "./config/filterFields";
import ReportActions from "@/components/report/ReportActions";
import { useState } from "react";
import CollapsibleToggleButton from "@/components/ui/CollapsibleToggleButton";
import { useBranch } from "@/domains/branch/hook/useBranch";

const BranchPage = () => {
    const { actions, branchesState } = useBranch(); // Custom hook to manage user actions
    const [filtersOpen, setFiltersOpen] = useState(false);

    return (
        <>
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
                            form={branchesState.form}
                            fields={filterFields(branchesState.form)}
                            onSubmit={() => actions.onFilter}
                        />
                        <ReportActions
                            form={branchesState.form}
                            onAction={actions.onFilter}
                            onReset={actions.onReset}
                            showPdf={false}
                            showExcel={false}
                        />
                    </div>
                )}
                <BasicTableLayout
                    addPermission={"create-branch"}
                    addButtonLabel={"Add Branch"}
                    columns={columns(actions)}
                    state={branchesState}
                />
                <BasicModel
                    title={
                        branchesState?.form?.watch("id")
                            ? "Branch edit"
                            : "Branch create"
                    }
                    submitLabel={
                        branchesState?.form?.watch("id") ? "Update" : "Create"
                    }
                    cancelLabel="Cancel"
                    size="2xl"
                    form={branchesState.form}
                    fields={fields}
                    actions={actions}
                    isLoading={branchesState.isMutating}
                />
            </PageLayout>
        </>
    );
};

export default BranchPage;
