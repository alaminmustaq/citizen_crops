"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import BasicModel from "@/components/model/basic-model";
import columns from "./config/columns";
import fields from "./config/fields";
import { DynamicForm } from "@/components/form/dynamic-form";
import filterFields from "./config/filterFields";
import ReportActions from "@/components/report/ReportActions";
import { useEffect, useState } from "react";
import CollapsibleToggleButton from "@/components/ui/CollapsibleToggleButton";
import { useToolDistribution } from "@/domains/inventory/tool-distribution/hook/useToolDistribution";
import ReturnFields from "./config/ReturnFields";

const ToolDistributionPage = () => {
    const { actions, toolDistributionState } = useToolDistribution();
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
                        form={toolDistributionState.form}
                        fields={filterFields(toolDistributionState.form)}
                        onSubmit={() => actions.onFilter}
                    />
                    <ReportActions
                        form={toolDistributionState.form}
                        onAction={actions.onFilter}
                        onReset={actions.onReset}
                        showPdf={false}
                        showExcel={false}
                    />
                </div>
            )}
            <BasicTableLayout
                addPermission={"create-tool-distribution"}
                addButtonLabel="Add Tool Distribution"
                columns={columns(actions)}
                state={toolDistributionState}
            />

            <BasicModel
                title={
                    toolDistributionState?.form?.watch("id")
                        ? toolDistributionState?.form?.watch("type") == "return"
                            ? "Update Return"
                            : "Edit Tool Distribution"
                        : "Create Tool Distribution"
                }
                submitLabel={
                    toolDistributionState?.form?.watch("id")
                        ? toolDistributionState?.form?.watch("type") == "return"
                            ? "Update Return"
                            : "Update"
                        : "Create"
                }
                cancelLabel="Cancel"
                size="5xl"
                form={toolDistributionState.form}
                fields={
                    toolDistributionState?.form?.watch("type") == "return"
                        ? ReturnFields
                        : fields(toolDistributionState.form)
                }
                actions={actions}
            />
        </PageLayout>
    );
};

export default ToolDistributionPage;
