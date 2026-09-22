import { TableActions } from "@/components/table/TableActions";

const jobListColumns = (actions) => [
    {
        accessorKey: "job_title",
        header: "Job Title",
    },
    {
        accessorKey: "job_description",
        header: "Description",
        cell: ({ row }) => {
            const desc = row.original.job_description || "—";
            // Strip HTML tags for table display
            const plainText = desc.replace(/<[^>]*>/g, "");
            return (
                <span
                    className="line-clamp-2 max-w-xs text-sm text-gray-600"
                    title={plainText}
                >
                    {plainText.length > 80
                        ? plainText.slice(0, 80) + "..."
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
        cell: ({ row }) => (
            <TableActions
                data={row.original}
                label="Actions"
                items={[
                    {
                        label: "Edit",
                        onClick: actions?.onEditDetails,
                        permission: "view-project",
                    },
                    {
                        label: "View Details",
                        onClick: actions?.onViewJobDetails,
                        passId: true,
                        permission: "view-project",
                    },
                    {
                        label: "Copy Link",
                        onClick: actions?.onCopyLink,
                        passId: true,
                        permission: "view-project",
                    },
                    {
                        label: "Delete",
                        onClick: actions?.onDelete,
                        danger: true,
                        passId: true,
                        permission: "view-project",
                    },
                ]}
            />
        ),
    },
];

export default jobListColumns;
