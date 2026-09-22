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
import { useBonusSetup } from "@/domains/bonus/bonus-setup/hook/useBonusSetup";

const BonusSetupPage = () => {
    const { actions, bonusSetupState } = useBonusSetup();
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
                        form={bonusSetupState.form}
                        fields={filterFields(bonusSetupState.form)}
                        onSubmit={() => actions.onFilter}
                    />
                    <ReportActions
                        form={bonusSetupState.form}
                        onAction={actions.onFilter}
                        onReset={actions.onReset}
                        showPdf={false}
                        showExcel={false}
                    />
                </div>
            )}
            <BasicTableLayout
                addPermission={"create-holiday-type"}
                addButtonLabel="Add Bonus Setup"
                columns={columns(actions)}
                state={bonusSetupState}
            />

            <BasicModel
                title={
                    bonusSetupState?.form?.watch("id")
                        ? "Edit Bonus Setup"
                        : "Create Bonus Setup"
                }
                submitLabel={
                    bonusSetupState?.form?.watch("id") ? "Update" : "Create"
                }
                cancelLabel="Cancel"
                size="4xl"
                form={bonusSetupState.form}
                fields={fields(bonusSetupState.form)}
                actions={actions}
            />
        </PageLayout>
    );
};

export default BonusSetupPage;
