import toast from "react-hot-toast";
import useAuth from "@/domains/auth/hooks/useAuth";
import { branchSearchTemplate } from "@/utility/templateHelper";

const fields = (actions, form) => {
    const { user } = useAuth();

    if (form?.watch("model_for") === "single_edit") {
        return [
            {
                name: "check_in_time",
                type: "date",
                label: "Check-in Time *",
                placeholder: "Select check-in time",
                colSpan: "col-span-12 md:col-span-6",
                inputProps: { type: "time" },
                rules: { required: "Check-in time is required" },
            },
            {
                name: "check_out_time",
                type: "date",
                label: "Check-out Time *",
                placeholder: "Select check-out time",
                colSpan: "col-span-12 md:col-span-6",
                inputProps: { type: "time" },
            },
        ];
    }

    if (form?.watch("model_for") === "bulk_approve_manual_attendance") {
        return [
            {
                name: "approval_status",
                type: "hidden",
                defaultValue: "pending",
                visibility: false,
            },
            {
                name: "process_button",
                type: "button",
                placeholder: "Process Pending Attendance",
                colSpan: "col-span-12 md:col-span-4",
                handleChange: (e, form) => {
                    setTimeout(() => {
                        if (form._paginatedLoaders?.employees) {
                            form._paginatedLoaders.employees();
                        } else {
                            console.warn(
                                "Paginated loader not found for employees",
                            );
                        }
                    }, 100);
                },
            },
            {
                name: "employees",
                type: "group-form-paginated",
                label: "Pending Manual Attendance (checked employees will be approved; unchecked employees will be excluded)",
                colSpan: "col-span-12",
                addButtonLabel: false,
                isDelete: false,
                maxHeight: "400px",
                loadMoreLabel: "Load More Attendance",
                perPage: 10,
                autoLoad: false,
                enableSearch: true,
                searchPlaceholder: "Search by employee name, code, email, or phone...",
                loadOptions: [
                    "hrm/manual-attendance",
                    "master_attendances",
                    (attendance) => {
                        const employee = attendance.employee || {};
                        const masterAttendance =
                            attendance.master_attendance || {};
                        const employeeName =
                            employee.personal_info?.full_name ||
                            [employee.first_name || "", employee.last_name || ""]
                                .join(" ")
                                .trim() ||
                            employee.name ||
                            "Unknown";

                        return {
                            id: `${attendance.master_attendance_id || attendance.id}-${attendance.employee_id}-${attendance.date}`,
                            master_attendance_id:
                                attendance.master_attendance_id ||
                                masterAttendance.id,
                            employee_id: attendance.employee_id,
                            employee_name: employeeName,
                            employee_code:
                                employee.employee_code ||
                                employee.personal_info?.employee_code ||
                                "N/A",
                            date: attendance.date || "",
                            check_in_time: attendance.check_in_time || "",
                            check_out_time: attendance.check_out_time || "",
                            approval_status:
                                attendance.approval_status || "pending",
                        };
                    },
                    ["approval_status"],
                ],
                fields: [
                    {
                        name: "is_selected",
                        type: "checkbox",
                        label: "Select",
                        colSpan: "col-span-12 md:col-span-1",
                    },
                    {
                        name: "employee_name",
                        type: "text",
                        label: "Employee Name",
                        colSpan: "col-span-12 md:col-span-3",
                        disabled: true,
                    },
                    {
                        name: "employee_code",
                        type: "text",
                        label: "Employee Code",
                        colSpan: "col-span-12 md:col-span-2",
                        disabled: true,
                    },
                    {
                        name: "date",
                        type: "date",
                        label: "Attendance Date",
                        colSpan: "col-span-12 md:col-span-2",
                        disabled: true,
                    },
                    {
                        name: "check_in_time",
                        type: "date",
                        label: "Check-in",
                        colSpan: "col-span-12 md:col-span-2",
                        inputProps: { type: "time" },
                        disabled: true,
                    },
                    {
                        name: "check_out_time",
                        type: "date",
                        label: "Check-out",
                        colSpan: "col-span-12 md:col-span-2",
                        inputProps: { type: "time" },
                        disabled: true,
                    },
                ],
            },
        ];
    }

    return [
        {
            name: "attendance_type",
            type: "select",
            label: "Attendance For *",
            colSpan: "col-span-12 md:col-span-6",
            options: [
                {
                    label: "Company wise Attendance",
                    value: "company_attendance",
                },
                {
                    label: "Project wise Attendance",
                    value: "project_attendance",
                },
            ],
            handleChange: (e) => {
                form.setValue("attendance_type", e.value);
                form.setValue(
                    "branch_id",
                    branchSearchTemplate(
                        user?.employee?.branch ? [user?.employee?.branch] : [],
                    )?.at(0) ?? null,
                );
                form.setValue("department_id", null);
                form.setValue("project_id", null);
            },
            disabled: form.watch("id"),
            rules: { required: "Status is required" },
        },
        {
            name: "adjustment_type",
            type: "select",
            label: "Adjustment Type *",
            placeholder: "Select adjustment type",
            colSpan: "col-span-12 md:col-span-6",
            visibility: form?.watch("model_for") == "adjust_hours",
            options: [
                { label: "Increment", value: "increment" },
                { label: "Decrement", value: "decrement" },
            ],
            rules: { required: "Adjustment type is required" },
        },
        {
            name: "branch_id",
            type: "async-select",
            label: "Branch *",
            visibility: form.watch("attendance_type") === "company_attendance",
            loadOptions: [
                "organization/branches",
                "branches",
                "branchSearchTemplate",
            ],
            placeholder: "Select",
            colSpan: "col-span-12 md:col-span-6",
            handleChange: (e) => {
                form.setValue("branch_id", e);
                actions.onAttendanceTypeChange();
            },
            disabled: form.watch("id"),
        },
        {
            name: "department_id",
            type: "async-select",
            label: "Department",
            visibility: form.watch("attendance_type") === "company_attendance",
            loadOptions: [
                "organization/departments",
                "departments",
                "departmentSearchTemplate",
                "branch_id",
            ],
            handleChange: (e) => {
                form.setValue("department_id", e);
                actions.onAttendanceTypeChange();
            },
            disabled: form.watch("id"),
            placeholder: "Optional",
            colSpan: "col-span-12 md:col-span-6",
        },
        {
            name: "project_id",
            type: "async-select",
            label: "Project",
            visibility: form.watch("attendance_type") === "project_attendance",
            loadOptions: ["projects", "projects", "projectTemplate"],
            handleChange: (e) => {
                form.setValue("project_id", e);
                actions.onAttendanceTypeChange();
            },
            disabled: form.watch("id"),
            placeholder: "Optional",
            colSpan: "col-span-12 md:col-span-6",
        },
        {
            name: "attendance_scope", // renamed
            type: "select",
            label: "Attendance Scope *",
            colSpan: "col-span-12 md:col-span-6",
            options: [
                {
                    label: "All Attendance",
                    value: "all_attendance",
                },
                {
                    label: "Single Attendance",
                    value: "single_attendance",
                },
            ],
            handleChange: (e) => {
                form.setValue("attendance_scope", e.value);

                // Clear single_attendance if switching to all attendance
                if (e.value === "all_attendance") {
                    form.setValue("single_attendance", null);
                }
            },
            disabled: form.watch("id"),
            rules: { required: "Attendance scope is required" },
        },
        {
            name: "salary_type", // renamed
            type: "select",
            label: "Salary type *",
            colSpan: "col-span-12 md:col-span-6",
            options: [
                {
                    label: "Hourly",
                    value: "hourly",
                },
                {
                    label: "Weekly",
                    value: "weekly",
                },
                {
                    label: "Monthly",
                    value: "monthly",
                },
            ],
            handleChange: (e) => {
                const val = e?.target?.value ?? e?.value ?? e;
                form.setValue("salary_type", val);
                form.setValue("single_attendance", null);
                actions.onAttendanceTypeChange();
            },
            disabled: form.watch("id"),
            rules: { required: "Salary type is required" },
        },
        {
            name: "single_attendance",
            type: "async-select",
            label: "Single Attendance",
            visibility: form.watch("attendance_scope") === "single_attendance",
            loadOptions: [
                "hrm/filter-employees",
                "employees",
                "employTemplate",
                ["department_id", "branch_id", "project_id", "salary_type"],
            ],
            handleChange: (value) => {
                const existingEmployees = form.getValues("employees") || [];
                console.log(existingEmployees);

                const exists = existingEmployees.some(
                    (emp) => emp.employee_id === value.value,
                );

                if (exists) {
                    toast.error("Employee already assigned!");
                } else {
                    // Append new employee assignment with pre-filled data
                    form.fields.append({
                        name: `${value.label}`,
                        employee_id: value.value,
                        date: form.getValues("global_date") || "",
                        check_in_time: form.getValues("global_check_in_time") || "",
                        check_out_time: form.getValues("global_check_out_time") || "",
                    });
                }
            },
            placeholder: "Select employee",
            colSpan: "col-span-12 md:col-span-6",
        },

        // Global Settings Section
        {
            name: "global_date",
            type: "date",
            label: "Global Date *",
            placeholder: "Select attendance date",
            colSpan: "col-span-12 md:col-span-4",
            inputProps: { type: "date" },
            handleChange: (value, form) => {
                console.log(value);
                // Apply global date to all employees
                const employees = form.getValues("employees") || [];
                employees.forEach((_, index) => {
                    form.setValue(`employees.${index}.date`, value, {
                        shouldDirty: true,
                    });
                });
                form.trigger("employees"); // Trigger validation/re-render
                toast.success("Global date applied to all employees");
            },
            rules: { required: "Global date is required" },
        },
        {
            name: "global_check_in_time",
            type: "date",
            label: "Global Check-in Time *",
            placeholder: "Select global check-in time",
            colSpan: "col-span-12 md:col-span-4",
            inputProps: { type: "time" },
            note:
                form.watch("attendance_scope") === "all_attendance"
                    ? "When attendance scope is All Attendance, check-in times will be spread randomly within 5 minutes of the selected time."
                    : "",
            handleChange: (value, form) => {
                // Apply global check-in time to all employees
                const employees = form.getValues("employees") || [];
                employees.forEach((_, index) => {
                    form.setValue(`employees.${index}.check_in_time`, value, {
                        shouldDirty: true,
                    });
                });
                form.trigger("employees"); // Trigger validation/re-render
                toast.success("Global check-in time applied to all employees");
            },
            rules: { required: "Global check-in time is required" },
        },
        {
            name: "global_check_out_time",
            type: "date",
            label: "Global Check-out Time *",
            placeholder: "Select global check-out time",
            colSpan: "col-span-12 md:col-span-4",
            inputProps: { type: "time" },
            handleChange: (value, form) => {
                // Apply global check-out time to all employees
                const employees = form.getValues("employees") || [];
                employees.forEach((_, index) => {
                    form.setValue(`employees.${index}.check_out_time`, value, {
                        shouldDirty: true,
                    });
                });
                form.trigger("employees"); // Trigger validation/re-render
                toast.success("Global check-out time applied to all employees");
            },
            rules: { required: "Global check-out time is required" },
        },

        {
            name: "employees",
            type: "group-form",
            label: "Employee Attendance",
            placeholder: "Add employees for attendance",
            colSpan: `col-span-12 ${form.watch("attendance_scope") == "all_attendance" ? "hidden" : ""}`,
            addButtonLabel: false,
            fields: [
                {
                    name: "name",
                    type: "text",
                    label: "Employee Name *",
                    placeholder: "Enter employee name",
                    colSpan: "col-span-12 md:col-span-3",
                    rules: { required: "Employee name is required" },
                },
                {
                    name: "date",
                    type: "date",
                    label: "Attendance Date *",
                    placeholder: "Select date",
                    colSpan: "col-span-12 md:col-span-3",
                    inputProps: { type: "date" },
                    rules: { required: "Date is required" },
                },
                {
                    name: "check_in_time",
                    type: "date",
                    label: "Check-in Time *",
                    placeholder: "Select check-in time",
                    colSpan: "col-span-12 md:col-span-3",
                    inputProps: { type: "time" },
                    rules: { required: "Check-in time is required" },
                },
                {
                    name: "check_out_time",
                    type: "date",
                    label: "Check-out Time *",
                    placeholder: "Select check-out time",
                    colSpan: "col-span-12 md:col-span-3",
                    inputProps: { type: "time" },
                    rules: { required: "Check-out time is required" },
                },
            ],
        },
    ];
};

export default fields;
