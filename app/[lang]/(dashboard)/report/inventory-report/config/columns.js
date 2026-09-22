const safe = (v, fallback = "—") => (v ?? v === 0 ? v : fallback);

const columns = (actions) => [
  {
    accessorKey: "name",
    header: "Tool Name",
    cell: ({ row }) => safe(row.original?.name),
  },

  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => safe(row.original?.sku),
  },

  {
    accessorKey: "opening_date",
    header: "Opening Date",
    cell: ({ row }) => safe(row.original?.opening_date),
  },

  {
    id: "category",
    header: "Category",
    cell: ({ row }) => safe(row.original?.category?.name),
  },

  {
    accessorKey: "total_quantity",
    header: "Stock Qty",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => safe(row.original?.total_quantity),
  },

  {
    accessorKey: "minimum_quantity",
    header: "Minimum Qty",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => safe(row.original?.minimum_quantity),
  },

  {
    accessorKey: "unit_price",
    header: "Unit Price",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => safe(row.original?.unit_price),
  },

  {
    id: "unit",
    header: "Unit of Measure",
    cell: ({ row }) => safe(row.original?.unit?.name),
  },

  {
    accessorKey: "status",
    header: "Status",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => {
      const status = row.original?.status;

      if (!status) return "—";

      const className =
        status === "active"
          ? "bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs"
          : "bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs";

      return <span className={className}>{status}</span>;
    },
  },
];

export default columns;
