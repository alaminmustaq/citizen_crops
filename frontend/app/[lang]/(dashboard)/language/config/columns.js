import { TableActions } from "@/components/table/TableActions";
import { useRouter, useParams } from "next/navigation";
const val = (v, f = "—") => (v ?? v === 0 ? v : f);

let columns = (actions) => {
    const router = useRouter();
    const params = useParams();
    const lang = params?.lang || "en";

    return [
        // Core
        { accessorKey: "name", header: "Language Name" },
        {
            accessorKey: "code",
            header: "Code",
            thClass: "!text-center",
            tdClass: "!text-center",
        },

        // Status / Default
        {
            id: "is_default",
            header: "Default",
            thClass: "!text-center",
            tdClass: "!text-center",
            cell: ({ row }) => (row.original?.is_default ? "Yes" : "No"),
        },
        {
            id: "is_active",
            header: "Active",
            thClass: "!text-center",
            tdClass: "!text-center",
            cell: ({ row }) => (row.original?.is_active ? "Yes" : "No"),
        },

        // Flag Icon
        {
            id: "flag_icon",
            header: "Flag",
            thClass: "!text-center",
            tdClass: "!text-center",
            cell: ({ row }) => {
                const e = row.original?.flag_icon || "🇺🇸";
                const c = [...e]
                    .map((x) =>
                        String.fromCharCode(x.codePointAt(0) - 0x1f1e6 + 65)
                    )
                    .join("")
                    .toLowerCase();
                return (
                    <img
                        src={`https://flagcdn.com/24x18/${c}.png`}
                        alt={c}
                        width={24}
                        height={18}
                        onError={(e) =>
                            (e.currentTarget.src =
                                "https://flagcdn.com/24x18/us.png")
                        }
                    />
                );
            },
        },

        // Actions
        {
            id: "actions",
            enableHiding: false,
            header: " ",
            thClass: "!text-center w-[70px] whitespace-nowrap",
            tdClass: "!text-center w-[70px] whitespace-nowrap",
            cell: ({ row }) => {
                console.log(row.original.is_global_default);
                if(!row?.original?.is_global_default){
                return (
                <TableActions
                    data={row.original}
                    label="Actions"
                    items={[
                        {
                            label: "Edit",
                            onClick: actions?.onEdit,
                            permission: "edit-language",
                        },
                        {
                            label: "Delete",
                            onClick: actions?.onDelete,
                            danger: true,
                            passId: true,
                            permission: "delete-language",
                        },
                        {
                            label: "Set Attributes",
                            onClick: (rowData) => {
                                // Define the custom handler here
                                router.push(
                                    `/${lang}/language/translate/${rowData?.id}`
                                );
                            },
                            permission: "set-language-attributes",
                        },
                    ]}
                />
            )}
        }
        },
    ];
};

export default columns;
