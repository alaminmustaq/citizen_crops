"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import columns from "./config/notificationColumns"; // new columns for notifications
import { useAllNotification } from "@/domains/all-notification/hook/useAllNotification";

const NotificationPage = () => {
    const { notificationState } = useAllNotification();

    return (
        <PageLayout>
            <BasicTableLayout
                columns={columns()} // no actions yet
                state={notificationState}
                addButtonLabel="" // hide or remove
            /> 
        </PageLayout>
    );
};

export default NotificationPage;
