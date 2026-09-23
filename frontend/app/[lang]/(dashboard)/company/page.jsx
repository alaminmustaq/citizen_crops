"use client";
import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import columns from "./config/columns";
import fields from "./config/fields";
import BasicModel from "@/components/model/basic-model";
import { useCompany } from "@/domains/company/hook/useCompany";

const CompanyPage = () => {
    const { actions, companiesState } = useCompany(); // Custom hook to manage user actions

    return (
        <>
            <PageLayout>
                <BasicTableLayout
                    addPermission={"create-company"}
                    addButtonLabel="Add Company"
                    columns={columns(actions)}
                    state={companiesState}
                />
                <BasicModel
                    title={
                        companiesState?.form?.watch("id")
                            ? "Company edit"
                            : "Company create"
                    }
                    submitLabel={
                        companiesState?.form?.watch("id") ? "Update" : "Create"
                    }
                    cancelLabel="Cancel"
                    size="2xl"
                    form={companiesState.form}
                    fields={fields}
                    actions={actions}
                />
            </PageLayout>
        </>
    );
};

export default CompanyPage;
