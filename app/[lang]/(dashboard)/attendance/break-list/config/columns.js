import { TableActions } from "@/components/table/TableActions";
import { formatTime } from "@/lib/utils";

const val = (v, f = "-") => ((v ?? v === 0) ? v : f);

const StatusBadge = ({ status }) => {
    const statusConfig = {
        pending: "bg-yellow-100 text-yellow-700",
        approved: "bg-green-100 text-green-700",
        rejected: "bg-red-100 text-red-700",
        auto_approved: "bg-slate-100 text-slate-700",
    };

    return (
        <span
            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                statusConfig[status] || statusConfig.pending
            }`}
        >
            {String(status || "pending").replace("_", " ")}
        </span>
    );
};

const columns = (actions) => [
    {
        id: "employee",
        header: "Employee",
        cell: ({ row }) =>
            `${row.original?.employee?.first_name || "inactive"} ${row.original?.employee?.last_name || "Employee"}`,
    },
    {
        id: "employee_code",
        header: "Employee Code",
        cell: ({ row }) => val(row.original?.employee?.employee_code),
    },
    {
        id: "date",
        header: "Date",
        cell: ({ row }) => val(row.original?.date),
    },
    {
        id: "break_start_time",
        header: "Break Start Time",
        cell: ({ row }) => val(formatTime(row.original?.break_start_time)),
    },
    {
        id: "break_end_time",
        header: "Break End Time",
        cell: ({ row }) => val(formatTime(row.original?.break_end_time)),
    },
    {
        id: "break_minutes",
        header: "Break Minutes",
        cell: ({ row }) =>
            row.original?.break_minutes || row.original?.break_minutes === 0
                ? `${Number(row.original.break_minutes).toFixed(2)} min`
                : "-",
    },
    {
        id: "break_reason",
        header: "Reason",
        cell: ({ row }) => val(row.original?.break_reason),
    },
    {
        id: "approval_status",
        header: "Status",
        cell: ({ row }) => (
            <StatusBadge status={row.original?.approval_status} />
        ),
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
                        label: "Approve",
                        onClick: actions?.onApproveBreak,
                        permission: "edit-break-list",
                        hidden: row.original?.approval_status === "approved",
                    },
                    {
                        label: "Reject",
                        onClick: actions?.onRejectBreak,
                        danger: true,
                        permission: "edit-break-list",
                        hidden: row.original?.approval_status === "rejected",
                    },
                ]}
            />
        ),
    },
];

export default columns;
