"use client";
import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import columns from "./config/columns";
import BasicModel from "@/components/model/basic-model";
import  useAttendance  from "@/domains/attendance/hooks/useAttendance";


const attendanceViewPage = () => {
    const { actions, attendanceState } = useAttendance(); // Custom hook to manage user actions
    
  

    return (
        <>
            <PageLayout>
                <BasicTableLayout
                    columns={columns(actions)}
                    state={attendanceState}
                />
            </PageLayout>
        </>
    );
};

export default attendanceViewPage;
