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
import { useWarehouse } from "@/domains/inventory/warehouse/hook/useWarehouse";

const WarehousePage = () => {
    const { actions, warehouseState } = useWarehouse();
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
                        form={warehouseState.form}
                        fields={filterFields(warehouseState.form)}
                        onSubmit={() => actions.onFilter}
                    />
                    <ReportActions
                        form={warehouseState.form}
                        onAction={actions.onFilter}
                        onReset={actions.onReset}
                        showPdf={false}
                        showExcel={false}
                    />
                </div>
            )}
            <BasicTableLayout
                addPermission={"create-warehouse"}
                addButtonLabel="Add Warehouse"
                columns={columns(actions)}
                state={warehouseState}
            />

            <BasicModel
                title={
                    warehouseState?.form?.watch("id")
                        ? "Edit Warehouse"
                        : "Create Warehouse"
                }
                submitLabel={
                    warehouseState?.form?.watch("id") ? "Update" : "Create"
                }
                cancelLabel="Cancel"
                size="2xl"
                form={warehouseState.form}
                fields={fields}
                actions={actions} // pass the full actions object
            />
        </PageLayout>
    );
};

export default WarehousePage;
