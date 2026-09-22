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
import { useStockTransfer } from "@/domains/inventory/stock-transfer/hook/useStockTransfer";

const StockTransferPage = () => {
    const { actions, stockTransferState } = useStockTransfer();
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
                        form={stockTransferState.form}
                        fields={filterFields(stockTransferState.form)}
                        onSubmit={() => actions.onFilter}
                    />
                    <ReportActions
                        form={stockTransferState.form}
                        onAction={actions.onFilter}
                        onReset={actions.onReset}
                        showPdf={false}
                        showExcel={false}
                    />
                </div>
            )}
            {/* ===== Table Section ===== */}
            <BasicTableLayout
                addPermission={"create-stock-transfer"}
                addButtonLabel="Add Stock Transfer"
                columns={columns(actions)}
                state={stockTransferState}
            />

            {/* ===== Modal Form Section ===== */}
            <BasicModel
                title={
                    stockTransferState?.form?.watch("id")
                        ? "Edit Stock Transfer"
                        : "Create Stock Transfer"
                }
                submitLabel={
                    stockTransferState?.form?.watch("id") ? "Update" : "Create"
                }
                cancelLabel="Cancel"
                size="5xl" // for larger form with details
                form={stockTransferState.form}
                fields={fields}
                actions={actions}
            />
        </PageLayout>
    );
};

export default StockTransferPage;
