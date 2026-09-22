"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import BasicModel from "@/components/model/basic-model";
import columns from "./config/columns";
import fields from "./config/fields";
import { useBreakReason } from "@/domains/attendance/break-reasons/hook/useBreakReason";

const BreakReasonPage = () => {
    const { actions, breakReasonState } = useBreakReason();

    return (
        <PageLayout>
            <BasicTableLayout
                addPermission="create-break-reason"
                addButtonLabel="Add Break Reason"
                columns={columns(actions)}
                state={breakReasonState}
            />

            <BasicModel
                title={
                    breakReasonState?.form?.watch("id")
                        ? "Edit Break Reason"
                        : "Create Break Reason"
                }
                submitLabel={
                    breakReasonState?.form?.watch("id") ? "Update" : "Create"
                }
                cancelLabel="Cancel"
                size="xl"
                form={breakReasonState.form}
                fields={fields}
                actions={actions}
            />
        </PageLayout>
    );
};

export default BreakReasonPage;
