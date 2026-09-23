import React from "react";
import { format } from "date-fns";
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
            cell: ({ getValue }) => {
                const v = getValue();
                return v ? format(new Date(v), "yyyy-MM-dd HH:mm") : "-";
            },
        }, 
    ];
}
