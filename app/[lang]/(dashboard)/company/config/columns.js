import { TableActions } from "@/components/table/TableActions";
import { formatDate } from "@/lib/utils";

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

const fmtDate = (d) => (d ? formatDate(d) : "—");
const fmtAddr = (a) =>
    [a?.line_1, a?.city, a?.state, a?.country].filter(Boolean).join(", ") ||
    "—";

let columns = (actions) => [
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
                onLoginAsCompany={actions?.onLoginAsCompany}
                items={[
                    { label: "Edit", onClick: actions?.onEdit, permission: "edit-company" },
                    { label: "Delete", onClick: actions?.onDelete, danger: true, passId: true, permission: "delete-company" },
                ]}
            />
        ),
    },
];

export default columns;
