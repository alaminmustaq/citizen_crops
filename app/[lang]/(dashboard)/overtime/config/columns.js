import { TableActions } from "@/components/table/TableActions";

const overtimeColumns = (actions) => [
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
        accessorKey: "amount",
        header: "Amount",
        thClass: "!text-center",
        tdClass: "!text-center",
        cell: ({ row }) => row.original.amount || "-",
    },
    {
        accessorKey: "amount_type",
        header: "Type",
        thClass: "!text-center capitalize",
        tdClass: "!text-center capitalize",
        cell: ({ row }) => row.original.amount_type || "-",
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
        accessorKey: "status",
        header: "Status",
        thClass: "!text-center",
        tdClass: "!text-center",
        cell: ({ row }) => {
            const status = row.original.status;
            const isActive = status == 1 || status === "active";
            return (
                <span
                    className={`px-2 py-0.5 rounded-full ${isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}
                >
                    {isActive ? "Active" : "Inactive"}
                </span>
            );
        },
    },
    {
        id: "actions",
        header: " ",
        thClass: "!text-center w-[70px]",
        tdClass: "!text-center w-[70px]",
        cell: ({ row }) => (
            <TableActions
                data={row.original}
                label="Actions"
                items={[
                    {
                        label: "View",
                        onClick: actions?.onView,
                        permission: "view-overtime",
                    },
                    {
                        label: "Edit",
                        onClick: actions?.onEdit,
                        permission: "edit-overtime",
                    },
                    {
                        label: "Delete",
                        onClick: actions?.onDelete,
                        danger: true,
                        passId: true,
                        permission: "delete-overtime",
                    },
                ]}
            />
        ),
    },
];

export default overtimeColumns;
