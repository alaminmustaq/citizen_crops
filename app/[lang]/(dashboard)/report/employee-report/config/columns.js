const columns = () => [
    {
            id: "name",
            header: "Name",
            cell: ({ row }) => {
                const p = row.original?.personal_info || {};
                return (
                    p.display_name ||
                    p.preferred_name ||
                    [p.first_name, p.last_name].filter(Boolean).join(" ") ||
                    "—"
                );
            },
        },
        {
            accessorKey: "employee_code",
            header: "Employee Id",
            thClass: "!text-center",
            tdClass: "!text-center",
            cell: ({ row }) => row.original?.employee_code || "—",
        },
        {
            accessorKey: "badge_number",
            header: "Badge",
            thClass: "!text-center",
            tdClass: "!text-center",
            cell: ({ row }) => row.original?.badge_number || "—",
        },
        {
            id: "branch",
            header: "Branch",
            thClass: "!text-center",
            tdClass: "!text-center",
            cell: ({ row }) => row.original?.branch?.name || "—",
        },
        {
            id: "department",
            header: "Department",
            thClass: "!text-center",
            tdClass: "!text-center",
            cell: ({ row }) => row.original?.department?.name || "—",
        },
        {
            id: "role",
            header: "Role",
            thClass: "!text-center",
            tdClass: "!text-center",
            cell: ({ row }) => {
                const roles = row.original?.user?.roles || [];
                if (!roles.length) return "—";

                // Prefer display_name, fallback to name
                return roles.map((r) => r.display_name || r.name).join(", ");
            },
        },

        {
            id: "job_position_id",
            header: "Position",
            thClass: "!text-center",
            tdClass: "!text-center",
            cell: ({ row }) => row.original?.job_position?.title || "—",
        },
        {
            accessorKey: "contact_info.work_email",
            header: "Work Email",
            thClass: "!text-center",
            tdClass: "!text-center",
            cell: ({ row }) => row.original?.contact_info?.work_email || "—",
        },
        {
            accessorKey: "contact_info.primary_phone",
            header: "Phone",
            thClass: "!text-center",
            tdClass: "!text-center",
            cell: ({ row }) => row.original?.contact_info?.primary_phone || "—",
        },
        {
            accessorKey: "employment_info.employment_status",
            header: "Status",
            thClass: "!text-center",
            tdClass: "!text-center",
            cell: ({ row }) =>
                row.original?.employment_info?.employment_status || "—",
        }
];

export default columns;
