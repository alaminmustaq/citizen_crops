import { formatDate } from "@/lib/utils";

const columns = (actions) => [
    {
        accessorKey: "damage_no",
        header: "Damage No",
        cell: ({ row }) => {
            const damageNo = row.original.damage_no;
            return damageNo || "â€”";
        },
    },
    {
        accessorKey: "date",
        header: "Damage Date",
        cell: ({ row }) => {
            const date = row.original.date;
            return date ? formatDate(date) : "â€”";
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
                : "â€”";
        },
    },
];

export default columns;
