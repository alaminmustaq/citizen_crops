import { format } from "date-fns";

const safe = (v, fallback = "—") => (v ?? v === 0 ? v : fallback);

const columns = () => [
  {
    accessorKey: "employee_name",
    header: "Employee",
    cell: ({ row }) => safe(row.original?.employee_name),
  },

  {
    accessorKey: "employee_email",
    header: "Employee Email",
    cell: ({ row }) => safe(row.original?.employee_email),
  },

  {
    accessorKey: "project_name",
    header: "Project",
    cell: ({ row }) => safe(row.original?.project_name),
  },

  {
    accessorKey: "branch_name",
    header: "Branch",
    cell: ({ row }) => safe(row.original?.branch_name),
  },

  {
    accessorKey: "start_date",
    header: "Start Date",
    cell: ({ row }) => {
      const v = row.original?.start_date;
      return v ? format(new Date(v), "yyyy-MM-dd") : "—";
    },
  },

  {
    accessorKey: "end_date",
    header: "End Date",
    cell: ({ row }) => {
      const v = row.original?.end_date;
      return v ? format(new Date(v), "yyyy-MM-dd") : "—";
    },
  },

  {
    accessorKey: "salary_type",
    header: "Salary Type",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => safe(row.original?.salary_type),
  },

  {
    accessorKey: "basic_salary",
    header: "Basic Salary",
    thClass: "!text-right",
    tdClass: "!text-right",
    cell: ({ row }) => safe(row.original?.basic_salary),
  },

  {
    accessorKey: "project_employee_status",
    header: "Status",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => {
      const status = row.original?.project_employee_status;
      if (!status) return "—";

      const statusClasses = {
        active: "bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs",
        inactive: "bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs", 
      };

      const className = statusClasses[status.toLowerCase()] || "bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs";

      return <span className={className}>{status}</span>;
    },
  },
];

export default columns;
