import { TableActions } from "@/components/table/TableActions";

const scheduleSetupColumns = (actions) => [
  {
    accessorKey: "employee_type",
    header: "Employee type",
    thClass: "!text-left",
    tdClass: "!text-left",
    cell: ({ row }) => row.original.employee_type?.name || "—",
  },
  {
    accessorKey: "shift",
    header: "Shift",
    thClass: "!text-left",
    tdClass: "!text-left",
    cell: ({ row }) => row.original.shift?.name || "—",
  }, 
  {
    accessorKey: "branch",
    header: "Branch",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => row.original.branch?.name || "—",
  },
  {
    accessorKey: "department",
    header: "Department",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => row.original.department?.name || "—",
  },
  {
    accessorKey: "project",
    header: "Project",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => row.original.project?.name || "—",
  },
  {
    accessorKey: "overtime_status",
    header: "Overtime",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => {
      const enabled = row.original.overtime_status;
      return (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            enabled
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {enabled ? "Enabled" : "Disabled"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: " ",
    thClass: "!text-center w-[70px]",
    tdClass: "!text-center w-[70px]",
    cell: ({ row }) => {
      const type = row.original.type;
      if (type === "grouped") return <span className="text-gray-400">—</span>;

      return (
        <TableActions
          data={row.original}
          label="Actions"
          items={[
            { label: "View", onClick: actions?.onView, permission: "view-schedule" },
            { label: "Edit", onClick: actions?.onEdit, permission: "edit-schedule" },
            { label: "Delete", onClick: actions?.onDelete, danger: true, passId: true, permission: "delete-schedule" },
          ]}
        />
      );
    },
  },
];

export default scheduleSetupColumns;
