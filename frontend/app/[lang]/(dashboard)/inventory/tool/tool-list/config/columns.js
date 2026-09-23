import { TableActions } from "@/components/table/TableActions";

const columns = (actions) => [
    { accessorKey: "name", header: "Tool Name" },
    { accessorKey: "sku", header: "SKU" },
    {
        accessorKey: "opening_date",
        header: "Opening Date",
        cell: ({ row }) => row.original.opening_date || "—",
    },
    { accessorKey: "category.name", header: "Category" },
    {
        accessorKey: "company_stock.quantity",
        header: "Stock Qty",
        thClass: "!text-center",
        tdClass: "!text-center",
    },
    {
        accessorKey: "minimum_quantity",
        header: "Minimum Qty",
        thClass: "!text-center",
        tdClass: "!text-center",
    },
    {
        accessorKey: "unit_price",
        header: "Unit Price",
        thClass: "!text-center",
        tdClass: "!text-center",
    },
    { accessorKey: "unit.name", header: "Unit of Measure" },

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
                    { label: "Edit", onClick: actions?.onEdit , permission: "edit-tool" },
                    {
                        label: "Delete",
                        onClick: actions?.onDelete,
                        danger: true,
                        passId: true,
                        permission: "delete-tool" 
                    },
                ]}
            />
        ),
    },
];

export default columns;
