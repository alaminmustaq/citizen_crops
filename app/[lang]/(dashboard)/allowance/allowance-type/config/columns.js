import { TableActions } from "@/components/table/TableActions";

const allowanceTypeColumns = (actions) => [
  {
    accessorKey: "name",
    header: "Allowance Name",
  },
  {
    accessorKey: "type",
    header: "Type",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => {
      const type = row.original.type || "—";
      const className =
        type === "earning"
          ? "bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
          : "bg-red-100 text-red-700 px-2 py-0.5 rounded-full";
      return <span className={className}>{type}</span>;
    },
  },
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
          { label: "Edit", onClick: actions?.onEdit, permission: "edit-allowance-type" },
          { label: "Delete", onClick: actions?.onDelete, danger: true, passId: true, permission: "delete-allowance-type" },
        ]}
      />
    ),
  },
];

export default allowanceTypeColumns;
