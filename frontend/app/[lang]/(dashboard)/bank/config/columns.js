import { TableActions } from "@/components/table/TableActions";

const columns = (actions) => [
  {
    accessorKey: "bank_name",
    header: "Bank Name",
    cell: ({ row }) => row.original.bank_name || "—",
  },
  {
    
    header: "No of Branches",
      cell: ({ row }) => {
    const branches = row.original.branches || [];
    return branches.length;
  },
    thClass: "!text-center",
    tdClass: "!text-center",
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
          { label: "Edit", onClick: actions?.onEdit , permission: "edit-bank"},
          { label: "Delete", onClick: actions?.onDelete, danger: true, passId: true, permission: "delete-bank" },
        ]}
      />
    ),
  },
];

export default columns;
