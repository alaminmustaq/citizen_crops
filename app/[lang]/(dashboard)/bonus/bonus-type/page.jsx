"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import BasicModel from "@/components/model/basic-model";
import columns from "./config/columns";
import fields from "./config/fields";
import { DynamicForm } from "@/components/form/dynamic-form";
import filterFields from "./config/filterFields";
import ReportActions from "@/components/report/ReportActions";
import { useState } from "react";
import CollapsibleToggleButton from "@/components/ui/CollapsibleToggleButton";
import { useBonusTypes } from "@/domains/bonus/bonus-types/hook/useBonusTypes";

const BonusTypePage = () => {
    const { actions, bonusState } = useBonusTypes();
    const [filtersOpen, setFiltersOpen] = useState(false);

    return (
        <PageLayout>
            <div className="mb-4 flex justify-between items-center">
                <CollapsibleToggleButton
                    isOpen={filtersOpen}
                    onToggle={() => setFiltersOpen((prev) => !prev)}
                />
            </div>

            {filtersOpen && (
                <div className="bg-white p-6 rounded-md shadow mb-6 transition-all duration-300">
                    <DynamicForm
                        form={bonusState.form}
                        fields={filterFields(bonusState.form)}
                        onSubmit={() => actions.onFilter}
                    />
                    <ReportActions
                        form={bonusState.form}
                        onAction={actions.onFilter}
                        onReset={actions.onReset}
                        showPdf={false}
                        showExcel={false}
                    />
                </div>
            )}
            <BasicTableLayout
                addPermission={"create-holiday-type"}
                addButtonLabel="Add Bonus Type"
                columns={columns(actions)}
                state={bonusState}
            />

            <BasicModel
                title={
                    bonusState?.form?.watch("id")
                        ? "Edit Bonus Type"
                        : "Create Bonus Type"
                }
                submitLabel={
                    bonusState?.form?.watch("id") ? "Update" : "Create"
                }
                cancelLabel="Cancel"
                size="sm"
                form={bonusState.form}
                fields={fields}
                actions={actions}
            />
        </PageLayout>
    );
};

export default BonusTypePage;
