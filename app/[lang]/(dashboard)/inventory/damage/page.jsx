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
import { useDamage } from "@/domains/inventory/damage/hook/useDamage";

const DamagePage = () => {
    const { actions, damageState } = useDamage();
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
                        form={damageState.form}
                        fields={filterFields(damageState.form)}
                        onSubmit={() => actions.onFilter}
                    />
                    <ReportActions
                        form={damageState.form}
                        onAction={actions.onFilter}
                        onReset={actions.onReset}
                        showPdf={false}
                        showExcel={false}
                    />
                </div>
            )}
            <BasicTableLayout
                addPermission={"create-tool-damage"}
                addButtonLabel="Add Tool Damage"
                columns={columns(actions)}
                state={damageState}
            />

            <BasicModel
                title={
                    damageState?.form?.watch("id")
                        ? "Edit Tool Damage"
                        : "Create Tool Damage"
                }
                submitLabel={
                    damageState?.form?.watch("id") ? "Update" : "Create"
                }
                cancelLabel="Cancel"
                size="5xl"
                form={damageState.form}
                fields={fields(damageState.form)}
                actions={actions}
            />
        </PageLayout>
    );
};

export default DamagePage;
