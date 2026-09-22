const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date); // e.g. "31 Oct 2025"
};

const columnsToolAssignments = () => [
  {
    accessorKey: "employee",
    header: "Employee",
    cell: ({ row }) => {
      const emp = row.original.tool_distribution?.employee;
      return emp ? `${emp.first_name} ${emp.last_name} (${emp.work_email})` : "—";
    },
  },
  {
    accessorKey: "tool",
    header: "Tool",
    cell: ({ row }) => row.original.tool_name || "—",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => row.original.quantity || "—",
  },
  {
    accessorKey: "assign_date",
    header: "Assign Date",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => formatDate(row.original.tool_distribution?.distribution_date),
  },
  {
    accessorKey: "return_date",
    header: "Return Date",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => formatDate(row.original.tool_distribution?.return_date),
  },
  {
    accessorKey: "status",
    header: "Status",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => {
      const status = row.original.status || "—";
      const badgeClass =
        status.toLowerCase() === "assigned"
          ? "bg-green-100 text-green-700"
          : status.toLowerCase() === "lost"
          ? "bg-red-100 text-red-700"
          : status.toLowerCase() === "returned"
          ? "bg-blue-100 text-blue-700"
          : "bg-gray-100 text-gray-700";

      return (
        <span className={`${badgeClass} text-xs font-medium px-2 py-0.5 rounded-full inline-block`}>
          {status}
        </span>
      );
    },
  },
];

export default columnsToolAssignments;
