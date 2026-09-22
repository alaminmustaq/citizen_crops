import { TableActions } from "@/components/table/TableActions";

const advanceColumns = (actions) => [
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
        cell: ({ row }) => {
            const amt = row.original.amount;
            return amt != null ? `${parseFloat(amt).toFixed(2)}` : "-";
        },
    },
    {
        accessorKey: "advance_date",
        header: "Advance Date",
        thClass: "!text-center",
        tdClass: "!text-center",
        cell: ({ row }) => row.original.advance_date || "-",
    },
    {
        accessorKey: "month",
        header: "Month",
        thClass: "!text-center",
        tdClass: "!text-center",
        cell: ({ row }) => row.original.month || "-",
    },
    {
        accessorKey: "year",
        header: "Year",
        thClass: "!text-center",
        tdClass: "!text-center",
        cell: ({ row }) => row.original.year || "-",
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
            const styles = {
                active: "bg-green-100 text-green-700",
                inactive: "bg-gray-200 text-gray-700",
            };
            return (
                <span
                    className={`px-2 py-0.5 rounded-full ${styles[status] || ""}`}
                >
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
        accessorKey: "updater",
        header: "Updated By",
        thClass: "!text-center",
        tdClass: "!text-center",
        cell: ({ row }) => row.original.updater?.username || "-",
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
                        permission: "view-advance",
                    },
                    {
                        label: "Edit",
                        onClick: actions?.onEdit,
                        permission: "edit-advance",
                    },
                    {
                        label: "Delete",
                        onClick: actions?.onDelete,
                        danger: true,
                        passId: true,
                        permission: "delete-advance",
                    },
                ]}
            />
        ),
    },
];

export default advanceColumns;
