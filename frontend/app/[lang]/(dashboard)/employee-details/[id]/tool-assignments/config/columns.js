const columnsToolAssignments = () => [
  {
    accessorKey: "project_name",
    header: "Project",
    cell: ({ row }) => row.original.project_name || "—",
  },
  {
    accessorKey: "tool_name",
    header: "Tool",
    cell: ({ row }) => row.original.tool_name || "—",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => row.original.quantity ?? "—",
  },
  {
    accessorKey: "assign_date",
    header: "Assign Date",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => row.original.assign_date || "—",
  },
  {
    accessorKey: "return_date",
    header: "Return Date",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => row.original.return_date || "—",
  },
  {
    accessorKey: "status",
    header: "Status",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => {
      const status = row.original.status?.toLowerCase() || "—";
      const badgeClass = {
        distributed: "bg-blue-100 text-blue-700",
        returned: "bg-green-100 text-green-700",
        lost: "bg-red-100 text-red-700",
        damaged: "bg-orange-100 text-orange-700",
        overdue: "bg-yellow-100 text-yellow-700",
      }[status] || "bg-gray-100 text-gray-700";

      return (
        <span
          className={`${badgeClass} text-xs font-medium px-2 py-0.5 rounded-full inline-block`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    },
  },
];

export default columnsToolAssignments;
