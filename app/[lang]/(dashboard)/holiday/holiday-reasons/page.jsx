"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import BasicModel from "@/components/model/basic-model";
import columns from "./config/columns";
import fields from "./config/fields";
import { useHolidayReason } from "@/domains/holiday/holiday-reasons/hook/useHolidayReason";

const HolidayReasonPage = () => {
    const { actions, holidayState } = useHolidayReason();

    return (
        <PageLayout>
            <BasicTableLayout
                addPermission="create-holiday-reason"
                addButtonLabel="Add Holiday Reason"
                columns={columns(actions)}
                state={holidayState}
            />

            <BasicModel
                title={
                    holidayState?.form?.watch("id")
                        ? "create-holiday-reason"
                        : "Create Holiday Reason"
                }
                submitLabel={
                    holidayState?.form?.watch("id") ? "Update" : "Create"
                }
                cancelLabel="Cancel"
                size="xl"
                form={holidayState.form}
                fields={fields}
                actions={actions}
            />
        </PageLayout>
    );
};

export default HolidayReasonPage;
