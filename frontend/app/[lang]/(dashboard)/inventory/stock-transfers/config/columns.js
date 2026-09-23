import { TableActions } from "@/components/table/TableActions";

const columns = (actions) => [
 
  {
    accessorKey: "transfer_date",
    header: "Transfer Date",
    cell: ({ row }) => row.original.transfer_date || "—",
  },
  {
    accessorKey: "sender_warehouse",
    header: "Sender Warehouse",
    cell: ({ row }) => row.original.sender_warehouse?.name || "—",
  },
  {
    accessorKey: "destination_warehouse",
    header: "Destination Warehouse",
    cell: ({ row }) => row.original.destination_warehouse?.name || "—",
  },
  {
    accessorKey: "total_send_item",
    header: "Total Quantity Sent",
    cell: ({ row }) => row.original.total_send_item ?? 0,
  },
  {
    accessorKey: "transfer_status",
    header: "Status",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => {
      const status = row.original.transfer_status || "—";
      const className =
        status === "completed"
          ? "bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
          : status === "pending"
          ? "bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full"
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
          { label: "Edit", onClick: actions?.onEdit, permission: "edit-stock-transfer"},
          { label: "Delete", onClick: actions?.onDelete, danger: true, passId: true ,  permission: "delete-stock-transfer" },
        ]}
      />
    ),
  },
];

export default columns;
