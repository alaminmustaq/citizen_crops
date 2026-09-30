"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

const BulkPaySalaryModal = ({ salaryState, actions }) => {
  const {
    bulkPayModalOpen,
    selectedSalariesForBulkPay = [],
    bulkPayForm,
    activeBankBranches = [],
    isBulkPaying,
  } = salaryState;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = bulkPayForm;

  if (!selectedSalariesForBulkPay || selectedSalariesForBulkPay.length === 0) {
    return null;
  }

  // Calculate totals across selected salaries
  const totalEmployees = selectedSalariesForBulkPay.length;

  const totalNetPayable = selectedSalariesForBulkPay.reduce((acc, curr) => {
    return acc + Number(curr?.net_payable ?? 0);
  }, 0);

  const totalPaidSoFar = selectedSalariesForBulkPay.reduce((acc, curr) => {
    return acc + Number(curr?.paid_amount ?? 0);
  }, 0);

  const totalRemainingDue = selectedSalariesForBulkPay.reduce((acc, curr) => {
    const net = Number(curr?.net_payable ?? 0);
    const paid = Number(curr?.paid_amount ?? 0);
    const due =
      curr?.due_amount != null
        ? Number(curr.due_amount)
        : Math.max(0, net - paid);
    return acc + due;
  }, 0);

  const paymentMethod = watch("payment_method") || "cash";

  return (
    <Dialog
      open={bulkPayModalOpen}
      onOpenChange={(open) => !open && actions.onCloseBulkPayModal()}
    >
      <DialogContent className="sm:max-w-[580px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between">
            <span>Bulk Salary Payment</span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
              {totalEmployees} {totalEmployees === 1 ? "Employee" : "Employees"} Selected
            </span>
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-sm">
            Disburse full remaining due payments for all selected approved employee salary records simultaneously.
          </DialogDescription>
        </DialogHeader>

        {/* Aggregate Summary Cards */}
        <div className="grid grid-cols-3 gap-3 my-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200/80 dark:border-slate-800">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
              Total Net Payable
            </span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
              ${totalNetPayable.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
              Paid So Far
            </span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              ${totalPaidSoFar.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
              Total Disbursal
            </span>
            <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
              ${totalRemainingDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Selected Employees Preview Pills */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Selected Recipients
          </Label>
          <div className="max-h-24 overflow-y-auto p-2 bg-slate-100/60 dark:bg-slate-800/40 rounded-md border border-slate-200 dark:border-slate-800 flex flex-wrap gap-1.5">
            {selectedSalariesForBulkPay.map((s) => {
              const emp = s?.employee;
              const empName = emp ? `${emp.first_name ?? ""} ${emp.last_name ?? ""}`.trim() : "Employee";
              const net = Number(s?.net_payable ?? 0);
              const paid = Number(s?.paid_amount ?? 0);
              const due = s?.due_amount != null ? Number(s.due_amount) : Math.max(0, net - paid);
              const periodTag = s.payment_frequency === "weekly" && s.from_date 
                ? ` [W: ${s.from_date.slice(5)} - ${s.to_date ? s.to_date.slice(5) : ""}]` 
                : "";

              return (
                <span
                  key={s.id}
                  className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-2xs font-medium text-slate-700 dark:text-slate-200"
                >
                  <span>{empName}{periodTag}</span>
                  <span className="text-emerald-600 font-semibold">${due.toFixed(2)}</span>
                </span>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit(actions.onBulkPaySubmit)} className="space-y-4 pt-1">
          {/* Payment Date & Payment Method */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Payment Date <span className="text-rose-500">*</span>
              </Label>
              <Input
                type="date"
                {...register("payment_date", { required: "Payment date is required" })}
                className="w-full"
              />
              {errors.payment_date && (
                <span className="text-[11px] text-rose-500 font-medium">
                  {errors.payment_date.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Payment Method <span className="text-rose-500">*</span>
              </Label>
              <select
                value={paymentMethod}
                onChange={(e) => setValue("payment_method", e.target.value)}
                className="w-full h-10 px-3 py-2 bg-background border border-default-300 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary transition-colors cursor-pointer"
              >
                <option value="cash">💵 Cash</option>
                <option value="bank_transfer">🏦 Bank Transfer</option>
                <option value="cheque">📜 Cheque</option>
                <option value="mobile_banking">📱 Mobile Banking</option>
              </select>
            </div>
          </div>

          {/* Company Bank Account (if bank or cheque) */}
          {(paymentMethod === "bank_transfer" || paymentMethod === "bank" || paymentMethod === "cheque") && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Company Bank Account
              </Label>
              <select
                value={watch("company_bank_branch_id") || ""}
                onChange={(e) => setValue("company_bank_branch_id", e.target.value)}
                className="w-full h-10 px-3 py-2 bg-background border border-default-300 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary transition-colors cursor-pointer"
              >
                <option value="">Select Company Bank Account</option>
                {activeBankBranches.length > 0 ? (
                  activeBankBranches.map((b) => (
                    <option key={b.id} value={String(b.id)}>
                      {b.label}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No active bank accounts found
                  </option>
                )}
              </select>
            </div>
          )}

          {/* Reference Number */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Bulk Reference / Cheque / Transaction ID
            </Label>
            <Input
              type="text"
              placeholder="e.g. BULK-PAY-2026-09 or Batch #402"
              {...register("reference_number")}
              className="w-full"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Notes / Remarks
            </Label>
            <Input
              type="text"
              placeholder="Optional payment notes..."
              {...register("notes")}
              className="w-full"
            />
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={actions.onCloseBulkPayModal}
              disabled={isBulkPaying}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              color="success"
              disabled={isBulkPaying}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
            >
              {isBulkPaying
                ? "Processing..."
                : `Submit Bulk Payment ($${totalRemainingDue.toLocaleString(undefined, { minimumFractionDigits: 2 })})`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BulkPaySalaryModal;
