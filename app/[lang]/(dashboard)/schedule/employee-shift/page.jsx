"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import BasicModel from "@/components/model/basic-model";
import columns from "./config/columns";
import fields from "./config/fields";
import { useForm } from "react-hook-form";
import { DynamicForm } from "@/components/form/dynamic-form";
import filterFields from "./config/filterFields";
import ReportActions from "@/components/report/ReportActions";
import { useEffect, useState } from "react";
import CollapsibleToggleButton from "@/components/ui/CollapsibleToggleButton";
import { useEmployeeShift } from "@/domains/schedule/employee-shift/hook/useEmployeeShift";

const EmployeeShiftPage = () => {
    const { actions, employeeShiftState } = useEmployeeShift();
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
                        form={employeeShiftState.form}
                        fields={filterFields(employeeShiftState.form)}
                        onSubmit={() => actions.onFilter}
                    />
                    <ReportActions
                        form={employeeShiftState.form}
                        onAction={actions.onFilter}
                        onReset={actions.onReset}
                        showPdf={false}
                        showExcel={false}
                    />
                </div>
            )}
            <BasicTableLayout
                addPermission="create-holiday-type"
                addButtonLabel="Add Employee Shift"
                columns={columns(actions)}
                state={employeeShiftState}
            />

            <BasicModel
                title={
                    employeeShiftState?.form?.watch("id")
                        ? "Edit Employee Shift"
                        : "Create Employee Shift"
                }
                submitLabel={
                    employeeShiftState?.form?.watch("id") ? "Update" : "Create"
                }
                cancelLabel="Cancel"
                size="2xl"
                form={employeeShiftState.form}
                fields={fields}
                actions={actions}
            />
        </PageLayout>
    );
};

export default EmployeeShiftPage;
