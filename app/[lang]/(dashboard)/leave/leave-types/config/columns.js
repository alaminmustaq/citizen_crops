import { TableActions } from "@/components/table/TableActions";

const leaveTypeColumns = (actions) => [
  {
    accessorKey: "name",
    header: "Leave Type",
  },
  {
    accessorKey: "days_per_year",
    header: "Allowed Days", 
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
    accessorKey: "is_paid",
    header: "Type",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => {
      const status = row.original.is_paid || "—";
      const className =
        status === "paid"
          ? "bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
          : "bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full";
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
          { label: "Edit", onClick: actions?.onEdit, permission: "edit-leave-type" },
          { label: "Delete", onClick: actions?.onDelete, danger: true, passId: true, permission: "delete-leave-type" },
        ]}
      />
    ),
  },
];

export default leaveTypeColumns;
