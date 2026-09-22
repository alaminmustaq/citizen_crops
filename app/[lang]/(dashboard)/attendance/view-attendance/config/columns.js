import { TableActions } from "@/components/table/TableActions";
import {
    formatTime,
    getAttendanceDisplayTimes,
} from "@/lib/utils";

const val = (v, f = "-") => ((v ?? v === 0) ? v : f);

let columns = (actions, user) => [
    {
        id: "name",
        header: "Name",
        cell: ({ row }) =>
            `${row.original?.employee?.first_name || "inactive"}  ${row.original?.employee?.last_name || "Employee"}`,
    },
    {
        id: "employee_number",
        header: "Employee Code",
        cell: ({ row }) => val(row.original?.employee?.employee_code),
    },
    {
        id: "branch",
        header: "Branch",
        cell: ({ row }) => row.original?.employee?.branch?.name ?? "-",
    },
    {
        id: "date",
        header: "Date",
        cell: ({ row }) => val(row.original?.date),
    },
    {
        id: "salary_type",
        header: "Salary Type",
        cell: ({ row }) =>
            val(row.original?.salary_type)
                ? String(row.original?.salary_type).charAt(0).toUpperCase() +
                  String(row.original?.salary_type).slice(1)
                : "-",
    },
    {
        id: "check_in_time",
        header: "Check In Time",
        cell: ({ row }) => {
            const { checkInTime } = getAttendanceDisplayTimes({
                checkInTime: row.original?.check_in_time,
                checkOutTime: row.original?.check_out_time,
                lastInTime: row.original?.last_in_time,
            });
            return val(formatTime(checkInTime));
        },
    },
    {
        id: "check_out_time",
        header: "Check Out Time",
        cell: ({ row }) => {
            const { checkOutTime } = getAttendanceDisplayTimes({
                checkInTime: row.original?.check_in_time,
                checkOutTime: row.original?.check_out_time,
                lastInTime: row.original?.last_in_time,
            });
            return val(formatTime(checkOutTime));
        },
    },
    {
        id: "break_reason",
        header: "Break Reason",
        cell: ({ row }) =>
            val(
                row.original?.break_reason ||
                    row.original?.breakReason ||
                    row.original?.break?.reason ||
                    row.original?.break?.name,
            ),
    },
    ...(user?.role_id === 3
        ? []
        : [
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
                                  onClick: actions?.onEdit,
                                  permission: "edit-attendance",
                              },
                              {
                                  label: "Delete",
                                  onClick: (data) => actions?.onDelete(data),
                                  danger: true,
                                  permission: "delete-attendance",
                              },
                          ]}
                      />
                  ),
              },
          ]),
];

export default columns;
