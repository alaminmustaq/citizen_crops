import { Users, Calendar, Clock, Building2 } from "lucide-react";

import { TableActions } from "@/components/table/TableActions";
import { formatTime } from "@/lib/utils";

const Pill = ({ children, className = "" }) => (
    <span
        className={[
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
            className,
        ].join(" ")}
    >
        {children}
    </span>
);

const StatusBadge = ({ status }) => {
    const statusConfig = {
        published: {
            className: "bg-green-100 text-green-700",
            label: "Published",
        },
        draft: { className: "bg-yellow-100 text-yellow-700", label: "Draft" },
        archived: { className: "bg-gray-100 text-gray-700", label: "Archived" },
    };

    const config = statusConfig[status] || statusConfig.draft;

    return <Pill className={config.className}>{config.label}</Pill>;
};

const ApprovalStatusBadge = ({ status }) => {
    const statusConfig = {
        pending: { className: "bg-yellow-100 text-yellow-700", label: "Pending" },
        approved: { className: "bg-green-100 text-green-700", label: "Approved" },
        auto_approved: {
            className: "bg-green-100 text-green-700",
            label: "Auto Approved",
        },
        rejected: { className: "bg-red-100 text-red-700", label: "Rejected" },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return <Pill className={config.className}>{config.label}</Pill>;
};

const AttendanceTypeBadge = ({ type }) => {
    const typeConfig = {
        company_attendance: {
            className: "bg-blue-100 text-blue-700",
            label: "Company",
            icon: <Building2 className="h-3 w-3" />,
        },
        project_attendance: {
            className: "bg-purple-100 text-purple-700",
            label: "Project",
            icon: <Users className="h-3 w-3" />,
        },
    };

    const config = typeConfig[type] || typeConfig.company_attendance;

    return (
        <Pill className={config.className}>
            <div className="flex items-center gap-1">
                {config.icon}
                {config.label}
            </div>
        </Pill>
    );
};

const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
        });
    } catch {
        return dateString;
    }
};

const calculateTotalHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const today = new Date().toDateString();
    const inDate = new Date(`${today} ${checkIn}`);
    const outDate = new Date(`${today} ${checkOut}`);
    if (Number.isNaN(inDate.getTime()) || Number.isNaN(outDate.getTime())) {
        return null;
    }
    if (outDate < inDate) outDate.setDate(outDate.getDate() + 1);
    const diffMs = outDate - inDate;
    const hours = diffMs / (1000 * 60 * 60);
    return Math.round(hours * 100) / 100;
};

const getCheckInTime = (row) =>
    row?.check_in_time || row?.global_check_in_time || null;

const getCheckOutTime = (row) =>
    row?.check_out_time || row?.global_check_out_time || null;

const columns = (actions) => [
    {
        accessorKey: "employee",
        header: "Employee",
        cell: ({ row }) => {
            const employee = row.original?.employee;
            const employeeCount = Number(row.original?.employee_count || 0);
            if (employeeCount > 1) {
                return (
                    <span className="text-sm font-medium">
                        {employeeCount} Employees
                    </span>
                );
            }

            return (
                <span className="text-sm font-medium">
                    {actions?.getEmployeeName
                        ? actions.getEmployeeName(employee)
                        : employee
                            ? `${employee?.first_name || ""} ${employee?.last_name || ""}`.trim()
                            : "-"}
                </span>
            );
        },
    },
    {
        accessorKey: "date",
        header: ({ column }) => (
            <div className="flex items-center gap-2">Date</div>
        ),
        cell: ({ row }) => (
            <span className="text-xs text-muted-foreground">
                {formatDate(row.original?.date)}
            </span>
        ),
    },
    {
        accessorKey: "check_in_time",
        header: "Check In",
        cell: ({ row }) => (
            <span className="text-sm font-mono">
                {formatTime(getCheckInTime(row.original)) || "-"}
            </span>
        ),
    },
    {
        accessorKey: "check_out_time",
        header: "Check Out",
        cell: ({ row }) => (
            <span className="text-sm font-mono">
                {formatTime(getCheckOutTime(row.original)) || "-"}
            </span>
        ),
    },
    {
        accessorKey: "totalHours",
        header: "Total Hours",
        cell: ({ row }) => {
            const total = calculateTotalHours(
                getCheckInTime(row.original),
                getCheckOutTime(row.original),
            );
            return (
                <span className="text-sm font-medium">
                    {total === null ? "-" : `${total}h`}
                </span>
            );
        },
        sortingFn: (rowA, rowB) => {
            const a = calculateTotalHours(
                getCheckInTime(rowA.original),
                getCheckOutTime(rowA.original),
            );
            const b = calculateTotalHours(
                getCheckInTime(rowB.original),
                getCheckOutTime(rowB.original),
            );
            return (a ?? 0) - (b ?? 0);
        },
    },
    {
        accessorKey: "status",
        header: "Master Status",
        cell: ({ row }) => <StatusBadge status={row.original?.status} />,
    },
    {
        accessorKey: "approval_status",
        header: "Approval",
        cell: ({ row }) => (
            <ApprovalStatusBadge status={row.original?.approval_status} />
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
                        onClick: (data) => actions?.onApprove(data),
                        permission: "approve-manual-attendance",
                        hidden: row.original?.approval_status !== "pending",
                    },
                    {
                        label: "Edit",
                        onClick: actions?.onEdit,
                        permission: "manual-attendance",
                        hidden: row.original?.status === "draft",
                    },
                    {
                        label: "Delete",
                        onClick: (data) => actions?.onDelete(data),
                        danger: true,
                        permission: "manual-attendance",
                    },
                ]}
            />
        ),
    },
];

export const masterAttendanceColumns = columns;
export const compactColumns = (actions) =>
    columns(actions).filter((col) =>
        ["date", "employee", "status", "actions"].includes(
            col.accessorKey || col.id,
        ),
    );
export const detailedColumns = (actions) => columns(actions);

export default columns;
