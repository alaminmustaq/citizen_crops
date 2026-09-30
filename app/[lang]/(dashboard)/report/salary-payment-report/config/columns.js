import { useState } from "react";
import { Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

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
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
                {copied ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                    <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
            </button>
        </div>
    );
};

const columns = (extraData, projectEnabled = true) => {
    const cols = [
        {
            header: "Employee Name",
            accessorKey: "employee",
            cell: ({ row }) => {
                const emp = row?.original?.employee;
                if (!emp) return "-";

                const code = emp?.employee_code || "";
                const name =
                    `${emp?.first_name || ""} ${emp?.last_name || ""}`.trim() ||
                    "-";

                return (
                    <div className="flex flex-col gap-1">
                        <span className="font-semibold text-slate-800 dark:text-slate-100">
                            {name}
                        </span>
                        {code && <CopyCodeCell code={code} />}
                    </div>
                );
            },
        },
        {
            header: "Branch / Dept / Project",
            accessorKey: "branch_dept_proj",
            cell: ({ row }) => {
                const emp = row?.original?.employee;
                const salary = row?.original?.salary;
                const pay = row?.original;

                const branch = pay?.branch?.name || emp?.branch?.name || "-";
                const dept = emp?.department?.name || "-";
                const proj = salary?.project?.name || "-";

                return (
                    <div className="text-xs leading-tight flex flex-col gap-0.5">
                        <span className="font-medium text-slate-700 dark:text-slate-200">
                            {branch}
                        </span>
                        <span className="text-slate-500">{dept}</span>
                        {projectEnabled && proj !== "-" && (
                            <span className="text-blue-600 dark:text-blue-400 text-[11px]">
                                {proj}
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            header: "Salary Period",
            accessorKey: "salary_period",
            cell: ({ row }) => {
                const salary = row?.original?.salary;
                const emp = row?.original?.employee;
                if (!salary) return "-";

                const freq =
                    salary?.payment_frequency || emp?.salary_type || "monthly";

                const cleanDate = (d) => (d ? d.toString().split("T")[0].split(" ")[0] : "");

                const freqBadge = {
                    monthly: (
                        <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md whitespace-nowrap">
                            Monthly
                        </span>
                    ),
                    weekly: (
                        <span className="inline-flex items-center text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-md whitespace-nowrap">
                            Weekly
                        </span>
                    ),
                    hourly: (
                        <span className="inline-flex items-center text-[10px] font-semibold text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 rounded-md whitespace-nowrap">
                            Hourly
                        </span>
                    ),
                }[freq] || (
                    <span className="inline-flex items-center text-[10px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-500/10 border border-slate-500/20 px-1.5 py-0.5 rounded-md whitespace-nowrap uppercase">
                        {freq}
                    </span>
                );

                const periodText =
                    freq === "weekly" && salary?.from_date && salary?.to_date
                        ? `${cleanDate(salary.from_date)} ~ ${cleanDate(salary.to_date)}`
                        : salary?.salary_month || "-";

                return (
                    <div className="flex flex-col gap-1 text-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-100">
                            {periodText}
                        </span>
                        <div>{freqBadge}</div>
                    </div>
                );
            },
        },
        {
            header: "Payment Date",
            accessorKey: "payment_date",
            cell: ({ row }) => {
                const date = row?.original?.payment_date;
                if (!date) return "-";
                return date.toString().split("T")[0].split(" ")[0];
            },
        },
        {
            header: "Amount Paid",
            accessorKey: "amount",
            cell: ({ row }) => {
                const amt = parseFloat(row?.original?.amount || 0);
                return (
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        ${amt.toFixed(2)}
                    </span>
                );
            },
        },
        {
            header: "Payment Method",
            accessorKey: "payment_method",
            cell: ({ row }) => {
                const method = row?.original?.payment_method || "-";
                const ref = row?.original?.reference_number;

                const methodLabels = {
                    cash: "Cash",
                    bank: "Bank Transfer",
                    cheque: "Cheque",
                    mobile_money: "Mobile Money",
                    other: "Other",
                };

                const label = methodLabels[method] || method;

                return (
                    <div className="flex flex-col text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {label}
                        </span>
                        {ref && (
                            <span className="text-slate-500 text-[11px]">
                                Ref: {ref}
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            header: "Bank Account",
            accessorKey: "bank_branch",
            cell: ({ row }) => {
                const bankBranch = row?.original?.bank_branch;
                if (!bankBranch) return "-";
                const bankName = bankBranch?.bank?.bank_name || bankBranch?.bank_name || "-";
                const branchName = bankBranch?.branch_name || "-";
                const accNo = bankBranch?.account_no || bankBranch?.account_number;
                return (
                    <div className="text-xs flex flex-col">
                        <span className="font-medium text-slate-700 dark:text-slate-200">
                            {bankName} ({branchName})
                        </span>
                        {accNo && (
                            <span className="text-slate-500 text-[11px]">
                                Acc: {accNo}
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            header: "Notes",
            accessorKey: "notes",
            cell: ({ row }) => {
                return (
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                        {row?.original?.notes || "-"}
                    </span>
                );
            },
        },
        {
            header: "Recorded By",
            accessorKey: "creator",
            cell: ({ row }) => {
                return (
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                        {row?.original?.creator?.username || row?.original?.creator?.name || "-"}
                    </span>
                );
            },
        },
    ];

    return cols;
};

export default columns;
