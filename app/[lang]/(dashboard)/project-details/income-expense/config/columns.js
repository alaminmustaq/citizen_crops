const columnsTransactions = () => [

  {
    accessorKey: "transaction_type",
    header: "Transaction Type",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => {
      const isIncome = row.original.transaction_type === "Income";
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
      <span
        className={`font-medium ${
          row.original.transaction_type === "Income"
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        €{row.original.amount || 0}
      </span>
    ),
  },

];

export default columnsTransactions;
