import { TableActions } from "@/components/table/TableActions";
import { formatDateTime } from "@/lib/utils";

const resultColumns = (actions) => [
    {
        accessorKey: "employee",
        header: "Employee",
        cell: ({ row }) => {
            const e = row.original.employee;
            if (!e) return "-";
            const name = [e.first_name, e.last_name].filter(Boolean).join(" ");
            return name || e.employee_code || "-";
        },
    },
    {
        accessorKey: "employee.employee_code",
        header: "Code",
        cell: ({ row }) => row.original.employee?.employee_code ?? "-",
    },
    {
        accessorKey: "bonus_setup",
        header: "Bonus Name",
        cell: ({ row }) =>
            row.original.bonus_setup?.bonus_name ??
            row.original.bonus_setup?.bonus_type?.name ??
            "-",
    },
    {
        accessorKey: "start_date",
        header: "Start Date",
        cell: ({ row }) => row.original.start_date ?? "-",
    },
    {
        accessorKey: "end_date",
        header: "End Date",
        cell: ({ row }) => row.original.end_date ?? "-",
    },
    {
        accessorKey: "days_worked",
        header: "Days Worked",
        thClass: "!text-center",
        tdClass: "!text-center",
        cell: ({ row }) => row.original.days_worked ?? "-",
    },
    {
        accessorKey: "basic_salary",
        header: "Basic Salary",
        thClass: "!text-right",
        tdClass: "!text-right",
        cell: ({ row }) =>
            Number(row.original.basic_salary ?? 0).toLocaleString(),
    },
    {
        accessorKey: "bonus_amount",
        header: "Bonus Amount",
        thClass: "!text-right",
        tdClass: "!text-right",
        cell: ({ row }) =>
            Number(row.original.bonus_amount ?? 0).toLocaleString(),
    },
    {
        accessorKey: "created_at",
        header: "Date / Time",
        cell: ({ row }) => {
            const dt = row.original.created_at;
            if (!dt) return "-";
            return formatDateTime(dt);
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
                    {
                        label: "Delete",
                        onClick: actions?.onDelete,
                        danger: true,
                        passId: true,
                        permission: "delete-bonus-setup",
                    },
                ]}
            />
        ),
    },
];

export default resultColumns;
