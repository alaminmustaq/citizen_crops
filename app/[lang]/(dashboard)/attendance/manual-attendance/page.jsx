"use client";
import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import columns from "./config/columns";   
import fields from "./config/fields";     
import AdjustFields from "./config/adjustFields";     
import BasicModel from "@/components/model/basic-model";
import { useManualAttendance } from "@/domains/manual-attendance/hook/useManualAttendance"; // custom hook
import { useEffect } from "react";
import { useFetchFeatureSettingsQuery } from "@/domains/settings/services/featureSettingApi";
import {
    enforceProjectFeatureFormState,
    filterProjectFeatureItems,
    isProjectFeatureEnabled,
} from "@/lib/menu-features";

const ManualAttendancePage = () => {
    const { actions, manualAttendanceState } = useManualAttendance(); 
    const { data: featureSettings } = useFetchFeatureSettingsQuery();
    const projectEnabled = isProjectFeatureEnabled(featureSettings);
    const projectId = manualAttendanceState.form.watch("project_id");
    const attendanceType = manualAttendanceState.form.watch("attendance_type");

    useEffect(() => {
        enforceProjectFeatureFormState(manualAttendanceState.form, projectEnabled);
    }, [manualAttendanceState.form, projectEnabled, projectId, attendanceType]);
    const addButtonLabel = {
        GenerateSalary: {
            label: "Add Attendance",
            action: actions.onAddAttendance,
            permission: "manual-attendance",
            color: 'primary'
        },
        BulkApprove: {
            label: "Bulk Approve",
            action: actions.onBulkApprove,
            permission: "approve-manual-attendance",
            color: 'success'
        },
        // ApprovedSalary: {
        //     label: "Adjust Hours",
        //     action: actions.onAdjustHours,
        //     permission: "adjust-hour",
        //     color: 'info'
        // },
    };

    return (
        <>
            <PageLayout>
                <BasicTableLayout
                    addButtonLabel={addButtonLabel} 
                    columns={filterProjectFeatureItems(columns(actions), projectEnabled)}
                    state={manualAttendanceState}
                />
                <BasicModel
                    title={
                        manualAttendanceState?.form?.watch("model_for") ===
                        "bulk_approve_manual_attendance"
                            ? "Bulk Approve Attendance"
                            : manualAttendanceState?.form?.watch("model_for") === "adjust_hours"
                            ? "Adjust Hours"
                            : manualAttendanceState?.form?.watch("id")
                                ? "Edit Attendance"
                                : "Add Attendance"
                    }
                    submitLabel={
                        manualAttendanceState?.form?.watch("model_for") ===
                        "bulk_approve_manual_attendance"
                            ? "Approve Selected"
                            : manualAttendanceState?.form?.watch("model_for") === "adjust_hours"
                            ? "Save Hours"
                            : manualAttendanceState?.form?.watch("id")
                                ? "Update"
                                : "Create"
                    }
                    cancelLabel="Cancel"
                    size="4xl"
                    form={manualAttendanceState.form}
                    fields={
                        manualAttendanceState?.form?.watch("model_for") == "adjust_hours"
                            ? filterProjectFeatureItems(fields(actions, manualAttendanceState.form), projectEnabled)
                            : filterProjectFeatureItems(fields(actions, manualAttendanceState.form), projectEnabled)
                    }
                    actions={actions}
                />
            </PageLayout>
        </>
    );
};

export default ManualAttendancePage;
