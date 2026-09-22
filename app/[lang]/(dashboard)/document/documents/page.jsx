"use client";
import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import columns from "./config/columns";
import fields from "./config/fields";
import BasicModel from "@/components/model/basic-model";
import { DynamicForm } from "@/components/form/dynamic-form";
import filterFields from "./config/filterFields";
import ReportActions from "@/components/report/ReportActions";
import { useEffect, useState } from "react";
import CollapsibleToggleButton from "@/components/ui/CollapsibleToggleButton";
import { useDocument } from "@/domains/document/hook/useDocument";

const DocumentsPage = () => {
    const { actions, documentsState } = useDocument();
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
                            form={documentsState.form}
                            fields={filterFields(documentsState.form)}
                            onSubmit={() => actions.onFilter}
                        />
                        <ReportActions
                            form={documentsState.form}
                            onAction={actions.onFilter}
                            onReset={actions.onReset}
                            showPdf={false}
                            showExcel={false}
                        />
                    </div>
                )}
                <BasicTableLayout
                    addPermission={"create-document"}
                    addButtonLabel="Add Document"
                    columns={columns(actions)}
                    state={documentsState}
                    // search={false}
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
