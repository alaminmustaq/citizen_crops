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
import { useJobPosition } from "@/domains/job-position/hook/useJobPosition";

const departmentPage = () => {
    const { actions, jobPositionState } = useJobPosition(); // Custom hook to manage user actions
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
                                            form={jobPositionState.form}
                                            fields={filterFields(jobPositionState.form)}
                                            onSubmit={() => actions.onFilter}
                                        />
                                        <ReportActions
                                            form={jobPositionState.form}
                                            onAction={actions.onFilter}
                                            onReset={actions.onReset}
                                            showPdf={false}
                                            showExcel={false}
                                        />
                                    </div>
                                )}
                <BasicTableLayout
                    addPermission={"create-job-position"}
                    addButtonLabel="Add Job Position"
                    columns={columns(actions)}
                    state={jobPositionState}
                />
                <BasicModel
                    title={
                        jobPositionState?.form?.watch("id")
                            ? "Job Position edit"
                            : "Job Position create"
                    }
                    submitLabel={
                        jobPositionState?.form?.watch("id")
                            ? "Update"
                            : "Create"
                    }
                    cancelLabel="Cancel"
                    size="5xl"
                    form={jobPositionState.form}
                    fields={fields}
                    actions={actions}
                />
            </PageLayout>
        </>
    );
};

export default departmentPage;
