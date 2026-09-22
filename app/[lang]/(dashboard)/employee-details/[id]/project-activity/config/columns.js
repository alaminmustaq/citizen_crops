const columnsProjectActivities = (actions) => [
  {
    accessorKey: "project_name",
    header: "Project",
  },
  {
    accessorKey: "name",
    header: "Employee Name",
  },
  {
    accessorKey: "salary_type",
    header: "Salary Type",
  },
  {
    accessorKey: "basic_salary",
    header: "Salary (€)",
    thClass: "!text-right",
    tdClass: "!text-right",
    cell: ({ row }) => `€${parseFloat(row.original.basic_salary || 0).toFixed(2)}`,
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => row.original.start_date || "—",
  },
  {
    accessorKey: "end_date",
    header: "End Date",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => row.original.end_date || "—",
  },
  {
    accessorKey: "status",
    header: "Status",
    thClass: "!text-center",
    tdClass: "!text-center",
  },
];

export default columnsProjectActivities;
