"use client";
import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import columns from "./config/columns";
import fields from "./config/fields";
import BasicModel from "@/components/model/basic-model";
import { useBranch } from "@/domains/branch/hook/useBranch";

const BranchPage = () => {
    const { actions, branchesState } = useBranch(); // Custom hook to manage user actions

    return (
        <>
            <PageLayout>
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
                />
            </PageLayout>
        </>
    );
};

export default BranchPage;
