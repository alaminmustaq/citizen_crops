import { TableActions } from "@/components/table/TableActions";
import { permission } from "process";

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

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : "—");
const fmtAddr = (a) =>
  [a?.line_1, a?.city, a?.state, a?.country].filter(Boolean).join(", ") || "—";

let columns = (actions) => [
  // Name
  {
    id: "display_name",
    header: "Name",
    cell: ({ row }) => {
      const d = row.original;
      return (
        <div className="flex items-center gap-2 min-w-[180px]">  
            <span className="font-medium">{d?.display_name || "—"}</span>
        </div>
      );
    },
  }, 
  // level
  {
    id: "lavel",
    header: "Level",
    thClass: "!text-center", 
    tdClass: "!text-center",
    cell: ({ row }) => {
      
      const d = row.original; 
      return (
        <div className="flex items-center justify-center gap-2 min-w-[180px]">  
            <span className="font-medium">{d?.level ?? "—"}</span> 
        </div>
      );
    },
  }, 
  // Created at 
  {
    id: "created_at",
    header: "Created At",
    thClass: "!text-center", 
    tdClass: "!text-center",
    cell: ({ row }) => {
      
      const d = row.original;
      return (
        <div className="flex items-center justify-center gap-2 min-w-[180px]">  
            <span className="font-medium">{d?.created_at || "—"}</span> 
        </div>
      );
    },
  }, 

  // Actions
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <TableActions
        data={row.original}
        items={[
          { label: "Manage Permissions", onClick: actions?.onManagePermissions, permission: "manage-settings" },
          { label: "Edit", onClick: actions?.onEdit, permission: "manage-settings" },
          { label: "Delete", onClick: actions?.onDelete, danger: true, passId: true, permission: "manage-settings" }, // needs only ID
        ]}
      />
    ),
  }
  
];

export default columns;
