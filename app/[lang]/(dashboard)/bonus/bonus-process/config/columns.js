const bonusProcessColumns = () => [
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
];

export default bonusProcessColumns;
