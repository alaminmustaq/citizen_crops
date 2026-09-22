import {
    formatTime,
    getAttendanceDisplayTimes,
} from "@/lib/utils";

const val = (v, f = "-") => (v ?? v === 0 ? v : f);

const isLateEntry = (row) => {
  const lateMinutes = Number(row?.late_minutes ?? 0);
  const status = String(row?.status ?? "").toLowerCase();

  return lateMinutes > 0 || status === "late";
};

let columns = (actions) => [
  {
    id: "employee_name",
    header: "Employee Name",
    cell: ({ row }) => val(row.original?.employee_name),
  },
  {
    id: "branch_name",
    header: "Branch Name",
    cell: ({ row }) => val(row.original?.branch_name),
  },
  {
    id: "department_name",
    header: "Department Name",
    cell: ({ row }) => val(row.original?.department_name),
  },
  {
    id: "project_name",
    header: "Project Name",
    cell: ({ row }) => val(row.original?.project_name),
  },
  {
    id: "salary_type",
    header: "Salary Type",
    cell: ({ row }) => val(row.original?.salary_type),
  },
  {
    id: "date",
    header: "Date",
    cell: ({ row }) => val(row.original?.date),
  },
  {
    id: "check_in_time",
    header: "Check-in Time",
    cell: ({ row }) => {
      const { checkInTime } = getAttendanceDisplayTimes({
        checkInTime: row.original?.in_time,
        checkOutTime: row.original?.out_time,
        lastInTime: row.original?.last_in_time,
      });
      return val(formatTime(checkInTime));
    },
  },
  {
    id: "check_out_time",
    header: "Check-out Time",
    cell: ({ row }) => {
      const { checkOutTime } = getAttendanceDisplayTimes({
        checkInTime: row.original?.in_time,
        checkOutTime: row.original?.out_time,
        lastInTime: row.original?.last_in_time,
      });
      return val(formatTime(checkOutTime));
    },
  },
  {
    id: "late_minutes",
    header: "Late Minutes",
    cell: ({ row }) => (
      <span className={isLateEntry(row.original) ? "text-red-600 font-medium" : ""}>
        {val(row.original?.late_minutes)}
      </span>
    ),
  },
  {
    id: "total_minutes",
    header: "Total Minutes",
    cell: ({ row }) => val(row.original?.total_minutes),
  },
  {
    id: "overtime_minutes",
    header: "Overtime Minutes",
    cell: ({ row }) => val(row.original?.overtime_minutes),
  },
  {
    id: "early_minutes",
    header: "Early Minutes",
    cell: ({ row }) => val(row.original?.early_minutes),
  },
  {
    id: "break_minutes",
    header: "Break Minutes",
    cell: ({ row }) => val(row.original?.break_minutes),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className={isLateEntry(row.original) ? "text-red-600 font-medium" : ""}>
        {val(row.original?.status)}
      </span>
    ),
  },
];

export default columns;
