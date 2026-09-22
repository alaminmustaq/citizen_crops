import { TableActions } from "@/components/table/TableActions";

const bonusSetupColumns = (actions) => [
    {
        accessorKey: "branch.name",
        header: "Branch",
        cell: ({ row }) => row.original.branch?.name ?? "—",
    },
    {
        accessorKey: "department.name",
        header: "Department",
        cell: ({ row }) => row.original.department?.name ?? "—",
    },
    {
        accessorKey: "job_position.title",
        header: "Job Position",
        cell: ({ row }) => row.original.job_position?.title ?? "—",
    },
    {
        accessorKey: "project.name",
        header: "Project",
        cell: ({ row }) => row.original.project?.name ?? "—",
    },
    {
        accessorKey: "min_days",
        header: "Min Days",
        thClass: "!text-center",
        tdClass: "!text-center",
    },
    {
        accessorKey: "max_days",
        header: "Max Days",
        thClass: "!text-center",
        tdClass: "!text-center",
        cell: ({ row }) => row.original.max_days ?? "—",
    },
    {
        accessorKey: "bonus_percentage",
        header: "Bonus %",
        thClass: "!text-center",
        tdClass: "!text-center",
        cell: ({ row }) => `${row.original.bonus_percentage ?? 0}%`,
    },
    {
        accessorKey: "amount",
        header: "Amount",
        thClass: "!text-right",
        tdClass: "!text-right",
        cell: ({ row }) => Number(row.original.amount ?? 0).toLocaleString(),
    },
    {
        accessorKey: "bonus_type.name",
        header: "Bonus Type",
        cell: ({ row }) => row.original.bonus_type?.name ?? "—",
    },
    {
        accessorKey: "bonus_name",
        header: "Bonus Name",
        cell: ({ row }) => row.original.bonus_name ?? "—",
    },
    {
        id: "year_month",
        header: "Year / Month",
        cell: ({ row }) => `${row.original.year} / ${row.original.month}`,
    },
    {
        accessorKey: "status",
        header: "Status",
        thClass: "!text-center",
        tdClass: "!text-center",
        cell: ({ row }) => {
            const status = row.original.status || "—";
            const className =
                status === "active"
                    ? "bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
                    : "bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full";
            return <span className={className}>{status}</span>;
        },
    },
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
                items={[
                    { label: "Edit", onClick: actions?.onEdit, permission: "edit-bonus-setup" },
                    { label: "Delete", onClick: actions?.onDelete, danger: true, passId: true, permission: "delete-bonus-setup" },
                ]}
            />
        ),
    },
];

export default bonusSetupColumns;
