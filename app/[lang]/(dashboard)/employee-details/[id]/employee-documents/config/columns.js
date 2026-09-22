const employeeDocumentColumns = () => [
    {
        accessorKey: "sl_no",
        header: "SL No.",
        thClass: "!text-center",
        tdClass: "!text-center",
        cell: ({ row, table }) => row.index + 1, // row.index is zero-based
    },
    {
        accessorKey: "title",
        header: "Document Title",
        cell: ({ row }) => row.original.title || "—",
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => row.original.type?.name || "—",
    },
    {
        accessorKey: "expiry_date",
        header: "Expiry Date",
        thClass: "!text-center",
        tdClass: "!text-center",
        cell: ({ row }) => {
            const expiryDate = row.original.expiry_date;
            if (!expiryDate) return "—";

            const isExpired = new Date(expiryDate) < new Date();
            return (
                <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                        isExpired
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                    }`}
                >
                    {expiryDate}
                </span>
            );
        },
    },
    {
        accessorKey: "expiry_warning",
        header: "Warning (Days)",
        thClass: "!text-center",
        tdClass: "!text-center",
        cell: ({ row }) => row.original.expiry_warning ?? "—",
    },
    {
        accessorKey: "file_path",
        header: "File",
        thClass: "!text-center",
        tdClass: "!text-center",
        cell: ({ row }) => {
            const fileUrl = row.original.file_url || row.original.file_path;
            const name = row.original.file_name || "Open File";

            return fileUrl ? (
                <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary"
                >
                    {name}
                </a>
            ) : (
                "—"
            );
        },
    },
];

export default employeeDocumentColumns;
