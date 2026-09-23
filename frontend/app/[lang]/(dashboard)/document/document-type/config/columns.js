import * as LucideIcons from "lucide-react";
import { TableActions } from "@/components/table/TableActions";

const columns = (actions) => [
    {
        id: "name",
        header: "Document Type",
        accessorKey: "name",
    },
    {
        id: "icon",
        header: "Icon",
        thClass: "!text-center", 
        tdClass: "!text-center",
        cell: ({ row }) => {
            const iconName = row.original.icon; // e.g. "FileText"
            const IconComponent = LucideIcons[iconName] || LucideIcons.FileText;

            return (
                <span className="flex items-center justify-center">
                    <IconComponent className="w-4 h-4" />
                </span>
            );
        },
    },
    {
        id: "status",
        header: "Status",
        thClass: "!text-center", 
        tdClass: "!text-center",
        cell: ({ row }) => (row.original.status ? "Active" : "Inactive"),
    },
    // Actions
    {
        id: "actions",
        enableHiding: false,
        header: " ",
        thClass: "!text-center w-[70px] whitespace-nowrap",
        tdClass: "!text-center w-[70px] whitespace-nowrap",
        cell: ({ row }) => (
            <TableActions
                data={row.original}
                label="Actions"
                // alignmentClass is omitted here, so it defaults to "flex justify-center"
                items={[
                    { label: "Edit", onClick: actions?.onEdit ,permission: "edit-document" },
                    { label: "Delete", onClick: actions?.onDelete, danger: true, passId: true, permission: "delete-document"}, // needs only ID
                ]}
            />
        ),
    },
];

export default columns;
