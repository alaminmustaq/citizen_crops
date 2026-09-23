"use client";
import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import columns from "./config/columns";
import fields from "./config/fields";
import BasicModel from "@/components/model/basic-model";
import { useDocument } from "@/domains/document/hook/useDocument";

const DocumentsPage = () => {
    const { actions, documentsState } = useDocument();
    return (
        <>
            <PageLayout>
                <BasicTableLayout
                    addPermission={"create-document"}
                    addButtonLabel="Add Document"
                    columns={columns(actions)}
                    state={documentsState}
                    search={false}
                />
                <BasicModel
                    title={
                        documentsState?.form?.watch("id")
                            ? "Edit Document"
                            : "Create Document"
                    }
                    submitLabel={
                        documentsState?.form?.watch("id") ? "Update" : "Create"
                    }
                    cancelLabel="Cancel"
                    size="4xl"
                    form={documentsState.form}
                    fields={fields(documentsState.form)}
                    actions={actions}
                />
            </PageLayout>
        </>
    );
};

export default DocumentsPage;
