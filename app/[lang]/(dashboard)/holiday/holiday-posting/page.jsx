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
import { useHolidayPosting } from "@/domains/holiday/holiday-posting/hook/useHolidayPosting";

const HolidayPostingPage = () => {
    const { actions, holidayState, skippedEmployeesModal } =
        useHolidayPosting();
    const [filtersOpen, setFiltersOpen] = useState(false);
    console.log(skippedEmployeesModal);

    const skippedForm = useForm({
        defaultValues: {
            openModel: false,
        },
    });

    useEffect(() => {
        skippedForm.setValue("openModel", !!skippedEmployeesModal.open);
    }, [skippedEmployeesModal.open, skippedForm]);

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
                        form={holidayState.form}
                        fields={filterFields(holidayState.form)}
                        onSubmit={() => actions.onFilter}
                    />
                    <ReportActions
                        form={holidayState.form}
                        onAction={actions.onFilter}
                        onReset={actions.onReset}
                        showPdf={false}
                        showExcel={false}
                    />
                </div>
            )}
            <BasicTableLayout
                addPermission={"manual-attendance"}
                addButtonLabel={{
                    HolidayPosting: {
                        label: "Add Holiday",
                        action: actions.onHolidayPosting,
                        permission: "create-holiday",
                        color: 'primary'
                    },
                    DeleteGroupApplication: {
                        label: "Delete Group Holiday",
                        action: actions.onDeleteGroupApplication,
                        permission: "delete-group-holiday",
                        color: 'destructive'
                    },
                }}
                columns={columns(actions)}
                state={holidayState}
                filterCustom={{
                    status: {
                        multiple: true,
                        values: [
                            { key: "approved", value: "Approved" },
                            { key: "rejected", value: "Rejected" },
                        ],
                    },
                }}
            />

            <BasicModel
                title={
                    holidayState.form.watch("mode") === "view"
                        ? "Holiday Details"
                        : holidayState.form.watch("model_for") ===
                            "delete_group_holiday"
                          ? "Delete Group Holiday"
                          : holidayState.form.watch("id")
                            ? "Edit Holiday Posting"
                            : "Create Holiday Posting"
                }
                submitLabel={
                    holidayState.form.watch("mode") === "view"
                        ? null
                        : holidayState?.form?.watch("model_for") ===
                            "delete_group_holiday"
                          ? "Delete"
                          : holidayState.form.watch("id")
                            ? "Update"
                            : "Create"
                }
                cancelLabel="Close"
                size="2xl"
                form={holidayState.form}
                fields={
                    holidayState?.form?.watch("model_for") ==
                    "delete_group_leave"
                        ? fields(holidayState.form, actions)
                        : fields(holidayState.form, actions)
                }
                actions={actions}
            />
            <BasicModel
                title={`Skipped Employees (${skippedEmployeesModal.data?.length || 0})`}
                submitLabel="Close"
                cancelLabel={null}
                size="2xl"
                form={skippedForm}
                fields={[]}
                actions={{
                    onCreate: () => {
                        skippedForm.setValue("openModel", false);
                        actions.onCloseSkippedModal();
                    },
                }}
            >
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Employee Code
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Full Name
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Work Email
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Note
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {(skippedEmployeesModal.data || []).map(
                                (employee, index) => (
                                    <tr
                                        key={employee.holiday_id || index}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {employee.employee_code || "-"}
                                        </td>

                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {employee.full_name || "-"}
                                        </td>

                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {employee.work_email || "-"}
                                        </td>

                                        <td className="px-4 py-3 text-sm">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${
                                                    employee.status ===
                                                    "rejected"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-gray-100 text-gray-700"
                                                }`}
                                            >
                                                {employee.status}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {employee.note || "Holiday skipped"}
                                        </td>
                                    </tr>
                                ),
                            )}
                        </tbody>
                    </table>
                </div>
            </BasicModel>
        </PageLayout>
    );
};

export default HolidayPostingPage;
