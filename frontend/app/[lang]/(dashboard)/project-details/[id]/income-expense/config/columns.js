const columnsTransactions = () => [
  {
    accessorKey: "financial_type",
    header: "Transaction Type",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => {
      const isIncome = row.original.financial_type === "income";
      const badgeClass = isIncome
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700";
      return (
        <span
          className={`${badgeClass} text-xs font-medium px-2 py-0.5 rounded-full inline-block`}
        >
          {isIncome ? "Income" : "Expense"}
        </span>
      );
    },
  },
  {
    accessorKey: "transaction_date",
    header: "Date",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => row.original.transaction_date || "—",
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
    accessorKey: "total_amount",
    header: "Amount (€)",
    thClass: "!text-right",
    tdClass: "!text-right",
    cell: ({ row }) => (
      <span
        className={`font-medium ${
          row.original.financial_type === "income"
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        €{row.original.total_amount || 0}
      </span>
    ),
  },
];


export default columnsTransactions;
