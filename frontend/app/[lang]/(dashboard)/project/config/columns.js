import { TableActions } from "@/components/table/TableActions";
import { useRouter, useParams } from "next/navigation";
import { useProfile } from "@/domains/profile/hook/useProfile";
import { useProject } from "@/domains/project/hook/useProject";
const safe = (v, fallback = "—") => (v ?? v === 0 ? v : fallback);

let columns = (actions) => {
    const { actions: projectActions } = useProject();
    const params = useParams();
    const lang = params?.lang || 'en';
    const router = useRouter();
    return [
        // Core fields
        { accessorKey: "name", header: "Project Name" },
        {
            id: "status",
            header: "Status",
            thClass: "!text-center",
            tdClass: "!text-center",
            cell: ({ row }) => safe(row.original?.status),
        },
        {
            id: "start_date",
            header: "Start Date",
            thClass: "!text-center",
            tdClass: "!text-center",
            cell: ({ row }) => safe(row.original?.start_date),
        },
        {
            id: "end_date",
            header: "End Date",
            thClass: "!text-center",
            tdClass: "!text-center",
            cell: ({ row }) => safe(row.original?.end_date),
        },
        {
            id: "budget",
            header: "Budget",
            thClass: "!text-center",
            tdClass: "!text-center",
            cell: ({ row }) => safe(row.original?.budget),
        },
        // {
        //   id: "client",
        //   header: "Client",
        //   cell: ({ row }) => safe(row.original?.client),
        // },
        // {
        //   id: "job_position",
        //   header: "Job Position",
        //   cell: ({ row }) => safe(row.original?.job_position?.title),
        // },
        // {
        //   id: "employees",
        //   header: "Employees",
        //   cell: ({ row }) =>
        //     row.original?.employees?.length
        //       ? row.original.employees.map((e) => e.name).join(", ")
        //       : "—",
        // },
        // {
        //   id: "expiry_warning_days",
        //   header: "Expiry Warning (days)",
        //   cell: ({ row }) => safe(row.original?.expiry_warning_days),
        // },

        // Actions
        {
            id: "actions",
            enableHiding: false,
            header: "",
            thClass: "!text-center w-[70px] whitespace-nowrap",
            tdClass: "!text-center w-[70px] whitespace-nowrap",
            cell: ({ row }) => (
                <TableActions
                    data={row.original}
                    label="Actions"
                    items={[
                        {
                            label: "View",
                            onClick: (rowData) => {
                                // Define the custom handler here
                                // projectActions.getProject(rowData?.id);
                                router.push(`/${lang}/project-details/${rowData?.id}`);
                            }, permission: "details-project"
                        },
                        {
                            label: "Assign Employees",
                            onClick: actions?.setAssignEmployModel, permission: "delete-project"
                        },
                        { label: "Edit", onClick: actions?.onEdit, permission: "edit-project"},
                        {
                            label: "Delete",
                            onClick: actions?.onDelete,
                            danger: true,
                            passId: true,
                            permission: "delete-project"
                        }, // needs only ID
                    ]}
                />
            ),
        },
    ];
};

export default columns;
