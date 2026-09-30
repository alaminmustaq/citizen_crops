import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, FileText } from "lucide-react";
import toast from "react-hot-toast";

const safe = (v, fallback = "—") => (v ?? v === 0 ? v : fallback);

const CopyCodeCell = ({ code }) => {
    const [copied, setCopied] = useState(false);

    if (!code) return "—";

    const handleCopy = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success(`Copied "${code}" to clipboard!`);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            className="inline-flex items-center gap-1 group cursor-pointer"
            onClick={handleCopy}
            title="Click to copy code"
        >
            <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors whitespace-nowrap">
                {code}
            </span>
            <button
                type="button"
                className="p-0.5 text-slate-400 hover:text-primary transition-colors rounded hover:bg-slate-100 dark:hover:bg-slate-800"
            >
                {copied ? (
                    <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                    <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
            </button>
        </div>
    );
};

const columns = (actions, projectEnabled = true, salaryApprovalEnabled = true) => {
    const cols = [
        {
            header: "Name",
            accessorKey: "employee",
            cell: ({ row }) => {
                const emp = row.original?.employee;
                return emp
                    ? `${emp.first_name ?? ""} ${emp.last_name ?? ""}`.trim()
                    : "—";
            },
        },

        {
            id: "employee_code",
            header: "Code",
            cell: ({ row }) => (
                <CopyCodeCell code={row.original?.employee?.employee_code} />
            ),
        },

        {
            id: "organization",
            header: projectEnabled ? "Branch / Dept / Project" : "Branch / Dept",
            cell: ({ row }) => {
                const branchName = row.original?.branch?.name || row.original?.employee?.branch?.name;
                const deptName = row.original?.department?.name || row.original?.employee?.department?.name;
                const projName = row.original?.project?.name;

                return (
                    <div className="flex flex-col gap-0.5 text-xs min-w-[120px]">
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-400 font-medium uppercase w-10">
                                Branch:
                            </span>
                            <span className="font-medium text-slate-800 dark:text-slate-200 ml-2">
                                {safe(branchName)}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-400 font-medium uppercase w-10">
                                Dept:
                            </span>
                            <span className="text-slate-600 dark:text-slate-400 ml-2">
                                {safe(deptName)}
                            </span>
                        </div>
                        {projectEnabled && projName && (
                            <div className="flex items-center gap-1">
                                <span className="text-[10px] text-indigo-400 font-medium uppercase w-10">
                                    Project:
                                </span>
                                <span className="text-indigo-600 dark:text-indigo-400 font-medium ml-2">
                                    {projName}
                                </span>
                            </div>
                        )}
                    </div>
                );
            },
        },

        {
            id: "job_position",
            header: "Job Position",
            cell: ({ row }) =>
                safe(
                    row.original?.job_position?.title ||
                        row.original?.employee?.job_position?.title,
                ),
        },

        {
            id: "salary_month",
            header: "Salary Period",
            cell: ({ row }) => {
                const month = row.original?.salary_month;
                const freq = row.original?.payment_frequency;
                const rawFrom = row.original?.from_date;
                const rawTo = row.original?.to_date;

                const cleanFrom = rawFrom ? String(rawFrom).split("T")[0].split(" ")[0] : null;
                const cleanTo = rawTo ? String(rawTo).split("T")[0].split(" ")[0] : null;

                const empSalaryType =
                    row.original?.employee?.salary_type ||
                    row.original?.salary_type;
                const totalHrs = Number(
                    row.original?.total_hours ??
                        row.original?.total_worked_hours ??
                        0,
                );
                const isHourly = freq === "hourly" || empSalaryType === "hourly";

                if (isHourly) {
                    const hrsText = totalHrs > 0 ? ` (${totalHrs} hrs)` : "";
                    return (
                        <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-slate-800 dark:text-slate-100">
                                {month || "—"}
                            </span>
                            <span className="inline-flex items-center text-[10px] font-semibold text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 rounded-md w-fit whitespace-nowrap">
                                ⏱️ Hourly{hrsText}
                            </span>
                        </div>
                    );
                }

                const isWeekly =
                    freq === "weekly" ||
                    (cleanFrom &&
                        cleanTo &&
                        (new Date(cleanTo) - new Date(cleanFrom)) /
                            (1000 * 3600 * 24) <=
                            10);

                if (isWeekly) {
                    const fromShort = cleanFrom ? cleanFrom.slice(5) : "";
                    const toShort = cleanTo ? cleanTo.slice(5) : "";
                    const dateRangeStr =
                        fromShort && toShort
                            ? `${fromShort} to ${toShort}`
                            : fromShort || toShort || "Weekly";

                    return (
                        <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-slate-800 dark:text-slate-100">
                                {month || "—"}
                            </span>
                            <span className="inline-flex items-center text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-md w-fit whitespace-nowrap">
                                📅 Weekly ({dateRangeStr})
                            </span>
                        </div>
                    );
                }

                return (
                    <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-slate-800 dark:text-slate-100">
                            {month || "—"}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                            Monthly
                        </span>
                    </div>
                );
            },
        },

        {
            id: "salary_amounts",
            header: "Payment Amounts",
            cell: ({ row }) => {
                const net = Number(row.original?.net_payable ?? 0);
                const paid = Number(row.original?.paid_amount ?? 0);
                const due =
                    row.original?.due_amount != null
                        ? Number(row.original.due_amount)
                        : Math.max(0, net - paid);

                const netFmt = `$${net.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
                const paidFmt = `$${paid.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
                const dueFmt = `$${due.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

                return (
                    <div className="flex flex-col gap-0.5 text-xs min-w-[130px]">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-slate-500 font-medium text-[11px]">
                                Net:
                            </span>
                            <span className="font-semibold text-slate-800 dark:text-slate-100">
                                {netFmt}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-slate-500 font-medium text-[11px]">
                                Paid:
                            </span>
                            <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                {paidFmt}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800 pt-0.5 mt-0.5">
                            <span className="text-slate-500 font-medium text-[11px]">
                                Due:
                            </span>
                            <span
                                className={
                                    due > 0
                                        ? "font-bold text-rose-600 dark:text-rose-400"
                                        : "font-semibold text-slate-500"
                                }
                            >
                                {dueFmt}
                            </span>
                        </div>
                    </div>
                );
            },
        },

        {
            id: "status_group",
            header: "Status",
            cell: ({ row }) => {
                const adminStatus = row.original?.admin_status ?? "pending";
                const paymentStatus = row.original?.payment_status ?? "unpaid";

                const adminColors = {
                    approved:
                        "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                    pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
                    rejected: "bg-rose-500/10 text-rose-600 border-rose-500/20",
                };

                const paymentColors = {
                    paid: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                    partial: "bg-amber-500/10 text-amber-600 border-amber-500/20",
                    unpaid: "bg-rose-500/10 text-rose-600 border-rose-500/20",
                };

                return (
                    <div className="flex flex-col gap-1 text-xs min-w-[110px]">
                        {salaryApprovalEnabled && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-slate-400 font-medium uppercase w-10">
                                    Admin:
                                </span>
                                <span
                                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold capitalize border ${adminColors[adminStatus] || adminColors.pending}`}
                                >
                                    {adminStatus}
                                </span>
                            </div>
                        )}
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-400 font-medium uppercase w-10">
                                Pay:
                            </span>
                            <span
                                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold capitalize border ${paymentColors[paymentStatus] || paymentColors.unpaid}`}
                            >
                                {paymentStatus}
                            </span>
                        </div>
                    </div>
                );
            },
        },
    ];

    if (actions?.canViewPaySlip !== false) {
        cols.push({
            id: "actions",
            header: "Pay Slip",
            cell: ({ row }) => (
                <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    className="gap-1.5 text-xs border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => actions?.onPdf?.(row.original)}
                >
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    PDF
                </Button>
            ),
        });
    }

    return cols;
};

export default columns;
