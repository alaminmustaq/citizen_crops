// app/config/financial-columns.js
const columnsFinancial = () => [
  {
    accessorKey: "rec_payment_type_name",
    header: "Payment Type",
    cell: ({ row }) => (
      <span className="font-medium text-default-800">
        {row.original.rec_payment_type_name || "—"}
      </span>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => row.original.date || "—",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="truncate max-w-[200px] block text-default-600">
        {row.original.description || "—"}
      </span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount (€)",
    thClass: "!text-right",
    tdClass: "!text-right",
    cell: ({ row }) => (
      <span className="font-medium text-green-600">
        €{parseFloat(row.original.amount || 0).toFixed(2)}
      </span>
    ),
  },
];

export default columnsFinancial;
