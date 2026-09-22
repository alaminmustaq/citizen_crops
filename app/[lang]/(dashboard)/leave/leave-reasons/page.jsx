"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import BasicModel from "@/components/model/basic-model";
import columns from "./config/columns";
import fields from "./config/fields";
import { useLeaveReason } from "@/domains/leave/leave-reasons/hook/useLeaveReason";

const LeaveReasonPage = () => {
    const { actions, leaveState } = useLeaveReason();

    return (
        <PageLayout>
            <BasicTableLayout
                addPermission="create-leave-reason"
                addButtonLabel="Add Leave Reason"
                columns={columns(actions)}
                state={leaveState}
            />

            <BasicModel
                title={
                    leaveState?.form?.watch("id")
                        ? "create-job-position"
                        : "Create Leave Reason"
                }
                submitLabel={
                    leaveState?.form?.watch("id") ? "Update" : "Create"
                }
                cancelLabel="Cancel"
                size="xl"
                form={leaveState.form}
                fields={fields}
                actions={actions}
            />
        </PageLayout>
    );
};

export default LeaveReasonPage;
