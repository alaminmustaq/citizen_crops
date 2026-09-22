
import { TableActions } from "@/components/table/TableActions";

const columns = (actions) => [
    {
        accessorKey: "template_name",
        header: "Template Name",
        cell: ({ row }) => row.original.template_name || "—",
    },
    {
        accessorKey: "type",
        header: "Type",
        thClass: "!text-center",
        tdClass: "!text-center",
        cell: ({ row }) => {
            const type = row.original.type || "custom";

            const className =
                type === "default"
                    ? "bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium"
                    : "bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium";

            return <span className={className}>{type}</span>;
        },
    },
    {
        accessorKey: "subject",
        header: "Subject",
        cell: ({ row }) => {
            const subject = row.original.subject || "—";

            return (
                <span className="line-clamp-1 max-w-xs" title={subject}>
                    {subject}
                </span>
            );
        },
    },
    {
        accessorKey: "message",
        header: "Message",
        cell: ({ row }) => {
            const message = row.original.message || "—";
            const plainText = message.replace(/<[^>]*>/g, "");

            return (
                <span
                    className="line-clamp-2 max-w-xs text-sm text-gray-600"
                    title={plainText}
                >
                    {plainText.length > 80
                        ? `${plainText.slice(0, 80)}...`
                        : plainText || "—"}
                </span>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        thClass: "!text-center",
        tdClass: "!text-center",
        cell: ({ row }) => {
            const status = row.original.status || "—";

            const className =
                status === "active"
                    ? "bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs"
                    : "bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs";

            return <span className={className}>{status}</span>;
        },
    },
    {
        id: "actions",
        enableHiding: false,
        header: " ",
        thClass: "!text-center w-[70px] whitespace-nowrap",
        tdClass: "!text-center w-[70px] whitespace-nowrap",
        cell: ({ row }) => {
            const isDefault = row.original.type === "default";

            return (
                <TableActions
                    data={row.original}
                    label="Actions"
                    items={[
                        {
                            label: "Edit",
                            onClick: actions?.onEdit,
                            permission: "edit-email-template",
                        },
                        {
                            label: "Duplicate",
                            onClick: actions?.onDuplicate,
                            permission: "create-email-template",
                        },
                        {
                            label: "Delete",
                            onClick: actions?.onDelete,
                            danger: true,
                            passId: true,
                            permission: "delete-email-template",
                            hidden: isDefault, // Hide delete button for default templates
                        },
                    ]}
                />
            );
        },
    },
];

export default columns;
