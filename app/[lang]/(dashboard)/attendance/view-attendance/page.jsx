"use client";
import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import columns from "./config/columns";
import fields from "./config/fields";
import BasicModel from "@/components/model/basic-model";
import useAttendance from "@/domains/attendance/hooks/useAttendance";
import useAuth from "@/domains/auth/hooks/useAuth";

const attendanceViewPage = () => {
    const { actions, attendanceState } = useAttendance(); // Custom hook to manage user actions
    const { user } = useAuth();

    return (
        <>
            <PageLayout>
                <BasicTableLayout
                    columns={columns(actions, user)}
                    state={attendanceState}
                />
                <BasicModel
                    title="Edit Attendance"
                    submitLabel="Update"
                    cancelLabel="Cancel"
                    size="2xl"
                    form={attendanceState?.form}
                    fields={fields(actions, attendanceState?.form)}
                    actions={actions}
                />
            </PageLayout>
        </>
    );
};

export default attendanceViewPage;
