import { TableActions } from "@/components/table/TableActions";

const columns = (actions) => [
  // ===== Holiday Name =====
  { accessorKey: "name", header: "Holiday Name" },

  // ===== Date Range ===== 
  {
    header: "Date",
    accessorFn: (row) =>
      row.start_date && row.end_date ? `${row.start_date} → ${row.end_date}` : "—",
    cell: ({ row }) => (
      <span className="text-sm text-gray-700">
        {row.original.start_date && row.original.end_date
          ? `${row.original.start_date} → ${row.original.end_date}`
          : "—"}
      </span>
    ),
  },

  // ===== Status =====
  {
    accessorKey: "status",
    header: "Status",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => {
      const status = row.original.status || "—";

      const className =
        status === "active"
          ? "bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
          : "bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full";

      return <span className={className}>{status}</span>;
    },
  },

  // ===== Actions =====
  {
    id: "actions",
    enableHiding: false,
    header: " ",
    thClass: "!text-center w-[70px] whitespace-nowrap",
    tdClass: "!text-center w-[70px] whitespace-nowrap",
    cell: ({ row }) => (
      <TableActions
        data={row.original}
        label="Actions"
        items={[
          {
            label: "Edit",
            onClick: actions?.onEdit,
            permission: "edit-leave-reason",
          },
          {
            label: "Delete",
            onClick: actions?.onDelete,
            danger: true,
            passId: true,
            permission: "edit-leave-reason",
          },
        ]}
      />
    ),
  },
];

export default columns;
