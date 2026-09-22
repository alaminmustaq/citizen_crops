import { TableActions } from "@/components/table/TableActions";

const columns = (actions) => [
  {
    accessorKey: "invoice_no",
    header: "Invoice No",
  },
  {
    accessorKey: "purchase_date",
    header: "Purchase Date",
    cell: ({ row }) => row.original.purchase_date || "—",
  },
  {
    accessorKey: "total_tool",
    header: "Total Quantity",
    cell: ({ row }) => row.original.total_tool ?? 0,
  },
  {
    accessorKey: "total_purchase_amount",
    header: "Total Amount",
    cell: ({ row }) => `$${Number(row.original.total_purchase_amount || 0).toFixed(2)}`,
  },
  {
    accessorKey: "purchase_status",
    header: "Status",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => {
      const status = row.original.purchase_status || "—";
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
          { label: "Edit", onClick: actions?.onEdit, permission: "edit-purchase" },
          { label: "Delete", onClick: actions?.onDelete, danger: true, passId: true, permission: "delete-purchase"},
        ]}
      />
    ),
  },
];

export default columns;
