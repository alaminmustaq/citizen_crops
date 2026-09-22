import { TableActions } from "@/components/table/TableActions";

const punishmentColumns = (actions) => [
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
        accessorKey: "punishment_type",
        header: "Punishment Type",
        thClass: "!text-center",
        tdClass: "!text-center",
        cell: ({ row }) => row.original.punishment_type?.name || "-",
    },
    {
        accessorKey: "amount_type",
        header: "Type",
        thClass: "!text-center",
        tdClass: "!text-center",
        cell: ({ row }) => {
            const type = row.original.amount_type;
            const styles = {
                fixed: "bg-blue-100 text-blue-700",
                basic: "bg-yellow-100 text-yellow-700",
                gross: "bg-purple-100 text-purple-700",
            };
            return (
                <span
                    className={`px-2 py-0.5 rounded-full ${styles[type] || ""}`}
                >
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
        cell: ({ row }) => {
            const amt = row.original.amount;
            return amt != null ? `${parseFloat(amt).toFixed(2)}` : "-";
        },
    },
    {
        accessorKey: "no_of_day",
        header: "No. of Days",
        thClass: "!text-center",
        tdClass: "!text-center",
        cell: ({ row }) => row.original.no_of_day ?? "-",
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
        accessorKey: "effective_date",
        header: "Effective Date",
        thClass: "!text-center",
        tdClass: "!text-center",
        cell: ({ row }) => row.original.effective_date || "-",
    },
    {
        accessorKey: "punishment_month",
        header: "Punishment Month",
        thClass: "!text-center",
        tdClass: "!text-center",
        cell: ({ row }) => row.original.punishment_month || "-",
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
        cell: ({ row }) => {
            console.log(row.original);

            return row.original.creator?.username || "-";
        },
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
                        permission: "view-punishment",
                    },
                    {
                        label: "Edit",
                        onClick: actions?.onEdit,
                        permission: "edit-punishment",
                    },
                    {
                        label: "Delete",
                        onClick: actions?.onDelete,
                        danger: true,
                        passId: true,
                        permission: "delete-punishment",
                    },
                ]}
            />
        ),
    },
];

export default punishmentColumns;
