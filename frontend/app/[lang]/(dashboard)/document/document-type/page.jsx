"use client";
import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import columns from "./config/columns";
import fields from "./config/fields";
import BasicModel from "@/components/model/basic-model";
import { useDocumentType } from "@/domains/document/hook/useDocumentType";

const DocumentTypePage = () => {
    const { actions, documentTypesState } = useDocumentType();
    return (
        <>
            <PageLayout>
                <BasicTableLayout
                    addPermission={"create-document"}
                    addButtonLabel="Add Document Type"
                    columns={columns(actions)}
                    state={documentTypesState}
                />
                <BasicModel
                    title={
                        documentTypesState?.form?.watch("id")
                            ? "Edit Document Type"
                            : "Create Document Type"
                    }
                    submitLabel={
                        documentTypesState?.form?.watch("id") ? "Update" : "Create"
                    }
                    cancelLabel="Cancel"
                    size="2xl"
                    form={documentTypesState.form}
                    fields={fields}
                    actions={actions}
                />
            </PageLayout>
        </>
    );
};

export default DocumentTypePage;
