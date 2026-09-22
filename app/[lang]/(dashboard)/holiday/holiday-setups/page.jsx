"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import BasicModel from "@/components/model/basic-model";
import columns from "./config/columns";
import fields from "./config/fields";
import { useHolidaySetup } from "@/domains/holiday/holiday-setup/hook/useHolidaySetup";

const HolidaySetupPage = () => {
    const { actions, holidayState } = useHolidaySetup();

    return (
        <PageLayout>
            <BasicTableLayout
                addPermission="create-leave-reason"
                addButtonLabel="Add Holiday Setup"
                columns={columns(actions)}
                state={holidayState}
            />

            <BasicModel
                title={
                    holidayState?.form?.watch("id")
                        ? "create-job-position"
                        : "Create Holiday Setup"
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

export default HolidaySetupPage;
