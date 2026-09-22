import { TableActions } from "@/components/table/TableActions";

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
    accessorKey: "allowance_type",
    header: "Allowance",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => row.original.allowance_type?.name || "-",
  },
  {
    accessorKey: "type",
    header: "Type",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => {
      const type = row.original.allowance_type?.type;
      const styles = {
        earning: "bg-green-100 text-green-700",
        deduction: "bg-red-100 text-red-700",
      };
      return (
        <span className={`px-2 py-0.5 rounded-full ${styles[type]}`}>
          {type}
        </span>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => `€ ${parseFloat(row.original.amount).toFixed(2)}`,
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
    accessorKey: "job_position",
    header: "Job Position",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => row.original.job_position?.title || "-",
  },
  {
    accessorKey: "status",
    header: "Status",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => {
      const rawStatus = row.original.status;

      // Normalize value
      const status =
        rawStatus === 1 || rawStatus === true || rawStatus === "1"
          ? "active"
          : "inactive";

      const styles = {
        active: "bg-green-100 text-green-700",
        inactive: "bg-gray-200 text-gray-700",
      };

      return (
        <span className={`px-2 py-0.5 rounded-full ${styles[status]}`}>
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
            { label: "View", onClick: actions?.onView, permission: "view-earning-deduction" },
            { label: "Edit", onClick: actions?.onEdit, permission: "edit-earning-deduction" },
            { label: "Delete", onClick: actions?.onDelete, danger: true, passId: true, permission: "delete-earning-deduction" },
          ]}
        />
      );
    },
  },
];

export default leaveApplicationColumns;
