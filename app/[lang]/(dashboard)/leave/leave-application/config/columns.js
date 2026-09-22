import { TableActions } from "@/components/table/TableActions";
import { formatDate } from "@/lib/utils";

const leaveApplicationColumns = (actions) => [
    {
        accessorKey: "employee.first_name",
        header: "Employee",
        thClass: "!text-left",
        tdClass: "!text-left",
        cell: ({ row }) => {
            const emp = row.original.employee;
            return emp ? `${emp.first_name} ${emp.last_name ?? ""}` : "-";
        },
    },
    {
        accessorKey: "leave_type.name",
        header: "Leave Type",
        thClass: "!text-center",
        tdClass: "!text-center",
    },
    {
        accessorKey: "start_date",
        header: "From",
        cell: ({ row }) => {
            const date = row.original.start_date;
            return date ? formatDate(date) : "—";
        },
    },
    {
        accessorKey: "end_date",
        header: "To",
        cell: ({ row }) => {
            const date = row.original.end_date;
            return date ? formatDate(date) : "—";
        },
    },
    {
        accessorKey: "leave_day",
        header: "Days",
        thClass: "!text-center",
        tdClass: "!text-center",
    },
    {
        accessorKey: "leave_status",
        header: "Status",
        thClass: "!text-center",
        tdClass: "!text-center",
        cell: ({ row }) => {
            const status = row.original.leave_status;
            const colors = {
                pending: "bg-yellow-100 text-yellow-700",
                approved: "bg-green-100 text-green-700",
                rejected: "bg-red-100 text-red-700",
            };
            return (
                <span className={`px-2 py-0.5 rounded-full ${colors[status]}`}>
                    {status}
                </span>
            );
        },
    },
    {
        accessorKey: "application_file",
        header: "File",
        thClass: "!text-center",
        tdClass: "!text-center",
        cell: ({ row }) => {
            const url = row.original.application_file_url;
            if (!url) return "â€”";

            return (
                <button
                    type="button"
                    onClick={() => actions?.onViewFile?.(row.original)}
                    className="text-primary underline underline-offset-2"
                >
                    View
                </button>
            );
        },
    },
    {
        accessorKey: "type",
        header: "Type",
        thClass: "!text-center",
        tdClass: "!text-center",
        cell: ({ row }) => {
            const status = row.original.type;
            const colors = {
                single: "bg-blue-100 text-blue-700",
                grouped: "bg-orange-100 text-orange-700",
            };
            return (
                <span className={`px-2 py-0.5 rounded-full ${colors[status]}`}>
                    {status}
                </span>
            );
        },
    },
    {
        id: "updated_by",
        accessorKey: "updated_by",
        header: "Updated By",
        cell: ({ row }) => {
            const updater = row.original.updated_by_user;
            if (!updater) return "—";

            const role = updater.roles?.[0]?.display_name ?? "—";

            if (updater.employee) {
                const { first_name, middle_name, last_name, employee_code } =
                    updater.employee;

                const fullName = [first_name, middle_name, last_name]
                    .filter(Boolean)
                    .join(" ");

                return (
                    <div className="flex flex-col">
                        <span className="font-medium">
                            {fullName}
                            {employee_code && (
                                <span className="text-gray-500">
                                    {" "}
                                    ({employee_code})
                                </span>
                            )}
                        </span>
                        <span className="text-[11px] text-gray-500">
                            {role}
                        </span>
                    </div>
                );
            }

            if (updater.company) {
                return (
                    <div className="flex flex-col">
                        <span className="font-medium">
                            {updater.company.name}
                            {updater.company.code && (
                                <span className="text-gray-500">
                                    {" "}
                                    ({updater.company.code})
                                </span>
                            )}
                        </span>
                        <span className="text-[11px] text-gray-500">
                            {role}
                        </span>
                    </div>
                );
            }

            return "—";
        },
    },
    {
        id: "actions",
        header: " ",
        thClass: "!text-center w-[70px]",
        tdClass: "!text-center w-[70px]",
        cell: ({ row }) => {
            const type = row.original.type;

            if (type === "grouped") {
                return <span className="text-gray-400">—</span>;
            }

            return (
                <TableActions
                    data={row.original}
                    label="Actions"
                    items={[
                        {
                            label: "View",
                            onClick: actions?.onView,
                            permission: "view-leave",
                        },
                        {
                            label: "Edit",
                            onClick: actions?.onEdit,
                            permission: "edit-leave",
                        },
                        {
                            label: "Delete",
                            onClick: actions?.onDelete,
                            danger: true,
                            passId: true,
                            permission: "delete-leave",
                        },
                    ]}
                />
            );
        },
    },
];

export default leaveApplicationColumns;
