import { TableActions } from "@/components/table/TableActions";
const safe = (v, fallback = "—") => (v ?? v === 0 ? v : fallback);

const clientColumns = (actions) => [
  { accessorKey: "name", header: "Client Name" },
  { accessorKey: "email", header: "Email" ,thClass: "!text-center", 
    tdClass: "!text-center",},
  { accessorKey: "phone", header: "Phone" ,thClass: "!text-center", 
    tdClass: "!text-center",},
  { accessorKey: "client_type", header: "Client Type" ,thClass: "!text-center", 
    tdClass: "!text-center",},

  {
    id: "status",
    header: "Status",
    thClass: "!text-center", 
    tdClass: "!text-center",
    cell: ({ row }) => safe(row.original?.status),
  },

  // Actions 
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
        // alignmentClass is omitted here, so it defaults to "flex justify-center"
        items={[
          { label: "Edit", onClick: actions?.onEdit,  permission: "edit-client"}, // needs full data
          { label: "Delete", onClick: actions?.onDelete, danger: true, passId: true, permission: "delete-client"}, // needs only ID
        ]}
      />
    ),
  }

];

export default clientColumns;