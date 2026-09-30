const fields = (form, user, salaryApprovalEnabled = true) => {
    const paymentFrequency = form?.watch ? form.watch("payment_frequency") : null;
    const branchVal = form?.watch ? form.watch("branch_id") : null;
    const selectedBranch = branchVal?.value ?? branchVal;
    const isAllBranch = selectedBranch === "all-branch";

    return [
        {
            name: "scope_type",
            type: "select",
            label: "Scope Type",
            placeholder: "Select scope type",
            colSpan: "col-span-12 md:col-span-3",
            options: [
                { label: "Company wise salary", value: "company" },
                { label: "Project wise salary", value: "project" },
            ],
            handleChange: (e) => {
                const val = e?.target?.value ?? e?.value ?? e;
                if (form?.setValue) {
                    form.setValue("scope_type", val);
                    form.setValue("project_id", null);
                    form.setValue("department_id", null);
                }
            },
        },
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
            name: "job_position_id",
            type: "async-select",
            label: "Job Position",
            loadOptions: [
                "organization/job-positions",
                "job_positions",
                "jobPositionsTemplate",
                ["department_id"],
            ],
            placeholder: "Select Job Position",
            colSpan: "col-span-12 md:col-span-3",
        },
        {
            name: "payment_frequency",
            type: "select",
            label: "Salary Type",
            placeholder: "All Salary Types",
            colSpan: "col-span-12 md:col-span-3",
            options: [
                { label: "All", value: "" },
                { label: "Monthly", value: "monthly" },
                { label: "Weekly", value: "weekly" },
                { label: "Hourly", value: "hourly" },
            ],
            handleChange: (e) => {
                const val = e?.target?.value ?? e?.value ?? e;
                if (form?.setValue) {
                    form.setValue("payment_frequency", val);
                    if (val === "weekly") {
                        form.setValue("month_from", null);
                        form.setValue("month_to", null);
                        form.setValue("salary_month", null);
                        form.setValue("from_date", null);
                        form.setValue("to_date", null);
                    } else {
                        form.setValue("from_date", null);
                        form.setValue("to_date", null);
                    }
                }
            },
        },
        ...(paymentFrequency === "weekly"
            ? [
                  {
                      name: "from_date",
                      type: "date",
                      label: "From Date",
                      placeholder: "All Dates",
                      colSpan: "col-span-12 md:col-span-3",
                      handleChange: (e) => {
                          const val = e?.target?.value ?? e;
                          if (form?.setValue) {
                              form.setValue("from_date", val || null);
                          }
                      },
                  },
                  {
                      name: "to_date",
                      type: "date",
                      label: "To Date",
                      placeholder: "All Dates",
                      colSpan: "col-span-12 md:col-span-3",
                      handleChange: (e) => {
                          const val = e?.target?.value ?? e;
                          if (form?.setValue) {
                              form.setValue("to_date", val || null);
                          }
                      },
                  },
              ]
            : [
                  {
                      name: "month_from",
                      type: "month",
                      label: "From Month",
                      colSpan: "col-span-12 md:col-span-3",
                      inputProps: { type: "month" },
                      handleChange: (e) => {
                          const val = e?.target?.value ?? e?.value ?? e;
                          if (form?.setValue) {
                              form.setValue("month_from", val);
                              form.setValue("salary_month", val);
                          }
                      },
                  },
                  {
                      name: "month_to",
                      type: "month",
                      label: "To Month",
                      colSpan: "col-span-12 md:col-span-3",
                      inputProps: { type: "month" },
                  },
              ]),
        ...(salaryApprovalEnabled
            ? [
                  {
                      name: "admin_status",
                      type: "select",
                      label: "Admin Status",
                      placeholder: "All Status",
                      colSpan: "col-span-12 md:col-span-3",
                      options: [
                          { label: "All Status", value: "" },
                          { label: "Pending", value: "pending" },
                          { label: "Approved", value: "approved" },
                          { label: "Rejected", value: "rejected" },
                      ],
                  },
              ]
            : []),
        {
            name: "payment_status",
            type: "select",
            label: "Payment Status",
            placeholder: "All Payment Status",
            colSpan: "col-span-12 md:col-span-3",
            options: [
                { label: "All Payment Status", value: "" },
                { label: "Unpaid", value: "unpaid" },
                { label: "Paid", value: "paid" },
                { label: "Partial", value: "partial" },
            ],
        },
        {
            name: "employee_ids",
            type: "multi-async-select",
            label: "Employees",
            loadOptions: ["hrm/employees", "employees", "employTemplate"],
            colSpan: "col-span-12 md:col-span-3",
        },
    ];
};

export default fields;