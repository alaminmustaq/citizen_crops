import { TableActions } from "@/components/table/TableActions";

const columns = (actions) => [
    {
        accessorKey: "employee.name",
        header: "Employee",
        cell: ({ row }) => {
            const employee = row.original.employee;

            return employee
                ? [
                      employee?.personal_info?.first_name,
                      employee?.personal_info?.last_name,
                  ]
                      .filter(Boolean)
                      .join(" ") +
                      (employee?.contact_info?.work_email
                          ? ` (${employee.contact_info.work_email})`
                          : "")
                : "—";
        },
    },
    {
        accessorKey: "distribution_date",
        header: "Distribution Date",
        cell: ({ row }) => {
            const date = row.original.distribution_date;
            return date ? new Date(date).toLocaleDateString() : "—";
        },
    },
    {
        accessorKey: "return_date",
        header: "Return Date",
        cell: ({ row }) => {
            const date = row.original.return_date;
            return date ? new Date(date).toLocaleDateString() : "—";
        },
    },

    {
        accessorKey: "status",
        header: "Status",
        thClass: "!text-center",
        tdClass: "!text-center",
        cell: ({ row }) => {
            const status = row.original.status || "distributed";
            const className =
                status === "returned"
                    ? "bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
                    : status === "distributed"
                    ? "bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
                    : "bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full";
            return <span className={className}>{status}</span>;
        },
    },

    {
        id: "actions",
        enableHiding: false,
        header: " ",
        thClass: "!text-center w-[120px] whitespace-nowrap",
        tdClass: "!text-center w-[120px] whitespace-nowrap",
        cell: ({ row }) => {
            const returnData = row.original.return_date;

            // ✅ If tool is already returned, hide both Edit and Delete
            const prepare = returnData
                ? [] // hide Edit when returned
                : [
                      {
                          label: "Edit",
                          onClick: actions?.onEdit,
                          permission: "edit-tool-distribution",
                      },
                  ];

            // ✅ Build actions list dynamically
            const actionItems = [
                ...prepare,
                {
                    label: "Return Tool",
                    onClick: actions?.onReturn,
                    permission: "return-tool",
                },
            ];

            // ✅ Only show Delete if not returned
            if (!returnData) {
                actionItems.push({
                    label: "Delete",
                    onClick: actions?.onDelete,
                    danger: true,
                    passId: true,
                    permission: "delete-tool-distribution",
                });
            }

            return (
                <TableActions
                    data={row.original}
                    label="Actions"
                    items={actionItems}
                />
            );
        },
    },
];

export default columns;
