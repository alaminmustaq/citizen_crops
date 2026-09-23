import { TableActions } from "@/components/table/TableActions";
const Pill = ({ children, className = "" }) => (
    <span
        className={[
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
            className,
        ].join(" ")}
    >
        {children}
    </span>
);

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : "—");
const fmtAddr = (a) =>
    [a?.line_1, a?.city, a?.state, a?.country].filter(Boolean).join(", ") ||
    "—";

let columns = (actions) => [
    // Logo + Name
    {
        id: "name",
        header: "Name",
        cell: ({ row }) => {
            const d = row.original;
            return (
                <div className="flex items-center gap-2 min-w-[180px]">
                    <div className="flex flex-col">
                        <span className="font-medium">{d?.name || "—"}</span>
                        {d?.legal_name ? (
                            <span className="text-xs text-muted-foreground">
                                {d.legal_name}
                            </span>
                        ) : null}
                    </div>
                </div>
            );
        },
    },

    { accessorKey: "code", header: "Code" },

    // Status & Active/Main flags
    {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
            const s = row.original?.system_info?.status || "—";
            const isActive = row.original?.is_active;
            const isMain = row.original?.is_main_company;
            return (
                <div className="flex items-center gap-2">
                    <Pill
                        className={
                            s === "active"
                                ? "bg-green-100 text-green-700"
                                : s === "inactive"
                                ? "bg-gray-100 text-gray-700"
                                : "bg-amber-100 text-amber-700"
                        }
                    >
                        {s}
                    </Pill>
                </div>
            );
        },
    },

    // Emails & Phones
    // {
    //     id: "contact_email",
    //     header: "Email",
    //     cell: ({ row }) => (
    //         <div className="lowercase whitespace-nowrap">
    //             {row.original?.contact_info?.email || "—"}
    //         </div>
    //     ),
    // },
    // {
    //     id: "contact_phone",
    //     header: "Phone",
    //     cell: ({ row }) => row.original?.contact_info?.phone || "—",
    // },

    // Website
    // {
    //     id: "website",
    //     header: "Website",
    //     cell: ({ row }) => {
    //         const url = row.original?.contact_info?.website;
    //         return url ? (
    //             <a
    //                 href={/^https?:\/\//i.test(url) ? url : `https://${url}`}
    //                 target="_blank"
    //                 rel="noreferrer"
    //                 className="text-primary hover:underline"
    //             >
    //                 {url}
    //             </a>
    //         ) : (
    //             "—"
    //         );
    //     },
    // },

    // Address (compact)

    // Locale / Currency / Timezone
    // {
    //     id: "locale",
    //     header: "Locale",
    //     cell: ({ row }) => row.original?.locale || "—",
    // },
    // {
    //     id: "currency",
    //     header: "Currency",
    //     cell: ({ row }) => row.original?.business_info?.currency || "—",
    // },
    // {
    //     id: "timezone",
    //     header: "Timezone",
    //     cell: ({ row }) => row.original?.business_info?.timezone || "—",
    // },

    // Subscription
    {
        id: "subscription",
        header: "Subscription",
        cell: ({ row }) => {
            const s = row.original?.subscription_status;
            const p = row.original?.subscription_plan;
            return (
                <div className="flex flex-col">
                    <span>{p || "—"}</span>
                    <span className="text-xs text-muted-foreground">
                        {s || ""}
                    </span>
                </div>
            );
        },
    },
    // {
    //     id: "billing_dates",
    //     header: "Trial / Suspended",
    //     cell: ({ row }) => {
    //         const trial = row.original?.trial_ends_at;
    //         const suspAt = row.original?.suspended_at;
    //         const reason = row.original?.suspended_reason;
    //         return (
    //             <div className="flex flex-col">
    //                 <span className="text-xs">Trial: {fmtDate(trial)}</span>
    //                 <span className="text-xs">
    //                     Suspended: {fmtDate(suspAt)}
    //                     {reason ? ` (${reason})` : ""}
    //                 </span>
    //             </div>
    //         );
    //     },
    // },

    // Registration / Tax
    {
        id: "registration",
        header: "Registration",
        cell: ({ row }) => {
            const reg = row.original?.registration_info?.registration_number;
            const tax = row.original?.registration_info?.tax_id;
            return (
                <div className="flex flex-col">
                    <span className="text-xs">Reg#: {reg || "—"}</span>
                    <span className="text-xs">Tax ID: {tax || "—"}</span>
                </div>
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
        cell: ({ row }) => (
            <TableActions
                data={row.original}
                label="Actions"
                onLoginAsCompany={actions?.onLoginAsCompany} // ✅ just add this line
                items={[
                    { label: "Edit", onClick: actions?.onEdit, permission: "edit-company"},
                    { label: "Delete", onClick: actions?.onDelete, danger: true, passId: true, permission: "delete-company"}, // needs only ID
                ]}
            />
        ),
    },
];

export default columns;
