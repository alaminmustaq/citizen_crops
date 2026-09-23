"use client";
import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import columns from "./config/columns";
import fields from "./config/fields";
import BasicModel from "@/components/model/basic-model";
import { useJobPosition } from "@/domains/job-position/hook/useJobPosition";

const departmentPage = () => {
    const { actions, jobPositionState } = useJobPosition(); // Custom hook to manage user actions

    return (
        <>
            <PageLayout>
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
