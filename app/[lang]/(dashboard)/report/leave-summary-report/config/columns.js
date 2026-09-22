const leaveSummaryReportColumns = () => [
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
    accessorKey: "total_leave_days",
    header: "Total Days",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => Number(row.original.total_leave_days) ?? 0,
  },
    {
    accessorKey: "master_available_leave",
    header: "Available Leave",
  },
  {
    accessorKey: "year",
    header: "Year",
    thClass: "!text-center",
    tdClass: "!text-center",
  },
];

export default leaveSummaryReportColumns;
