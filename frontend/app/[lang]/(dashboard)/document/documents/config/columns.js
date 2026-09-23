import { TableActions } from "@/components/table/TableActions";

const columns = (actions) => [
    {
        id: "title",
        header: "Title",
        accessorKey: "title",
    },

    {
        id: "employee",
        header: "Employee",
        thClass: "!text-center", 
        tdClass: "!text-center",
        cell: ({ row }) => {
            const employee = row.original.employee;
            return employee
                ? `${employee.first_name} ${employee.last_name}`
                : "N/A";
        },
    },
    {
        id: "client",
        header: "Client",
        thClass: "!text-center", 
        tdClass: "!text-center",
        cell: ({ row }) => { 
            const client = row?.original?.client ? row?.original?.client?.name + " (" + row?.original?.client?.email + ")" : "N/A";
            return client || "N/A";
        },
    },
    {
        id: "project",
        header: "Project",
        thClass: "!text-center", 
        tdClass: "!text-center",
        cell: ({ row }) => { 
            const project = row?.original?.project?.name;
            return project || "N/A";
        },
    },

    {
        id: "created_at",
        header: "Created",
        thClass: "!text-center", 
        tdClass: "!text-center",
        cell: ({ row }) => {
            const date = row.original.system_info?.created_at;
            return date ? new Date(date).toLocaleDateString() : "N/A";
        },
    },
    // Actions
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
                // alignmentClass is omitted here, so it defaults to "flex justify-center"
                items={[
                    { label: "Edit", onClick: actions?.onEdit, permission: "edit-document"},
                    { label: "Delete", onClick: actions?.onDelete, danger: true, passId: true, permission: "delete-document"}, // needs only ID
                ]}
            />
        ),
    },
];

export default columns;
