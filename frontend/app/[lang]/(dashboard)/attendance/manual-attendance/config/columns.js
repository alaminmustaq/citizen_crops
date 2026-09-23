import { Users, Calendar, Clock, Building2 } from "lucide-react";

import { TableActions } from "@/components/table/TableActions";
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

// Format date: YYYY-MM-DD (or human-readable)
const formatDate = (dateString) => {
    if (!dateString) return "—";
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

// Format time: H:i (24h)
const formatTime = (timeString) => {
    if (!timeString) return "—";
    const parts = timeString.split(":");
    if (parts.length < 2) return timeString;
    const hours = String(parts[0]).padStart(2, "0");
    const minutes = String(parts[1]).padStart(2, "0");
    return `${hours}:${minutes}`;
};

// Calculate total hours between check-in and check-out
const calculateTotalHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const today = new Date().toDateString();
    const inDate = new Date(`${today} ${checkIn}`);
    const outDate = new Date(`${today} ${checkOut}`);
    if (outDate < inDate) outDate.setDate(outDate.getDate() + 1); // next day
    const diffMs = outDate - inDate;
    const hours = diffMs / (1000 * 60 * 60);
    return Math.round(hours * 100) / 100; // 2 decimals
};

// Column definitions
const columns = (actions) => [
    {
        accessorKey: "global_date",
        header: ({ column }) => (
            <div className="flex items-center gap-2">
              
                Date
            </div>
        ),
        cell: ({ row }) => (
            <span className="text-xs text-muted-foreground">
                {formatDate(row.original?.global_date)}
            </span>
        ),
    },

    {
        accessorKey: "timeRange",
        header: ({ column }) => (
            <div className="flex items-center gap-2">
             
             Global Time Range
            </div>
        ),
        cell: ({ row }) => {
            const checkIn = row.original?.global_check_in_time;
            const checkOut = row.original?.global_check_out_time;
            return (
                <span className="text-sm font-mono">
                    {checkIn && checkOut
                        ? `${formatTime(checkIn)} - ${formatTime(checkOut)}`
                        : "—"}
                </span>
            );
        },
    },
    {
        accessorKey: "totalHours",
        header: "Global Total Hours",
        cell: ({ row }) => {
            const total = calculateTotalHours(
                row.original?.global_check_in_time,
                row.original?.global_check_out_time
            );
            return <span className="text-sm font-medium">{total}h</span>;
        },
        sortingFn: (rowA, rowB) => {
            const a = calculateTotalHours(
                rowA.original?.global_check_in_time,
                rowA.original?.global_check_out_time
            );
            const b = calculateTotalHours(
                rowB.original?.global_check_in_time,
                rowB.original?.global_check_out_time
            );
            return a - b;
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original?.status} />,
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
                    { label: "Edit", onClick: actions?.onEdit ,  permission: "manual-attendance" }, 
                    { label: "Delete", onClick: actions?.onDelete, danger: true, passId: true, permission: "manual-attendance" }, // needs only ID
                ]}
            />
        ),
    },
];

// Export configurations
export const masterAttendanceColumns = columns;
export const compactColumns = (actions) =>
    columns(actions).filter((col) =>
        ["global_date", "displayProject", "status", "actions"].includes(
            col.accessorKey || col.id
        )
    );
export const detailedColumns = (actions) => columns(actions);

export default columns;
