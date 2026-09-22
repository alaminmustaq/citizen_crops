import { TableActions } from "@/components/table/TableActions";

const columns = (actions) => [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => row.original.name || "—",
    },
    {
        accessorKey: "transaction_for",
        header: "Transaction For",
        cell: ({ row }) => {
            const transaction_for = row.original.transaction_for || "—";
            const className =
                transaction_for === "active"
                    ? "bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
                    : transaction_for === "inactive"
                    ? "bg-red-100 text-red-700 px-2 py-0.5 rounded-full"
                    : "bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full";
            return <span className={className}>{transaction_for}</span>;
        },
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
                    : status === "inactive"
                    ? "bg-red-100 text-red-700 px-2 py-0.5 rounded-full"
                    : "bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full";
            return <span className={className}>{status}</span>;
        },
    },
    {
        id: "actions",
        enableHiding: false,
        header: "Actions",
        thClass: "!text-center w-[100px] whitespace-nowrap",
        tdClass: "!text-center w-[100px] whitespace-nowrap",
        cell: ({ row }) => (
            <TableActions
                data={row.original}
                label="Actions"
                items={[
                    { label: "Edit", onClick: actions?.onEdit, permission: "edit-payment-type" },
                    {
                        label: "Delete",
                        onClick: actions?.onDelete,
                        danger: true,
                        passId: true,
                        permission: "delete-payment-type"
                    },
                ]}
            />
        ),
    },
];

export default columns;
