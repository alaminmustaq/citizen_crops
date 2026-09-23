import { TableActions } from "@/components/table/TableActions";

const columns = (actions) => [
    {
        accessorKey: "damage_no",
        header: "Damage No",
        cell: ({ row }) => {
            const damageNo = row.original.damage_no;
            return damageNo || "—";
        },
    },
    {
        accessorKey: "date",
        header: "Damage Date",
        cell: ({ row }) => {
            const date = row.original.date;
            return date ? new Date(date).toLocaleDateString() : "—";
        },
    },

    {
        accessorKey: "total_value",
        header: "Total Value",
        cell: ({ row }) => {
            const totalValue = row.original.total_value;
            return totalValue
                ? `${parseFloat(totalValue).toFixed(2)}`
                : "$0.00";
        },
    },
    {
        accessorKey: "damage_details",
        header: "Tools Count",
        cell: ({ row }) => {
            const details = row.original.damage_details;
            return details ? details.length : 0;
        },
    },
    {
        accessorKey: "note",
        header: "Note",
        cell: ({ row }) => {
            const note = row.original.note;
            return note
                ? note.length > 50
                    ? note.substring(0, 50) + "..."
                    : note
                : "—";
        },
    },

    {
        id: "actions",
        enableHiding: false,
        header: " ",
        thClass: "!text-center w-[120px] whitespace-nowrap",
        tdClass: "!text-center w-[120px] whitespace-nowrap",
        cell: ({ row }) => {
            return (
                <TableActions
                    data={row.original}
                    label="Actions"
                    items={[
                        {
                            label: "Edit",
                            onClick: actions?.onEdit,
                            permission: "edit-tool-damage",
                        },
                        {
                            label: "Delete",
                            onClick: actions?.onDelete,
                            danger: true,
                            passId: true,
                            permission: "delete-tool-damage",
                        },
                    ]}
                />
            );
        },
    },
];

export default columns;
