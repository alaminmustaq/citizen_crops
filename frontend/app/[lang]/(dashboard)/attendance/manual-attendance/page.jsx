"use client";
import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import columns from "./config/columns";   
import fields from "./config/fields";     
import BasicModel from "@/components/model/basic-model";
import { useManualAttendance } from "@/domains/manual-attendance/hook/useManualAttendance"; // custom hook

const ManualAttendancePage = () => {
    const { actions, manualAttendanceState } = useManualAttendance(); 

    return (
        <>
            <PageLayout>
                <BasicTableLayout
                    addPermission={"manual-attendance"}
                    addButtonLabel="Add Attendance"
                    columns={columns(actions)}
                    state={manualAttendanceState}
                />
                <BasicModel
                    title={
                        manualAttendanceState?.form?.watch("id")
                            ? "Edit Attendance"
                            : "Add Attendance"
                    }
                    submitLabel={
                        manualAttendanceState?.form?.watch("id")
                            ? "Update"
                            : "Create"
                    }
                    cancelLabel="Cancel"
                    size="4xl"
                    form={manualAttendanceState.form}
                    fields={fields(actions,manualAttendanceState.form)}
                    actions={actions}
                />
            </PageLayout>
        </>
    );
};

export default ManualAttendancePage;
