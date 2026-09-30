import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const safe = (value, fallback = "-") => (value || value === 0 ? value : fallback);
const money = (value) => `$${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

const columns = (actions) => [
    {
        header: "Name",
        accessorKey: "employee",
        cell: ({ row }) => {
            const employee = row.original?.employee;
            return employee
                ? `${employee.first_name ?? ""} ${employee.last_name ?? ""}`.trim()
                : "-";
        },
    },
    {
        header: "Code",
        accessorKey: "employee.employee_code",
    },
    {
        id: "job_position",
        header: "Job Position",
        cell: ({ row }) => safe(row.original?.job_position?.title || row.original?.employee?.job_position?.title),
    },
    {
        id: "department",
        header: "Department",
        cell: ({ row }) => safe(row.original?.department?.name || row.original?.employee?.department?.name),
    },
    {
        id: "salary_month",
        header: "Salary Month",
        cell: ({ row }) => safe(row.original?.salary_month),
    },
    {
        id: "net_payable",
        header: "Net Payable",
        cell: ({ row }) => money(row.original?.net_payable),
    },
    {
        id: "paid_amount",
        header: "Paid Amount",
        cell: ({ row }) => money(row.original?.paid_amount ?? 0),
    },
    {
        id: "due_amount",
        header: "Due Amount",
        cell: ({ row }) => {
            const net = Number(row.original?.net_payable ?? 0);
            const paid = Number(row.original?.paid_amount ?? 0);
            const due = row.original?.due_amount != null ? Number(row.original.due_amount) : Math.max(0, net - paid);
            return (
                <span className={due > 0 ? "font-semibold text-rose-600 dark:text-rose-400" : "text-slate-500"}>
                    {money(due)}
                </span>
            );
        },
    },
    {
        id: "payment_status",
        header: "Payment Status",
        cell: ({ row }) => {
            const status = row.original?.payment_status ?? "unpaid";
            const colors = {
                paid: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                partial: "bg-amber-500/10 text-amber-600 border-amber-500/20",
                unpaid: "bg-rose-500/10 text-rose-600 border-rose-500/20",
            };
            return (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${colors[status] || colors.unpaid}`}>
                    {status}
                </span>
            );
        },
    },
    {
        id: "actions",
        header: "Pay Slip",
        cell: ({ row }) => (
            <Button
                type="button"
                variant="outline"
                size="xs"
                className="gap-1.5 text-xs border-slate-300"
                onClick={() => actions?.onPdf?.(row.original)}
            >
                <FileText className="h-3.5 w-3.5 text-primary" />
                PDF
            </Button>
        ),
    },
];

export default columns;
