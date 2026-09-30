const dayMap = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
};

const getPayrollWeeks = (salaryMonth, weekStartDay = "saturday") => {
    if (!salaryMonth) return [];

    const targetDay = dayMap[weekStartDay?.toLowerCase()] ?? 6;

    const [year, month] = salaryMonth.split("-").map(Number);
    if (!year || !month) return [];

    const monthStart = new Date(Date.UTC(year, month - 1, 1));
    const monthEnd = new Date(Date.UTC(year, month, 0));

    let currentStart = new Date(monthStart);
    let dayOfWeek = currentStart.getUTCDay();
    let diff = (dayOfWeek - targetDay + 7) % 7;
    currentStart.setUTCDate(currentStart.getUTCDate() - diff);

    const weeks = [];
    let weekIndex = 1;

    while (true) {
        const currentEnd = new Date(currentStart);
        currentEnd.setUTCDate(currentEnd.getUTCDate() + 6);

        const endYear = currentEnd.getUTCFullYear();
        const endMonth = currentEnd.getUTCMonth() + 1;
        const endMonthStr = `${endYear}-${String(endMonth).padStart(2, "0")}`;

        if (endMonthStr === salaryMonth) {
            const fromStr = currentStart.toISOString().slice(0, 10);
            const toStr = currentEnd.toISOString().slice(0, 10);

            const startFmt = currentStart.toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                weekday: "short",
                timeZone: "UTC",
            });
            const endFmt = currentEnd.toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                weekday: "short",
                timeZone: "UTC",
            });

            weeks.push({
                label: `Week ${weekIndex}: ${startFmt} – ${endFmt}`,
                value: `${fromStr}|${toStr}`,
                from_date: fromStr,
                to_date: toStr,
            });
            weekIndex++;
        }

        currentStart.setUTCDate(currentStart.getUTCDate() + 7);

        if (currentStart > monthEnd && endMonthStr > salaryMonth) {
            break;
        }
    }

    return weeks;
};

const filterFields = (form, user, salaryApprovalEnabled = true) => {
    const paymentFrequency = form.watch("payment_frequency");
    const salaryMonth = form.watch("salary_month");
    const branchVal = form.watch("branch_id");
    const selectedBranch = branchVal?.value ?? branchVal;
    const isAllBranch = selectedBranch === "all-branch";

    const weekStartDay =
        user?.company?.week_start_day ||
        user?.employee?.company?.week_start_day ||
        "saturday";

    const payrollWeekOptions = getPayrollWeeks(salaryMonth, weekStartDay);

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
                form.setValue("branch_id", val);
                const rawVal = val?.value ?? val;
                if (rawVal === "all-branch") {
                    form.setValue("department_id", null);
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
                form.setValue("payment_frequency", val);
                form.setValue("payroll_week", null);
            },
        },
        {
            name: "salary_month",
            type: "month",
            label: "Salary Month",
            colSpan: "col-span-12 md:col-span-3",
            inputProps: { type: "month" },
            handleChange: (e) => {
                const val = e?.target?.value ?? e?.value ?? e;
                form.setValue("salary_month", val);
                form.setValue("payroll_week", null);
            },
        },
        {
            name: "payroll_week",
            type: "select",
            label: `Payroll Week (${weekStartDay.charAt(0).toUpperCase() + weekStartDay.slice(1)} Start)`,
            placeholder: "Select payroll week",
            visibility: paymentFrequency === "weekly",
            colSpan: "col-span-12 md:col-span-3",
            options: payrollWeekOptions,
            handleChange: (e) => {
                const val = e?.target?.value ?? e?.value ?? e;
                form.setValue("payroll_week", val);
                if (val) {
                    const [from, to] = String(val).split("|");
                    form.setValue("from_date", from);
                    form.setValue("to_date", to);
                } else {
                    form.setValue("from_date", null);
                    form.setValue("to_date", null);
                }
            },
        },
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
    ];
};

export default filterFields;
