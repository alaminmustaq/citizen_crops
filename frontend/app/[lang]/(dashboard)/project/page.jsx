"use client";
import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import columns from "./config/columns";
import fields from "./config/fields";
import employfields from "./config/employfields";
import BasicModel from "@/components/model/basic-model";
import { useProject } from "@/domains/project/hook/useProject";

const ProjectPage = () => {
    const { actions, projectState } = useProject(); // Custom hook to manage user actions
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
