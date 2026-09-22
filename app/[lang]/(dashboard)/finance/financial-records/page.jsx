"use client";
import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import { DynamicForm } from "@/components/form/dynamic-form";
import filterFields from "./config/filterFields";
import columns from "./config/columns";
import fields from "./config/fields";
import ReportActions from "@/components/report/ReportActions";
import futurePaymentFields from "./config/futurePaymentField";
import BasicModel from "@/components/model/basic-model";
import { useFinancialRecords } from "@/domains/finance/hook/useFinancialRecords";
import { useState } from "react";
import CollapsibleToggleButton from "@/components/ui/CollapsibleToggleButton";

const FinancialRecordsPage = () => {
    const { actions, financialState } = useFinancialRecords();
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
                        form={financialState.form}
                        fields={filterFields(financialState.form)}
                        onSubmit={() => actions.onFilter}
                    />
                    <ReportActions
                        form={financialState.form}
                        onAction={actions.onFilter}
                        onReset={actions.onReset}
                        showPdf={false}
                        showExcel={false}
                    />
                </div>
            )}
            <BasicTableLayout
                addPermission={"create-financial-records"}
                addButtonLabel="Add Financial Record"
                columns={columns(actions)}
                state={financialState}
                filterCustom={{
                    transaction_type: {
                        multiple: true,
                        values: [
                            { key: "regular", value: "Regular" },
                            { key: "future_payment", value: "Future Payment" },
                            { key: "repeat", value: "Repeat" },
                        ],
                    },
                }}
            />

            <BasicModel
                title={
                    financialState?.form?.watch("id")
                        ? "Edit Record"
                        : "Create Record"
                }
                submitLabel={
                    financialState?.form?.watch("id") ? "Update" : "Create"
                }
                cancelLabel="Cancel"
                size="5xl"
                form={financialState.form}
                fields={
                    financialState?.form?.watch("processStatus") ==
                    "marked_as_paid"
                        ? futurePaymentFields
                        : fields(financialState.form)
                }
                actions={actions}
            />
        </PageLayout>
    );
};

export default FinancialRecordsPage;
