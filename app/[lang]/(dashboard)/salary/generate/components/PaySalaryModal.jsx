"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

const PaySalaryModal = ({ salaryState, actions }) => {
  const { payModalOpen, selectedSalaryForPay, payForm, activeBankBranches, isPaying } = salaryState;
  const { register, handleSubmit, watch, setValue, formState: { errors } } = payForm;

  if (!selectedSalaryForPay) return null;

  const emp = selectedSalaryForPay?.employee;
  const empName = emp ? `${emp.first_name ?? ""} ${emp.last_name ?? ""}`.trim() : "Employee";
  const empCode = emp?.employee_code ? `(${emp.employee_code})` : "";
  const netPayable = Number(selectedSalaryForPay?.net_payable ?? 0);
  const paidAmount = Number(selectedSalaryForPay?.paid_amount ?? 0);
  const dueAmount = selectedSalaryForPay?.due_amount != null
    ? Number(selectedSalaryForPay.due_amount)
    : Math.max(0, netPayable - paidAmount);

  const paymentMethod = watch("payment_method") || "cash";

  return (
    <Dialog open={payModalOpen} onOpenChange={(open) => !open && actions.onClosePayModal()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between">
            <span>Make Salary Payment</span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {selectedSalaryForPay.payment_frequency === "weekly" && selectedSalaryForPay.from_date
                ? `📅 ${selectedSalaryForPay.salary_month} (${selectedSalaryForPay.from_date.slice(5)} to ${selectedSalaryForPay.to_date ? selectedSalaryForPay.to_date.slice(5) : ""})`
                : `📅 ${selectedSalaryForPay.salary_month}`}
            </span>
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-sm">
            Disburse full or partial payment for <strong className="text-slate-700 dark:text-slate-200">{empName} {empCode}</strong>.
          </DialogDescription>
        </DialogHeader>

        {/* Salary Summary Cards */}
        <div className="grid grid-cols-3 gap-3 my-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200/80 dark:border-slate-800">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Net Payable</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
              ${netPayable.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Paid So Far</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              ${paidAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Remaining Due</span>
            <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
              ${dueAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(actions.onPaySubmit)} className="space-y-4 pt-1">
          {/* Payment Amount & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Payment Amount ($) <span className="text-rose-500">*</span>
              </Label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                max={dueAmount}
                placeholder="0.00"
                {...register("amount", {
                  required: "Amount is required",
                  min: { value: 0.01, message: "Minimum payment is 0.01" },
                  max: { value: dueAmount, message: `Cannot exceed remaining due of $${dueAmount}` }
                })}
                className="w-full"
              />
              {errors.amount && (
                <span className="text-[11px] text-rose-500 font-medium">{errors.amount.message}</span>
              )}
            </div>

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
                <span className="text-[11px] text-rose-500 font-medium">{errors.payment_date.message}</span>
              )}
            </div>
          </div>

          {/* Payment Method & Bank Branch */}
          <div className="grid grid-cols-2 gap-4">
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
          </div>

          {/* Reference Number */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Reference / Cheque Number / Transaction ID
            </Label>
            <Input
              type="text"
              placeholder="e.g. TXN-987654321 or Cheque #10024"
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
              placeholder="Optional payment description..."
              {...register("notes")}
              className="w-full"
            />
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={actions.onClosePayModal}
              disabled={isPaying}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              color="success"
              disabled={isPaying}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
            >
              {isPaying ? "Processing..." : "Submit Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaySalaryModal;
