"use client";
import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import columns from "./config/columns";
import fields from "./config/fields";
import employfields from "./config/employfields";
import BasicModel from "@/components/model/basic-model";
import { DynamicForm } from "@/components/form/dynamic-form";
import filterFields from "./config/filterFields";
import ReportActions from "@/components/report/ReportActions";
import { useEffect, useState } from "react";
import CollapsibleToggleButton from "@/components/ui/CollapsibleToggleButton";
import { useProject } from "@/domains/project/hook/useProject";

const ProjectPage = () => {
    const { actions, projectState } = useProject(); // Custom hook to manage user actions
    const [filtersOpen, setFiltersOpen] = useState(false);
    const form = projectState.form;

    // Precompute conditional values
    const isEdit = !!form?.watch("id");
    const isAssignEmploy = !!form?.watch("assignEmployMode");

    const title = isEdit ? "Project edit" : "Project create";
    const submitLabel = isAssignEmploy
        ? "Assign employ"
        : isEdit
          ? "Update"
          : "Create";
    const formFields = isAssignEmploy ? employfields(form) : fields;

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
                        form={projectState.form}
                        fields={filterFields(projectState.form)}
                        onSubmit={() => actions.onFilter}
                    />
                    <ReportActions
                        form={projectState.form}
                        onAction={actions.onFilter}
                        onReset={actions.onReset}
                        showPdf={false}
                        showExcel={false}
                    />
                </div>
            )}
            <BasicTableLayout
                addPermission={"create-project"}
                addButtonLabel="Add Project"
                columns={columns(actions)}
                state={projectState}
            />
            <BasicModel
                title={title}
                submitLabel={submitLabel}
                cancelLabel="Cancel"
                size={isAssignEmploy ? "4xl" : "2xl"}
                form={form}
                fields={formFields}
                actions={actions}
            />
        </PageLayout>
    );
};

export default ProjectPage;
