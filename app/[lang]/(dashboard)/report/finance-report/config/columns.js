import { format } from "date-fns";

const safe = (v, fallback = "—") =>
    v !== null && v !== undefined ? v : fallback;

const columns = () => [
    {
        id: "financial_type",
        header: "Type",
        accessorKey: "financial_type",
        cell: ({ getValue }) => safe(getValue()),
    },

    {
        id: "project",
        header: "Project",
        accessorKey: "project_id",
        cell: ({ getValue }) => {
            const v = getValue();
            return v?.name ?? "—";
        },
    },

    {
        id: "transaction_type",
        header: "Transaction",
        accessorKey: "transaction_type",
        cell: ({ getValue }) => safe(getValue()),
    },

    {
        id: "transaction_date",
        header: "Date",
        accessorKey: "transaction_date",
        cell: ({ getValue }) => {
            const v = getValue();
            return v ? format(new Date(v), "yyyy-MM-dd") : "—";
        },
    },

    {
        id: "expected_rec_pay_date",
        header: "Expected Rec/Pay Date",
        accessorKey: "expected_rec_pay_date",
        cell: ({ getValue }) => {
            const v = getValue();
            return v ? format(new Date(v), "yyyy-MM-dd") : "—";
        },
    },

    {
        id: "receive_payment_date",
        header: "Receive/Payment Date",
        accessorKey: "receive_payment_date",
        cell: ({ getValue }) => {
            const v = getValue();
            return v
                ? format(new Date(v), "yyyy-MM-dd")
                : "—";
        },
    },

    {
        id: "transaction_status",
        header: "Status",
        accessorKey: "transaction_status",
        cell: ({ getValue }) => safe(getValue()),
    },

    {
        id: "total_amount",
        header: "Total Amount",
        accessorKey: "total_amount",
        cell: ({ getValue }) => {
            const v = getValue();
            return v != null
                ? Number(v).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                  })
                : "0.00";
        },
    },

    // {
    //     id: "details",
    //     header: "Details",
    //     accessorKey: "details",
    //     cell: ({ row }) => {
    //         console.log(row.original);
            
    //         const details = row.original.details || [];

    //         if (!details.length) return "0 items";

    //         return (
    //             <div className="text-xs space-y-1">
    //                 {details.map((d, i) => (
    //                     <div key={i}>
    //                         {d.rec_payment_type_id?.name ?? "—"} —{" "}
    //                         {Number(d.amount ?? 0).toFixed(2)}
    //                     </div>
    //                 ))}
    //             </div>
    //         );
    //     },
    // },
];

export default columns;
