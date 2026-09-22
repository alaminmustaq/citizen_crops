import { TableActions } from "@/components/table/TableActions";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const formatTime = (value) => {
    if (!value) return "-";
    return String(value).slice(0, 5);
};

const employeeName = (employee) => {
    const name = [employee?.first_name, employee?.last_name]
        .filter(Boolean)
        .join(" ");
    return name || employee?.employee_code || "-";
};

const StatusBadge = ({ status }) => {
    const styles = {
        pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
        approved: "bg-green-100 text-green-700 hover:bg-green-100",
        rejected: "bg-red-100 text-red-700 hover:bg-red-100",
    };

    return (
        <Badge className={styles[status] || "bg-slate-100 text-slate-700"}>
            {status || "pending"}
        </Badge>
    );
};

const columns = (actions) => [
    {
        accessorKey: "employee",
        header: "Employee",
        thClass: "!text-left",
        tdClass: "!text-left",
        cell: ({ row }) => employeeName(row.original?.employee),
    },
    {
        accessorKey: "date",
        header: "Date",
        thClass: "!text-center",
        tdClass: "!text-center",
        cell: ({ row }) => formatDate(row.original?.date) || "-",
    },
    {
        accessorKey: "requested_check_in_time",
        header: "Check In",
        thClass: "!text-center",
        tdClass: "!text-center",
        cell: ({ row }) => (
            <span className="font-mono">
                {formatTime(row.original?.requested_check_in_time)}
            </span>
        ),
    },
    {
        accessorKey: "reason",
        header: "Reason",
        thClass: "!text-left",
        tdClass: "!text-left",
        cell: ({ row }) => (
            <span className="line-clamp-2 max-w-xs">
                {row.original?.reason || "-"}
            </span>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        thClass: "!text-center",
        tdClass: "!text-center",
        cell: ({ row }) => <StatusBadge status={row.original?.status} />,
    },
    {
        id: "actions",
        header: "Actions",
        thClass: "!text-center w-[80px]",
        tdClass: "!text-center w-[80px]",
        cell: ({ row }) => {
            const request = row.original;
            const isPending = request?.status === "pending";

            return (
                <TableActions
                    data={request}
                    items={[
                        {
                            label: "Edit Reason",
                            onClick: actions?.onEdit,
                            permission: "edit-attendance-request",
                            hidden: !actions?.isEmployee || !isPending,
                        },
                        {
                            label: "Approve",
                            onClick: actions?.onApprove,
                            permission: "approve-attendance-request",
                            hidden: !actions?.canDecide || !isPending,
                        },
                        {
                            label: "Reject",
                            onClick: actions?.onReject,
                            permission: "approve-attendance-request",
                            danger: true,
                            hidden: !actions?.canDecide || !isPending,
                        },
                    ]}
                />
            );
        },
    },
];

export default columns;
