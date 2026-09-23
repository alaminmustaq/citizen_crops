const columnsToolAssignments = () => [
  {
    accessorKey: "employee",
    header: "Employee",
    cell: ({ row }) => row.original.employee || "—",
  },
  {
    accessorKey: "tool",
    header: "Tool",
    cell: ({ row }) => row.original.tool || "—",
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
    cell: ({ row }) => row.original.assign_date || "—", // ✅ fixed
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
      const status = row.original.status || "—";
      const badgeClass =
        status.toLowerCase() === "assigned"
          ? "bg-green-100 text-green-700"
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
