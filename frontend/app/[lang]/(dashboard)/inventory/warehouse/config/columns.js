import { TableActions } from "@/components/table/TableActions";

const columns = (actions) => [
  {
    accessorKey: "name",
    header: "Warehouse Name",
    cell: ({ row }) => row.original.name || "—",
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => row.original.location || "—",
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
          : status === "inactive"
          ? "bg-red-100 text-red-700 px-2 py-0.5 rounded-full"
          : "bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full";
      return <span className={className}>{status}</span>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    thClass: "!text-center w-[100px] whitespace-nowrap",
    tdClass: "!text-center w-[100px] whitespace-nowrap",
    cell: ({ row }) => (
      <TableActions
        data={row.original}
        label="Actions"
        items={[
          { label: "Edit", onClick: actions?.onEdit,  permission: "edit-warehouse"},
          { label: "Delete", onClick: actions?.onDelete, danger: true, passId: true ,  permission: "delete-warehouse" },
        ]}
      />
    ),
  },
];

export default columns;
