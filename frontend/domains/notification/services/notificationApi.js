import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";

export const notificationApi = createApi({
    reducerPath: "Notification",
    baseQuery: baseQuery,
    tagTypes: ["Notification"],
    endpoints: (builder) => ({
        
        // =============================
        // MARK AS READ API
        // =============================
        markAllAsRead: builder.mutation({
            query: () => ({
                url: "admin/notifications/notifications/mark-as-read",
                method: "POST",
                body: {}, // no IDs needed
            }),
        }),
    }),
});

export const { useMarkAllAsReadMutation } = notificationApi;