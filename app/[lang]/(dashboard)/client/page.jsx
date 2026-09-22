"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import clientColumns from "./config/columns"; // your simplified client columns
import clientFields from "./config/fields"; // simplified client fields
import BasicModel from "@/components/model/basic-model";
import { DynamicForm } from "@/components/form/dynamic-form";
import filterFields from "./config/filterFields";
import ReportActions from "@/components/report/ReportActions";
import { useEffect, useState } from "react";
import CollapsibleToggleButton from "@/components/ui/CollapsibleToggleButton";
import { useClient } from "@/domains/client/hook/useClient";

const ClientPage = () => {
    const { actions, clientState } = useClient(); // Custom hook for client actions
    const [filtersOpen, setFiltersOpen] = useState(false);

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
                        form={clientState.form}
                        fields={filterFields(clientState.form)}
                        onSubmit={() => actions.onFilter}
                    />
                    <ReportActions
                        form={clientState.form}
                        onAction={actions.onFilter}
                        onReset={actions.onReset}
                        showPdf={false}
                        showExcel={false}
                    />
                </div>
            )}
            <BasicTableLayout
                addPermission={"create-client"}
                addButtonLabel="Add Client"
                columns={clientColumns(actions)}
                state={clientState}
            />
            <BasicModel
                title={
                    clientState.form.watch("id")
                        ? "Edit Client"
                        : "Create Client"
                }
                submitLabel={clientState.form.watch("id") ? "Update" : "Create"}
                cancelLabel="Cancel"
                size="2xl"
                form={clientState.form}
                fields={clientFields}
                actions={actions}
            />
        </PageLayout>
    );
};

export default ClientPage;
