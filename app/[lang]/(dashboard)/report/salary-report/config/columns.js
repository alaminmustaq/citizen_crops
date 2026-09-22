const safe = (v, fallback = "—") => (v ?? v === 0 ? v : fallback);

let columns = () => [
  {
    header: "Name",
    accessorKey: "employee",
    cell: ({ row }) => {
      console.log(row);
      
      const emp = row.original?.employee;
      return emp
        ? `${emp.first_name ?? ""} ${emp.last_name ?? ""}`.trim()
        : "—";
    },
  },

  {
    accessorKey: "employee.employee_code",
    header: "Code",
  },

  {
    id: "job_position",
    header: "Job Position",
    cell: ({ row }) => safe(row.original?.job_position?.title),
  },

  {
    id: "salary_month",
    header: "Salary Month",
    cell: ({ row }) => safe(row.original?.salary_month),
  },

  {
    id: "net_payable",
    header: "Net Payable",
    cell: ({ row }) => safe(row.original?.net_payable),
  },

  {
    id: "total_hours",
    header: "Total Hours",
    cell: ({ row }) => safe(row.original?.total_hours),
  }, 

  {
    id: "admin_status",
    header: "Admin Status",
    cell: ({ row }) => safe(row.original?.admin_status),
  },
];

export default columns;
