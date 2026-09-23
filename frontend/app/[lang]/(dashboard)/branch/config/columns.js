import { TableActions } from "@/components/table/TableActions";
const Pill = ({ children, className = "" }) => (
  <span
    className={[
      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
      className,
    ].join(" ")}
  >
    {children}
  </span>
);

const fmtTimeRange = (s, e) => (s || e ? `${s || "—"} – ${e || "—"}` : "—");

let columns = (actions) => [
  // Basic
  { accessorKey: "name", header: "Name" },
  { accessorKey: "code", header: "Code", thClass: "!text-center", tdClass: "!text-center"},

  // Type / Status / HQ
  {
    id: "type_status",
    header: "Type / Status",
    thClass: "!text-center", 
    tdClass: "!text-center",
    cell: ({ row }) => {
      const d = row.original;
      const type = d?.type || "—";
      const status = d?.status || "—";
      const isHQ = !!d?.is_headquarters;

      return (
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Pill className="bg-slate-100 text-slate-700">{type}</Pill>
          <Pill
            className={
              status === "active"
                ? "bg-green-100 text-green-700"
                : status === "inactive"
                ? "bg-gray-100 text-gray-700"
                : "bg-amber-100 text-amber-700"
            }
          >
            {status}
          </Pill>
          {isHQ ? <Pill className="bg-blue-100 text-blue-700">HQ</Pill> : null}
          
        </div>
      );
    },
  },


  // Contact
  // {
  //   id: "email",
  //   header: "Email",
  //   thClass: "!text-center", 
  //   tdClass: "!text-center",
  //   cell: ({ row }) => (
  //     <div className="lowercase whitespace-nowrap">
  //       {row.original?.email || "—"}
  //     </div>
  //   ),
  // },
  // {
  //   id: "phone",
  //   header: "Phone",
  //   thClass: "!text-center", 
  //   tdClass: "!text-center",
  //   cell: ({ row }) => row.original?.phone || "—",
  // },

  // Hierarchy
  // {
  //   id: "hierarchy",
  //   header: "Hierarchy",
  //   thClass: "!text-center", 
  //   tdClass: "!text-center",
  //   cell: ({ row }) => {
  //     const h = row.original?.hierarchy_info;
  //     const lvl = h?.hierarchy_level ?? row.original?.level ?? "—";
  //     const path = h?.hierarchy_path ?? row.original?.hierarchy_path ?? "";
  //     return (
  //       <div className="flex flex-col">
  //         <span>Level: {lvl}</span>
  //         <span className="text-xs text-muted-foreground">
  //           {path ? `Path: ${path}` : ""}
  //         </span>
  //       </div>
  //     );
  //   },
  // },

  // Address (compact)
  // {
  //   id: "opening_date",
  //   header: "Opening Day",
  //   thClass: "!text-center", 
  //   tdClass: "!text-center",
  //   cell: ({ row }) => {
  //     const d = row.original;

  //     return d.operating_days ?? "—";
  //   },
  // },

  // Ops hours & days
  // {
  //   id: "ops",
  //   header: "Operating",
  //   thClass: "!text-center", 
  //   tdClass: "!text-center",
  //   cell: ({ row }) => {
  //     const d = row.original;
  //     const hours = fmtTimeRange(
  //       d?.operating_hours_start,
  //       d?.operating_hours_end
  //     );
  //     const days = d?.operating_days || "—";
  //     return (
  //       <div className="flex flex-col">
  //         <span>{hours}</span>
  //         <span className="text-xs text-muted-foreground">{days}</span>
  //       </div>
  //     );
  //   },
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
                { label: "Edit", onClick: actions?.onEdit , permission: "edit-branch" },
                { label: "Delete", onClick: actions?.onDelete, danger: true, passId: true, permission: "delete-branch" }, // needs only ID
            ]}
        />
    ),
  },
];

export default columns;