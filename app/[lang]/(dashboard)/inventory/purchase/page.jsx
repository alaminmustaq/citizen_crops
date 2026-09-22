"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import BasicModel from "@/components/model/basic-model";
import columns from "./config/columns"; // purchase table columns
import fields from "./config/fields"; // purchase form fields
import { DynamicForm } from "@/components/form/dynamic-form";
import filterFields from "./config/filterFields";
import ReportActions from "@/components/report/ReportActions";
import { usePurchase } from "@/domains/inventory/purchase/hook/usePurchase";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useState } from "react";
import CollapsibleToggleButton from "@/components/ui/CollapsibleToggleButton";

const PurchasePage = () => {
    const { actions, purchaseState } = usePurchase();
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
                        form={purchaseState.form}
                        fields={filterFields(purchaseState.form)}
                        onSubmit={() => actions.onFilter}
                    />
                    <ReportActions
                        form={purchaseState.form}
                        onAction={actions.onFilter}
                        onReset={actions.onReset}
                        showPdf={false}
                        showExcel={false}
                    />
                </div>
            )}
            {/* Table */}
            <BasicTableLayout
                addPermission={"create-purchase"}
                addButtonLabel="Add Purchase"
                columns={columns(actions)}
                state={purchaseState}
            />

            {/* Modal Form */}
            <BasicModel
                title={
                    purchaseState?.form?.watch("id")
                        ? "Edit Purchase"
                        : "Create Purchase"
                }
                submitLabel={
                    purchaseState?.form?.watch("id") ? "Update" : "Create"
                }
                cancelLabel="Cancel"
                size="5xl" // wider modal for purchase details
                form={purchaseState.form}
                fields={fields}
                actions={actions}
            />
        </PageLayout>
    );
};

export default PurchasePage;
