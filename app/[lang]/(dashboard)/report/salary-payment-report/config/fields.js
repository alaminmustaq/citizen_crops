const fields = (form, user) => {
    const branchVal = form?.watch ? form.watch("branch_id") : null;
    const selectedBranch = branchVal?.value ?? branchVal;
    const isAllBranch = selectedBranch === "all-branch";

    return [
        {
            name: "branch_id",
            type: "async-select",
            label: "Branch",
            loadOptions: [
                "organization/branches",
                "branches",
                "branchSearchTemplate",
            ],
            placeholder: "Select Branch",
            firstChildren: user?.employee
                ? []
                : [{ label: "All Branch", value: "all-branch" }],
            colSpan: "col-span-12 md:col-span-3",
            handleChange: (val) => {
                if (form?.setValue) {
                    form.setValue("branch_id", val);
                    const rawVal = val?.value ?? val;
                    if (rawVal === "all-branch") {
                        form.setValue("department_id", null);
                    }
                }
            },
        },
        {
            name: "department_id",
            type: "async-select",
            label: "Department",
            loadOptions: [
                "organization/departments",
                "departments",
                "departmentSearchTemplate",
                ["branch_id"],
            ],
            placeholder: isAllBranch
                ? "All Departments Selected"
                : "Select Department",
            disabled: isAllBranch,
            colSpan: "col-span-12 md:col-span-3",
        },
        {
            name: "project_id",
            type: "async-select",
            label: "Project",
            loadOptions: [
                "projects",
                "projects",
                "projectTemplate",
                ["branch_id"],
            ],
            placeholder: "Select Project",
            colSpan: "col-span-12 md:col-span-3",
        },
        {
            name: "employee_id",
            type: "async-select",
            label: "Employee",
            loadOptions: ["hrm/employees", "employees", "employTemplate"],
            placeholder: "Select Employee",
            colSpan: "col-span-12 md:col-span-3",
        },
        {
            name: "payment_method",
            type: "select",
            label: "Payment Method",
            placeholder: "All Methods",
            colSpan: "col-span-12 md:col-span-3",
            options: [
                { label: "All Methods", value: "" },
                { label: "Cash", value: "cash" },
                { label: "Bank Transfer", value: "bank" },
                { label: "Cheque", value: "cheque" },
                { label: "Mobile Money", value: "mobile_money" },
                { label: "Other", value: "other" },
            ],
        },
        {
            name: "company_bank_branch_id",
            type: "async-select",
            label: "Company Bank Account",
            loadOptions: ["bank/banks", "banks", "bankTemplate"],
            placeholder: "Select Bank Account",
            colSpan: "col-span-12 md:col-span-3",
        },
        {
            name: "payment_from_date",
            type: "date",
            label: "Payment From Date",
            placeholder: "From Date",
            colSpan: "col-span-12 md:col-span-3",
        },
        {
            name: "payment_to_date",
            type: "date",
            label: "Payment To Date",
            placeholder: "To Date",
            colSpan: "col-span-12 md:col-span-3",
        },
        {
            name: "salary_month",
            type: "month",
            label: "Salary Month",
            colSpan: "col-span-12 md:col-span-3",
            inputProps: { type: "month" },
        },
        {
            name: "payment_frequency",
            type: "select",
            label: "Payment Frequency",
            placeholder: "All Frequencies",
            colSpan: "col-span-12 md:col-span-3",
            options: [
                { label: "All Frequencies", value: "" },
                { label: "Monthly", value: "monthly" },
                { label: "Weekly", value: "weekly" },
                { label: "Hourly", value: "hourly" },
            ],
        },
    ];
};

export default fields;
