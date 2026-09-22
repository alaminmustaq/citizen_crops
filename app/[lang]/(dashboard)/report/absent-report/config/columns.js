const val = (v, f = "—") => (v ?? v === 0 ? v : f);

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
    id: "status",
    header: "Status",
    cell: ({ row }) => val(row.original?.status),
  },
];

export default columns;
