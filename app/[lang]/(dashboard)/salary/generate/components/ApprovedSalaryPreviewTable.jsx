"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight, X } from "lucide-react";

export default function ApprovedSalaryPreviewTable({ form, actions, salaryState }) {
    const payFull = form.watch("pay_full");
    const adminStatus = form.watch("admin_status");
    const previewRecords = salaryState?.approvedPreviewRecords || [];
    const pagination = salaryState?.approvedPreviewPagination || {
        total: previewRecords.length,
        current_page: 1,
        last_page: 1,
        per_page: 10,
    };
    const isGenerating = salaryState?.isGeneratingPreview;
    const excludedEmpIds = (form.watch("excluded_employee_ids") || []).map(String);
    const excludedSalIds = (form.watch("excluded_ids") || []).map(String);

    const [searchTerm, setSearchTerm] = useState("");
    const [pageSize, setPageSize] = useState(10);

    // Handle search text change with debounce to trigger backend API search
    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchTerm(val);
    };

    // Debounce backend API search call
    useEffect(() => {
        if (!payFull || adminStatus === "rejected") return;
        const timer = setTimeout(() => {
            if (actions?.onGenerateApprovedPreview) {
                actions.onGenerateApprovedPreview(form.getValues(), {
                    search: searchTerm,
                    page: 1,
                    per_page: pageSize,
                });
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [searchTerm, payFull, adminStatus, pageSize]);

    if (!payFull || adminStatus === "rejected") return null;

    // Handle page change -> Backend API request
    const handlePageChange = (newPage) => {
        if (actions?.onGenerateApprovedPreview) {
            actions.onGenerateApprovedPreview(form.getValues(), {
                search: searchTerm,
                page: newPage,
                per_page: pageSize,
            });
        }
    };

    // Handle per page limit change -> Backend API request
    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        if (actions?.onGenerateApprovedPreview) {
            actions.onGenerateApprovedPreview(form.getValues(), {
                search: searchTerm,
                page: 1,
                per_page: newSize,
            });
        }
    };

    const toggleExclude = (record) => {
        const empId = record.employee_id || record.employee?.id ? String(record.employee_id || record.employee?.id) : "";
        const salId = record.id ? String(record.id) : "";

        const currentEmp = (form.getValues("excluded_employee_ids") || []).map(String);
        const currentSal = (form.getValues("excluded_ids") || []).map(String);

        const isExcluded = (empId && currentEmp.includes(empId)) || (salId && currentSal.includes(salId));

        let updatedEmp, updatedSal;
        if (isExcluded) {
            updatedEmp = currentEmp.filter((id) => id !== empId && id !== salId);
            updatedSal = currentSal.filter((id) => id !== salId && id !== empId);
        } else {
            updatedEmp = empId ? [...currentEmp, empId] : currentEmp;
            updatedSal = salId ? [...currentSal, salId] : currentSal;
        }

        form.setValue("excluded_employee_ids", updatedEmp, { shouldDirty: true, shouldValidate: true });
        form.setValue("excluded_ids", updatedSal, { shouldDirty: true, shouldValidate: true });
    };

    const isRecordExcluded = (item) => {
        const empId = item.employee_id || item.employee?.id ? String(item.employee_id || item.employee?.id) : "";
        const salId = item.id ? String(item.id) : "";
        return (empId && excludedEmpIds.includes(empId)) || (salId && excludedSalIds.includes(salId));
    };

    const totalCount = pagination.total || previewRecords.length;
    const currentPage = pagination.current_page || 1;
    const totalPages = pagination.last_page || 1;
    const excludedCount = previewRecords.filter(isRecordExcluded).length;
    const includedCount = Math.max(0, totalCount - excludedCount);

    const startIndex = (currentPage - 1) * pageSize;

    return (
        <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-gray-50/50 space-y-4">
            {/* Header & Controls Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
                <div>
                    <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                        Payment Preview Records
                        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-700 font-medium">
                            {totalCount} Total
                        </span>
                    </h3>
                    <p className="text-xs text-gray-500">
                        Click any record row or action button to exclude it from full payment.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        Included: {includedCount}
                    </span>
                    {excludedCount > 0 && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Excluded: {excludedCount}
                        </span>
                    )}
                    {actions?.onGenerateApprovedPreview && (
                        <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            isLoading={isGenerating}
                            onClick={() => actions.onGenerateApprovedPreview(form.getValues(), { search: searchTerm, page: 1, per_page: pageSize })}
                        >
                            {previewRecords.length > 0 ? "Refresh Preview" : "Generate Records"}
                        </Button>
                    )}
                </div>
            </div>

            {/* Backend Server Search Input Bar */}
            <div className="relative flex items-center max-w-sm">
                <Search className="w-4 h-4 absolute left-3 text-gray-400 pointer-events-none" />
                <Input
                    type="text"
                    placeholder="Search backend records by name, code..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="pl-9 pr-8 h-9 text-xs"
                />
                {searchTerm && (
                    <button
                        type="button"
                        onClick={() => {
                            setSearchTerm("");
                            if (actions?.onGenerateApprovedPreview) {
                                actions.onGenerateApprovedPreview(form.getValues(), { search: "", page: 1, per_page: pageSize });
                            }
                        }}
                        className="absolute right-2.5 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            {/* Table Content */}
            {isGenerating ? (
                <div className="py-8 text-center text-sm text-gray-500">
                    Fetching backend records preview…
                </div>
            ) : previewRecords.length === 0 ? (
                <div className="py-6 text-center text-xs text-gray-500 bg-white rounded border border-dashed border-gray-300">
                    {searchTerm ? (
                        <>No pending records found matching <span className="font-semibold">"{searchTerm}"</span> on server.</>
                    ) : (
                        <>Click <span className="font-semibold text-primary">"Generate Records"</span> to fetch pending employee records from backend.</>
                    )}
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto rounded border border-gray-200 bg-white">
                        <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                            <thead className="bg-gray-100 sticky top-0 z-10">
                                <tr>
                                    <th className="px-3 py-2 font-medium text-gray-600">Code</th>
                                    <th className="px-3 py-2 font-medium text-gray-600">Employee Name</th>
                                    <th className="px-3 py-2 font-medium text-gray-600">Branch / Dept</th>
                                    <th className="px-3 py-2 font-medium text-gray-600">Amount / Salary</th>
                                    <th className="px-3 py-2 font-medium text-gray-600">Status</th>
                                    <th className="px-3 py-2 font-medium text-gray-600 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {previewRecords.map((item, idx) => {
                                    const recId = String(item.employee_id || item.id || item.employee?.id);
                                    const isExcluded = isRecordExcluded(item);
                                    const empCode = item.employee_code || item.employee?.employee_code || "-";
                                    const empName = item.employee
                                        ? `${item.employee.first_name || ""} ${item.employee.last_name || ""}`.trim()
                                        : `${item.first_name || ""} ${item.last_name || ""}`.trim() || item.name || "-";
                                    const branchName = item.branch?.name || item.branch_name || "-";
                                    const deptName = item.department?.name || item.department_name || "-";
                                    const netPayable = item.net_payable != null
                                        ? Number(item.net_payable).toLocaleString("en-US", { minimumFractionDigits: 2 })
                                        : item.basic_salary != null
                                        ? Number(item.basic_salary).toLocaleString("en-US", { minimumFractionDigits: 2 })
                                        : "-";

                                    return (
                                        <tr
                                            key={recId || idx}
                                            onClick={() => toggleExclude(item)}
                                            className={`cursor-pointer transition-colors ${
                                                isExcluded
                                                    ? "bg-red-50/70 hover:bg-red-100/60 text-red-900"
                                                    : "hover:bg-emerald-50/50 text-gray-800"
                                            }`}
                                        >
                                            <td className="px-3 py-2 font-mono font-medium text-gray-600">
                                                {empCode}
                                            </td>
                                            <td className="px-3 py-2 font-medium">
                                                {empName}
                                            </td>
                                            <td className="px-3 py-2 text-gray-500">
                                                {branchName} / {deptName}
                                            </td>
                                            <td className="px-3 py-2 font-semibold">
                                                {netPayable}
                                            </td>
                                            <td className="px-3 py-2">
                                                {isExcluded ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-red-100 text-red-800 border border-red-200">
                                                        Excluded from Payment
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                        Pay Full
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 text-right">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleExclude(item);
                                                    }}
                                                    className={`px-2.5 py-1 text-[11px] font-medium rounded transition-all border ${
                                                        isExcluded
                                                            ? "bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                                                            : "bg-white text-red-700 border-red-300 hover:bg-red-50"
                                                    }`}
                                                >
                                                    {isExcluded ? "Include" : "Exclude"}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Server Pagination Controls Footer */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                            <span>Rows per page:</span>
                            <select
                                value={pageSize}
                                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                                className="h-7 text-xs border border-gray-300 rounded px-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                            <span className="text-gray-500 ml-2">
                                Showing {totalCount === 0 ? 0 : startIndex + 1} to{" "}
                                {Math.min(startIndex + previewRecords.length, totalCount)} of {totalCount} records (Server Paginated)
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-auto">
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="h-7 px-2"
                                disabled={currentPage <= 1 || isGenerating}
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                <ChevronLeft className="w-3.5 h-3.5 mr-0.5" /> Prev
                            </Button>
                            <span className="px-2 py-0.5 font-medium text-gray-700">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="h-7 px-2"
                                disabled={currentPage >= totalPages || isGenerating}
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                Next <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
