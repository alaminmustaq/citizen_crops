import { TableActions } from "@/components/table/TableActions";

const employeeShiftColumns = (actions) => [
  {
    accessorKey: "name",
    header: "Employee Shift",
  },
  {
    accessorKey: "type",
    header: "Shift Type",
    thClass: "!text-center",
    tdClass: "!text-center",
    size: 140,
    cell: ({ row }) => {
      const type = row.original.type || "—";
      const className =
        type === "day"
          ? "bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
          : "bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full";

      return <span className={className}>{type}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    thClass: "!text-center",
    tdClass: "!text-center",
    size: 120,
    cell: ({ row }) => {
      const status = row.original.status || "—";
      const className =
        status === "active"
          ? "bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
          : "bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full";

      return <span className={className}>{status}</span>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: " ",
    thClass: "!text-center w-[70px] whitespace-nowrap",
    tdClass: "!text-center w-[70px] whitespace-nowrap",
    size: 80,
    cell: ({ row }) => (
      <TableActions
        data={row.original}
        label="Actions"
        items={[
          {
            label: "Edit",
            onClick: actions?.onEdit,
            permission: "edit-employee-shift",
          },
          {
            label: "Delete",
            onClick: actions?.onDelete,
            danger: true,
            passId: true,
            permission: "delete-employee-shift",
          },
        ]}
      />
    ),
  },
];

export default employeeShiftColumns;
