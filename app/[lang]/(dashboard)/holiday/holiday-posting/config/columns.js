import { TableActions } from "@/components/table/TableActions";
import { formatDate } from "@/lib/utils";

const leaveApplicationColumns = (actions) => [
  {
    accessorKey: "employee",
    header: "Employee",
    thClass: "!text-left",
    tdClass: "!text-left",
    cell: ({ row }) => {
      const emp = row.original.employee;
      return emp ? `${emp.first_name} ${emp.last_name ?? ""}` : "-";
    },
  },
  {
    accessorKey: "branch",
    header: "Branch",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => row.original.branch?.name || "-",
  },
  {
    accessorKey: "department",
    header: "Department",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => row.original.department?.name || "-",
  },
  {
    accessorKey: "project",
    header: "Project",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => row.original.project?.name || "-",
  },
  {
    accessorKey: "holiday_type",
    header: "Holiday Type",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => row.original.holiday_type?.name || "-",
  },
  {
    accessorKey: "reason",
    header: "Reason",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => row.original.other_reason || row.original.reason?.name || "-",
  },
  {
    accessorKey: "start_date",
    header: "From",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => {
      const date = row.original.start_date;
      return date ? formatDate(date) : "—";
    },
  },
  {
    accessorKey: "end_date",
    header: "To",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => {
      const date = row.original.end_date;
      return date ? formatDate(date) : "—";
    },
  },
  {
    accessorKey: "days",
    header: "Days",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => {
      const start = row.original.start_date ? new Date(row.original.start_date) : null;
      const end = row.original.end_date ? new Date(row.original.end_date) : null;
      if (start && end) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      }
      return "-";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => {
      const status = row.original.status;
      const colors = {
        approved: "bg-green-100 text-green-700",
        rejected: "bg-red-100 text-red-700",
      };
      return (
        <span className={`px-2 py-0.5 rounded-full ${colors[status]}`}>
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "creator",
    header: "Created By",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => row.original.creator?.username || "-",
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
            { label: "View", onClick: actions?.onView, permission: "view-holiday" },
            { label: "Edit", onClick: actions?.onEdit, permission: "edit-holiday" },
            { label: "Delete", onClick: actions?.onDelete, danger: true, passId: true, permission: "delete-holiday" },
          ]}
        />
      );
    },
  },
];

export default leaveApplicationColumns;
