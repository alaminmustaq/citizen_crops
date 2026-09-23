import { TableActions } from "@/components/table/TableActions"; 

const safe = (v, fallback = "—") => (v ?? v === 0 ? v : fallback);

let columns = (actions) => [
  // Core
  { accessorKey: "name", header: "Name" },
  { accessorKey: "code", header: "Code", thClass: "!text-center", 
    tdClass: "!text-center",},

  // Company
  // {
  //   id: "company",
  //   header: "Company",
  //   thClass: "!text-center", 
  //   tdClass: "!text-center",
  //   cell: ({ row }) => {  
  //     return row.original?.company?.name ?? "-";
  //   },
  // },
  // Branch
  // {
  //   id: "branch",
  //   header: "Branch",
  //   thClass: "!text-center", 
  //   tdClass: "!text-center",
  //   cell: ({ row }) => {  
  //     return row.original?.branch?.name ?? "-";
  //   },
  // },
  // Manager

  // parent_department
  // {
  //   id: "parent_department",
  //   header: "Parent department",
  //   thClass: "!text-center", 
  //   tdClass: "!text-center",
  //   cell: ({ row }) => {
  //     const parent = row.original?.parent_department;
  //     return parent ? `${parent.name} (${parent.code})` : "-";
  //   },
  // },
  
  {
    id: "status",
    header: "Status",
    thClass: "!text-center", 
    tdClass: "!text-center",
    cell: ({ row }) =>
      safe(row.original?.status ?? row.original?.system_info?.status),
  },

  // {
  //   id: "established",
  //   header: "Established",
  //   thClass: "!text-center", 
  //   tdClass: "!text-center",
  //   cell: ({ row }) => safe(row.original?.system_info?.established_date),
  // },

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
                { label: "Edit", onClick: actions?.onEdit, permission: "edit-department"},
                { label: "Delete", onClick: actions?.onDelete, danger: true, passId: true, permission: "delete-department"}, // needs only ID
            ]}
        />
    ),
  },
];

export default columns;