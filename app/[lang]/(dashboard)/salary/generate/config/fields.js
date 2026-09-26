import { useAppSelector } from "@/hooks/use-redux";

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

        // A week belongs strictly to the month of its End Date (to_date)
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

        // Stop once currentStart passes monthEnd and the end date is past salaryMonth
        if (currentStart > monthEnd && endMonthStr > salaryMonth) {
            break;
        }
    }

    return weeks;
};

const fields = (form, actions) => {
    const { user } = useAppSelector((state) => state.auth);

    const paymentFrequency = form.watch("payment_frequency") || "monthly";
    const salaryMonth = form.watch("salary_month");
    const weekStartDay =
        user?.company?.week_start_day ||
        user?.employee?.company?.week_start_day ||
        "saturday";

    const payrollWeekOptions = getPayrollWeeks(salaryMonth, weekStartDay);

    return [
        // =============== Salary Generation Scope ===============
        {
            name: "scope_type",
            type: "select",
            label: "Scope Type *",
            placeholder: "Select scope type",
            colSpan: "col-span-12 md:col-span-6",
            options: [
                { label: "Company wise salary", value: "company" },
                { label: "Project wise salary", value: "project" },
            ],
            handleChange: (e) => {
                const val = e?.target?.value ?? e?.value ?? e;
                form.setValue("scope_type", val);
                form.setValue("project_id", null);
                form.setValue("department_id", null);
            },
            rules: { required: "Scope type is required" },
        },

        // =============== Payment Frequency ===============
        {
            name: "payment_frequency",
            type: "select",
            label: "Payment Frequency *",
            placeholder: "Select payment frequency",
            colSpan: "col-span-12 md:col-span-6",
            options: [
                { label: "Monthly", value: "monthly" },
                { label: "Weekly", value: "weekly" },
            ],
            handleChange: (e) => {
                const val = e?.target?.value ?? e?.value ?? e;
                form.setValue("payment_frequency", val);
                form.setValue("payroll_week", null, { shouldValidate: true, shouldDirty: true });
                form.setValue("from_date", null, { shouldValidate: true, shouldDirty: true });
                form.setValue("to_date", null, { shouldValidate: true, shouldDirty: true });
            },
            rules: { required: "Payment frequency is required" },
        },

        // =============== Relations ===============
        {
            name: "branch_id",
            type: "async-select",
            label: "Branch *",
            visibility:
                form.watch("scope_type") === "company" ||
                form.watch("scope_type") === "project",
            loadOptions: [
                "organization/branches",
                "branches",
                "branchSearchTemplate",
            ],
            placeholder: "Select",
            firstChildren:
                user?.employee || form.watch("scope_type") === "project"
                    ? []
                    : [{ label: "All Branch", value: "all-branch" }],
            colSpan: "col-span-12 md:col-span-6",
            rules: { required: "Branch is required" },
        },
        {
            name: "department_id",
            type: "async-select",
            label: "Department",
            visibility: form.watch("scope_type") === "company",
            loadOptions: [
                "organization/departments",
                "departments",
                "departmentSearchTemplate",
                ["branch_id", "scope_type"],
            ],
            placeholder: "Optional",
            colSpan: "col-span-12 md:col-span-6",
        },
        {
            name: "project_id",
            type: "async-select",
            label: "Project *",
            visibility: form.watch("scope_type") === "project",
            loadOptions: [
                "projects",
                "projects",
                "projectTemplate",
                ["branch_id", "scope_type"],
            ],
            placeholder: "Select",
            colSpan: "col-span-12 md:col-span-6",
            rules: {
                validate: (value, formValues) => {
                    if (formValues.scope_type === "project" && !value) {
                        return "Project is required for project wise salary generation";
                    }
                    return true;
                },
            },
        },

        // =============== Salary Month ===============
        {
            name: "salary_month",
            type: "month",
            label: "Salary Month *",
            colSpan: "col-span-12 md:col-span-6",
            inputProps: { type: "month" },
            handleChange: (e) => {
                const val = e?.target?.value ?? e?.value ?? e;
                form.setValue("salary_month", val);
                form.setValue("payroll_week", null, { shouldValidate: true, shouldDirty: true });
                form.setValue("from_date", null, { shouldValidate: true, shouldDirty: true });
                form.setValue("to_date", null, { shouldValidate: true, shouldDirty: true });
            },
            rules: { required: "Salary month is required" },
        },

        // =============== Weekly Payroll Week Dropdown ===============
        {
            name: "payroll_week",
            type: "select",
            label: `Select Payroll Week (${weekStartDay.charAt(0).toUpperCase() + weekStartDay.slice(1)} Start) *`,
            placeholder: "Select payroll week",
            visibility: paymentFrequency === "weekly",
            colSpan: "col-span-12 md:col-span-6",
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
            rules: {
                validate: (value, formValues) => {
                    if (formValues.payment_frequency === "weekly" && !value) {
                        return "Payroll week is required for weekly salary generation";
                    }
                    return true;
                },
            },
        },

        // =============== Locked/Disabled From & To Date Fields ===============
        {
            name: "from_date",
            type: "date",
            label: "From Date (Locked) *",
            visibility: paymentFrequency === "weekly",
            colSpan: "col-span-12 md:col-span-6",
            inputProps: { type: "date", disabled: true, readOnly: true },
            disabled: true,
            rules: {
                validate: (value, formValues) => {
                    if (formValues.payment_frequency === "weekly" && !value) {
                        return "From Date is required for weekly salary generation";
                    }
                    return true;
                },
            },
        },
        {
            name: "to_date",
            type: "date",
            label: "To Date (Locked) *",
            visibility: paymentFrequency === "weekly",
            colSpan: "col-span-12 md:col-span-6",
            inputProps: { type: "date", disabled: true, readOnly: true },
            disabled: true,
            rules: {
                validate: (value, formValues) => {
                    if (formValues.payment_frequency === "weekly") {
                        if (!value) {
                            return "To Date is required for weekly salary generation";
                        }
                        if (formValues.from_date && value < formValues.from_date) {
                            return "To Date cannot be before From Date";
                        }
                    }
                    return true;
                },
            },
        },

        // =============== Additional Details ===============
        {
            name: "notes",
            type: "textarea",
            label: "Notes",
            placeholder: "Optional notes for this salary record…",
            colSpan: "col-span-12",
        },
    ];
};

export default fields;
