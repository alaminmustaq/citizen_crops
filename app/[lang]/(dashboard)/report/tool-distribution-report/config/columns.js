import { format } from "date-fns";

const safe = (v, fallback = "â€”") => (v ?? v === 0 ? v : fallback);

const columns = () => [
  {
    accessorKey: "tool_name",
    header: "Tool Name",
    cell: ({ row }) => safe(row.original?.tool_name),
  },
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => safe(row.original?.sku),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => safe(row.original?.quantity),
  },
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
    accessorKey: "warehouse_name",
    header: "Warehouse",
    cell: ({ row }) => safe(row.original?.warehouse_name),
  },
  {
    accessorKey: "distribution_date",
    header: "Distribution Date",
    cell: ({ row }) => {
      const v = row.original?.distribution_date;
      return v ? format(new Date(v), "yyyy-MM-dd") : "â€”";
    },
  },
  {
    accessorKey: "return_date",
    header: "Return Date",
    cell: ({ row }) => {
      const v = row.original?.return_date;
      return v ? format(new Date(v), "yyyy-MM-dd") : "â€”";
    },
  },
  {
    accessorKey: "tool_status",
    header: "Status",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => {
      const status = row.original?.tool_status;

      if (!status) return "â€”";

      const statusClasses = {
        distributed: "bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs",
        returned: "bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs",
        lost: "bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs",
        damaged: "bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs",
      };

      const className =
        statusClasses[status] ||
        "bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs";

      return <span className={className}>{status}</span>;
    },
  }

];

export default columns;
