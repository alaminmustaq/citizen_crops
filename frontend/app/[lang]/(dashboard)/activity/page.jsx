"use client";
import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import columns from "./config/columns"; 
import { useActivity } from "@/domains/activity/hook/useActivity";

const ActivityPage = () => {
    const { actions, activityState } = useActivity();

    return (
        <PageLayout>
            <BasicTableLayout 
                columns={columns(actions)}
                state={activityState}
                filterCustom={{
                    event: {
                        multiple: true,
                        values: [
                            { key: "created", value: "Created" },
                            { key: "updated", value: "Updated" },
                            { key: "deleted", value: "Deleted" },
                        ],
                    }
                }}
            /> 
        </PageLayout>
    );
};

export default ActivityPage;
