import { formatDate } from "@/lib/utils";

const columns = (actions) => [
  {
    accessorKey: "damage_no",
    header: "Damage No",
    cell: ({ row }) => row.original.damage_no || "â€”",
  },
  {
    accessorKey: "damage_date",
    header: "Damage Date",
    cell: ({ row }) => {
      const date = row.original.damage_date;
      return date ? formatDate(date) : "â€”";
    },
  },
  {
    accessorKey: "tool_name",
    header: "Tool",
  },
  {
    accessorKey: "quantity",
    header: "Qty",
    cell: ({ row }) => parseFloat(row.original.quantity).toFixed(2),
  },
  {
    accessorKey: "unit_price",
    header: "Unit Price",
    cell: ({ row }) => parseFloat(row.original.unit_price).toFixed(2),
  },
  {
    accessorKey: "total_value",
    header: "Total Value",
    cell: ({ row }) =>
      row.original.total_value
        ? parseFloat(row.original.total_value).toFixed(2)
        : "0.00",
  },
  {
    accessorKey: "warehouse_name",
    header: "Warehouse",
    cell: ({ row }) => row.original.warehouse_name || "â€”",
  },
];

export default columns;
