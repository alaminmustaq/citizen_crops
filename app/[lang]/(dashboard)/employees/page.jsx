"use client";
import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import { DynamicForm } from "@/components/form/dynamic-form";
import filterFields from "./config/filterFields";
import columns from "./config/columns";
import ReportActions from "@/components/report/ReportActions";
import { useState } from "react"; 
import { useEmploy } from "@/domains/employ/hook/useEmploy";

import CollapsibleToggleButton from "@/components/ui/CollapsibleToggleButton";

const EmployeePage = () => {
    const { actions, employState } = useEmploy();
    const [filtersOpen, setFiltersOpen] = useState(false);

    return (
        <PageLayout>
            {/* Filter Header */}
            <div className="mb-4 flex justify-between items-center"> 
                <CollapsibleToggleButton
                    isOpen={filtersOpen}
                    onToggle={() => setFiltersOpen(prev => !prev)}
                />
            </div>

            {/* Collapsible Filter Panel */}
            {filtersOpen && (
                <div className="bg-white p-6 rounded-md shadow mb-6 transition-all duration-300">
                    <DynamicForm
                        form={employState.form}
                        fields={filterFields(employState.form)}
                        onSubmit={() => actions.onFilter}
                    />
                    <ReportActions
                        form={employState.form}
                        onAction={actions.onFilter}
                        onReset={actions.onReset}
                        showPdf={false}
                        showExcel={false}
                    />
                </div>
            )}

            <BasicTableLayout
                addPermission={"create-employee"}
                addButtonLabel="Add Employee"
                columns={columns(actions)}
                to="employees/create"
                state={employState}
                searchKey="employee"
                includeInactive={true}
            />

        </PageLayout>
    );
};


export default EmployeePage;
