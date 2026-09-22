"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import BasicModel from "@/components/model/basic-model";
import columns from "./config/columns";
import fields from "./config/fields";
import { DynamicForm } from "@/components/form/dynamic-form";
import filterFields from "./config/filterFields";
import ReportActions from "@/components/report/ReportActions";
import { useLeaveApplication } from "@/domains/leave/leave-application/hook/useLeaveApplication";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useState } from "react";
import CollapsibleToggleButton from "@/components/ui/CollapsibleToggleButton";

const LeaveApplicationPage = () => {
    const { actions, leaveState, skippedEmployeesModal } =
        useLeaveApplication();
    const [filtersOpen, setFiltersOpen] = useState(false);

    console.log("Leave skipped data:", skippedEmployeesModal.data);

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
                        form={leaveState.form}
                        fields={filterFields(leaveState.form)}
                        onSubmit={() => actions.onFilter}
                    />
                    <ReportActions
                        form={leaveState.form}
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
                    LeaveApplication: {
                        label: "Add Leave Application",
                        action: actions.onLeaveApplication,
                        permission: "create-leave",
                        color: 'primary'
                    }, 
                    ApprovedSingleApplication: {
                        label: "Approve/Reject Single Application",
                        action: actions.onApproveSingleApplication,
                        permission: "approve-single-leave",
                        color: 'success'
                    },
                    DeleteGroupApplication: {
                        label: "Delete Group Application",
                        action: actions.onDeleteGroupApplication,
                        permission: "delete-group-leave",
                        color: 'destructive'
                    },
                }}
                columns={columns(actions)}
                state={leaveState}
                filterCustom={{
                    leave_status: {
                        multiple: true,
                        values: [
                            { key: "pending", value: "Pending" },
                            { key: "approved", value: "Approved" },
                            { key: "rejected", value: "Rejected" },
                        ],
                    },
                }}
            />

            <BasicModel
                title={
                    leaveState.form.watch("mode") === "view"
                        ? "Leave Application Details"
                        : leaveState.form.watch("model_for") ===
                            "delete_group_leave"
                          ? "Delete Group Leave"
                          : leaveState.form.watch("model_for") ===
                              "approve_single_leave"
                            ? "Approve Leave"
                            : leaveState.form.watch("id")
                              ? "Edit Leave Application"
                              : "Create Leave Application"
                }
                submitLabel={
                    leaveState.form.watch("mode") === "view"
                        ? null
                        : leaveState?.form?.watch("model_for") ===
                            "delete_group_leave"
                            ? "Delete"
                          : leaveState?.form?.watch("model_for") ===
                              "approve_single_leave"
                            ? "Submit"
                            : leaveState.form.watch("id")
                              ? "Update"
                              : "Create"
                }
                cancelLabel="Close"
                size="2xl"
                form={leaveState.form}
                fields={
                    leaveState?.form?.watch("model_for") == "delete_group_leave"
                        ? fields(leaveState.form, actions)
                        : fields(leaveState.form, actions)
                }
                actions={actions}
            />

            {/* Skipped Employees using existing BasicModel */}
            <BasicModel
                title={`Skipped Employees (${skippedEmployeesModal.data?.length || 0})`}
                submitLabel="Close"
                cancelLabel={null}
                size="2xl"
                form={skippedForm}
                fields={[]} // no dynamic form fields, render children only
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
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Leave Days
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Remarks
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {(skippedEmployeesModal.data || []).map(
                                (employee, index) => (
                                    <tr
                                        key={employee.leave_id || index}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                            {employee.employee_code || "-"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {employee.full_name || "-"}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                            {employee.leave_day}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {employee.remarks ||
                                                "Leave balance exceeded"}
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

export default LeaveApplicationPage;
