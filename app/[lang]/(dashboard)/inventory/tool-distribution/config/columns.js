import { TableActions } from "@/components/table/TableActions";
import { formatDate } from "@/lib/utils";

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
        accessorKey: "project.name",
        header: "Project",
        cell: ({ row }) => {
            const project = row.original.project;
            return project?.name || "—";
        },
    },
    {
        accessorKey: "distribution_date",
        header: "Distribution Date",
        cell: ({ row }) => {
            const date = row.original.distribution_date;
            return date ? formatDate(date) : "—";
        },
    },
    {
        accessorKey: "return_date",
        header: "Return Date",
        cell: ({ row }) => {
            const date = row.original.return_date;
            return date ? formatDate(date) : "—";
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

            const prepare = returnData
                ? []
                : [
                      {
                          label: "Edit",
                          onClick: actions?.onEdit,
                          permission: "edit-tool-distribution",
                      },
                  ];

            const actionItems = [
                ...prepare,
                {
                    label: "Return Tool",
                    onClick: actions?.onReturn,
                    permission: "return-tool",
                },
            ];

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
