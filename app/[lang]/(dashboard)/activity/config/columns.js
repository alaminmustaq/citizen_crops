import React from "react";
import { formatDateTime } from "@/lib/utils";
import { TableActions } from "@/components/table/TableActions";

export default function columns(actions) {
    return [
        {
            id: "module",
            header: "Module",
            accessorKey: "module",
        },
        {
            id: "event",
            header: "Event",
            accessorKey: "event",
        },
        {
            id: "description",
            header: "Description",
            accessorKey: "description",
        },
        {
            id: "causer",
            header: "User",
            accessorKey: "causer",
            cell: ({ getValue }) => getValue() || "System",
        }, 
        {
            id: "changes",
            header: "Changes",
            accessorKey: "changes",
            cell: ({ getValue }) => {
                const changes = getValue() || [];
                return `${changes.length} field(s) changed`;
            },
        },
        {
            id: "created_at",
            header: "Date",
            accessorKey: "created_at",
            cell: ({ getValue }) => formatDateTime(getValue()),
        }, 
    ];
}
