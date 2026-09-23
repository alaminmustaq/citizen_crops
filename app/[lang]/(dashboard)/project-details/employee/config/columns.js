const columnsEmployees = (actions) => [
  { accessorKey: "name", header: "Name" },


  // ✅ Availability badge
   {
    accessorKey: "status",
    header: "Status",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => {
      const status = row.original.status; // active / inactive
      const badgeClass =
        status === "active"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700";
      const label = status === "active" ? "Active" : "Inactive";
      return (
        <span
          className={`${badgeClass} text-xs font-medium px-2 py-0.5 rounded-full inline-block`}
        >
          {label}
        </span>
      );
    },
  },

  {
    accessorKey: "start_date",
    header: "Assigned At",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => row.original.start_date || "—",
  },
  {
    accessorKey: "end_date",
    header: "Removed At",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => row.original.end_date || "—",
  },

  {
    accessorKey: "basic_salary",
    header: "Salary",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => `€${row.original.basic_salary || 0}`,
  },

  {
    accessorKey: "salary_type",
    header: "Salary Type",
    thClass: "!text-center",
    tdClass: "!text-center",
  },
];

export default columnsEmployees;
