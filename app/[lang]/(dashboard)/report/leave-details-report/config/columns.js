import { TableActions } from "@/components/table/TableActions";
import { formatDate } from "@/lib/utils";

const leaveDetailsReportColumns = () => [
    {
        accessorKey: "employee.employee_code",
        header: "Employee Id",
        thClass: "!text-center",
        tdClass: "!text-center",
        cell: ({ row }) => row.original?.employee?.employee_code || "—",
    },
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
    },
    {
        accessorKey: "start_date",
        header: "From",
        cell: ({ row }) => formatDate(row.original.start_date),
    },
    {
        accessorKey: "end_date",
        header: "To",
        cell: ({ row }) => formatDate(row.original.end_date),
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
        accessorKey: "type",
        header: "Type",
        thClass: "!text-center",
        tdClass: "!text-center",
    },
    {
        id: "reason",
        header: "Reason",
        cell: ({ row }) => {
            return (
                row.original.reason?.name || row.original.other_reason || "—"
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

            // EMPLOYEE USER
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

            // COMPANY USER
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
];

export default leaveDetailsReportColumns;
