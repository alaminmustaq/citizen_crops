import toast from "react-hot-toast";
import useAuth from "@/domains/auth/hooks/useAuth";
import {
    branchSearchTemplate,
    departmentSearchTemplate,
} from "@/utility/templateHelper";

const fields = (form, actions) => {
    const { user } = useAuth();
    const roleLevel = user?.user?.roles?.[0]?.level ?? null;
    const level = Number(roleLevel);

    // console.log(user?.employee?.id);
    // console.log(form.watch("amount_type"));

    const currentUserType = form.watch("user_type");

    if (currentUserType !== "responsible") {
        form.setValue("user_type", "responsible", { shouldDirty: false });
    }

    const employee_user_type = form.watch("employee_user_type");

    if (employee_user_type !== "assigned") {
        form.setValue("employee_user_type", "assigned", { shouldDirty: false });
    }

    // const NotPaginate = form.watch("not_paginate");

    // if (!NotPaginate) {
    //     form.setValue("not_paginate", true, { shouldDirty: false });
    // }

    const isView = form.watch("mode") === "view"; // 🔑 detect view mode
    const isEdit = form.watch("mode") === "edit"; // 🔑 detect view mode
    const isDelete = form.watch("model_for") === "delete_group_punishment"; // 🔑 detect view mode

    // Prepare employee details load option
    let preparedLoadOptions = [];
    if (form.watch("model_for") === "delete_group_punishment") {
        preparedLoadOptions = [
            "punishment/punishment_general", // API URL
            "items", // dataKey in response
            (item) => {
                // data mapper
                const employee = item.employee || {};

                return {
                    id: item.id,
                    employee_name:
                        [employee.first_name || "", employee.last_name || ""]
                            .join(" ")
                            .trim() || "Unknown",
                    employee_code: employee.employee_code || "N/A",
                    amount: item.amount ?? 0,
                    status: item.status == 1 ? "active" : "inactive",
                };
            },
            // fields to filter by from the form
            [
                "project_id",
                "branch_id",
                "department_id",
                "job_position_id",
                "allowance_type_id",
                "scope_type",
                "status",
                "type",
                "model_for",
            ],
        ];
    } else {
        preparedLoadOptions = [
            "hrm/employees", // URL
            "employees", // dataKey in response
            // dataMapper function
            (employee) => ({
                id: employee.id,
                employee_name:
                    employee.personal_info?.full_name ||
                    `${employee.personal_info?.first_name || ""} ${employee.personal_info?.last_name || ""}`.trim() ||
                    employee.first_name ||
                    "Unknown",
                employee_email:
                    employee.contact_info?.work_email ||
                    employee.contact_info?.primary_email ||
                    employee.work_email ||
                    "",
                employee_phone:
                    employee.contact_info?.primary_phone ||
                    employee.primary_phone ||
                    "",
                amount: employee.punishment?.amount || "", // <-- match backend
                status:
                    employee.punishment?.status == 1 ? "active" : "inactive", // <-- match backend
            }),

            // filterFields - fields to use as filters from form
            [
                "branch_id",
                `${
                    form.watch("scope_type") == "company"
                        ? "department_id"
                        : "project_id"
                }`,

                "employee_type",
                "job_position_id",
                "allowance_type_id",
            ],
        ];
    }

    return [
        {
            name: "punishment_type_id",
            type: "async-select",
            label: "Punishment Type *",
            loadOptions: [
                "punishment/punishment_type",
                "punishment_types",
                "leaveTypeSearchTemplate",
            ],
            placeholder: "Select",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView,
            rules: { required: "Punishment type is required" },
        },
        {
            name: "scope_type",
            type: "select",
            label: "Scope Type *",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView,
            options: [
                { label: "Company wise punishment", value: "company" },
                { label: "Project wise punishment", value: "project" },
            ],
            handleChange: (e) => {
                if (isView) return; // prevent changes in view mode
                form.setValue("scope_type", e.value);
                form.setValue(
                    "branch_id",
                    branchSearchTemplate(
                        user?.employee?.branch ? [user?.employee?.branch] : [],
                    )?.at(0) ?? null,
                );
                form.setValue(
                    "department_id",
                    departmentSearchTemplate(
                        user?.employee?.department
                            ? [user?.employee?.department]
                            : [],
                    )?.at(0) ?? null,
                );
                console.log(user?.employee);

                form.setValue("employee_ids", null);
                form.setValue("project_id", null);
                if (e.value === "project") {
                    form.setValue("employee_id", user?.employee?.id);
                }
                if (form.watch("scope_type") == "company") {
                    form.setValue("employee_type", "company");
                } else if (form.watch("scope_type") == "project") {
                    form.setValue("employee_type", "project");
                }
            },
            rules: { required: "Type is required" },
        },
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
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView,
            rules: {
                validate: (value) => {
                    if (user?.employee?.branch && !value) {
                        return "Branch is required";
                    }
                    return true;
                },
            },
        },
        {
            name: "department_id",
            type: "async-select",
            label: `Department${user?.employee?.department ? " *" : ""}`,
            visibility: form.watch("scope_type") === "company",
            loadOptions: [
                "organization/departments",
                "departments",
                "departmentSearchTemplate",
                ["branch_id", "scope_type"],
            ],
            placeholder: "Optional",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView,
            rules: {
                validate: (value) => {
                    if (user?.employee?.branch && !value) {
                        return "Branch is required";
                    }
                    return true;
                },
            },
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
                ["branch_id", "employee_id", "scope_type", "user_type"],
            ],
            placeholder: "Select",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView,
        },
        {
            name: "punishment_month",
            type: "month",
            label: "Month *",
            visibility: isEdit,
            colSpan: "col-span-12 md:col-span-4",
            inputProps: { type: "month" }, // controlled by RHF
            rules: { required: "Month is required" },
        },
        {
            name: "effective_date",
            type: "date",
            label: "Effective Date *",
            visibility: isEdit,
            colSpan: "col-span-12 md:col-span-4",
            rules: { required: "Month is required" },
        },
        {
            name: "status",
            type: "select",
            label: "Status *",
            visibility: isEdit,
            placeholder: "Select status",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isDelete,
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
            ],
            rules: {
                required: "Status is required",
            },
        },
        {
            name: "amount_type",
            type: "select",
            label: "Amount Type *",
            visibility: isEdit,
            placeholder: "Select amount type",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isDelete,
            options: [
                { label: "Fixed", value: "fixed" },
                { label: "Basic (%)", value: "basic" },
                { label: "Gross (%)", value: "gross" },
            ],
            handleChange: (e) => {
                form.setValue(`amount_type`, e.value);

                // 🧹 Clear opposite field
                if (e.value === "fixed") {
                    form.setValue(`no_of_day`, null);
                } else {
                    form.setValue(`amount`, null);
                }
            },
            rules: { required: "Amount type is required" },
        },
        {
            name: "amount",
            type: "number",
            label: "Amount",
            colSpan: "col-span-12 md:col-span-4",
            visibility: isEdit && form.watch(`amount_type`) == "fixed",
            disabled: isDelete,
            inputProps: { min: 0, step: "0.01", type: "number" },
        },

        {
            name: "no_of_day",
            type: "number",
            label: "Number of days",
            colSpan: "col-span-12 md:col-span-4",
            visibility:
                (isEdit && form.watch(`amount_type`) == "basic") ||
                form.watch(`amount_type`) == "gross",
            disabled: isDelete,
            inputProps: { min: 0, step: "0.01", type: "number" },
        },
        {
            name: "global_amount",
            type: "number",
            label: "Global Amount",
            visibility:
                (form.watch("scope_type") === "company" ||
                    form.watch("scope_type") === "project") &&
                !isEdit &&
                !isDelete,
            colSpan: "col-span-12 md:col-span-4",
            inputProps: { min: 0, step: "0.01", type: "number" },
            handleChange: (value, form) => {
                console.log("Global amount applied:", value);

                // Apply the global amount to all employees in the paginated group
                const employees = form.getValues("employee_details") || [];
                employees.forEach((_, index) => {
                    form.setValue(`employee_details.${index}.amount`, value, {
                        shouldDirty: true,
                    });
                });

                // Trigger validation and re-render for the employee_details field
                form.trigger("employee_details");

                toast.success("Global amount applied to all employees");
            },
        },
        {
            name: "global_no_of_day",
            type: "number",
            label: "Global Number of days",
            colSpan: "col-span-12 md:col-span-4",
            inputProps: { min: 0, step: "0.01", type: "number" },
            visibility:
                (form.watch("scope_type") === "company" ||
                    form.watch("scope_type") === "project") &&
                !isEdit &&
                !isDelete,
            handleChange: (value, form) => {
                console.log("Global number of days applied:", value);

                const employees = form.getValues("employee_details") || [];

                employees.forEach((_, index) => {
                    const type = form.getValues(
                        `employee_details.${index}.amount_type`,
                    );
                    // Only update rows with basic or gross
                    if (type === "basic" || type === "gross") {
                        form.setValue(
                            `employee_details.${index}.no_of_day`,
                            value,
                            {
                                shouldDirty: true,
                            },
                        );
                    }
                });

                // Re-trigger validation and re-render
                form.trigger("employee_details");

                toast.success(
                    "Global number of days applied to all relevant employees",
                );
            },
        },
        {
            name: "global_punishment_month",
            type: "month",
            label: "Global Month",
            colSpan: "col-span-12 md:col-span-4",
            inputProps: { type: "month" }, // controlled by RHF
            visibility:
                (form.watch("scope_type") === "company" ||
                    form.watch("scope_type") === "project") &&
                !isEdit &&
                !isDelete,
            handleChange: (value, form) => {
                console.log("Global month applied:", value);

                // Update the global month itself
                form.setValue("global_punishment_month", value, {
                    shouldDirty: true,
                });

                // Get all employee rows
                const employees = form.getValues("employee_details") || [];

                // Update each employee's month
                employees.forEach((_, index) => {
                    form.setValue(
                        `employee_details.${index}.punishment_month`,
                        value,
                        {
                            shouldDirty: true,
                        },
                    );
                });

                // Trigger re-validation for employee_details
                form.trigger("employee_details");

                toast.success("Global month applied to all employees");
            },
        },
        {
            name: "global_effective_date",
            type: "date",
            label: "Global Effective Date",
            colSpan: "col-span-12 md:col-span-4",
            visibility:
                (form.watch("scope_type") === "company" ||
                    form.watch("scope_type") === "project") &&
                !isEdit &&
                !isDelete,
            handleChange: (value, form) => {
                // Update the global month itself
                form.setValue("global_effective_date", value, {
                    shouldDirty: true,
                });

                // Get all employee rows
                const employees = form.getValues("employee_details") || [];

                // Update each employee's month
                employees.forEach((_, index) => {
                    form.setValue(
                        `employee_details.${index}.effective_date`,
                        value,
                        {
                            shouldDirty: true,
                        },
                    );
                });

                // Trigger re-validation for employee_details
                form.trigger("employee_details");

                toast.success("Global effective date applied to all employees");
            },
        },

        {
            name: "process_button",
            type: "button",
            placeholder: "Process Holiday",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView,
            visibility:
                (form.watch("scope_type") === "company" ||
                    form.watch("scope_type") === "project") &&
                !isEdit,
            handleChange: (e, form) => {
                // Trigger the paginated component to load data
                // Use setTimeout to ensure component is mounted
                setTimeout(() => {
                    if (
                        form._paginatedLoaders &&
                        form._paginatedLoaders.employee_details
                    ) {
                        form._paginatedLoaders.employee_details();
                    } else {
                        console.warn(
                            "Paginated loader not found for employee_details",
                        );
                    }
                }, 100);
            },
        },
        // ===== Dynamic Employee Details with Pagination =====
        {
            name: "employee_details",
            type: "group-form-paginated",
            label: "Employee Details (Check to include employee in punishment)",
            colSpan: "col-span-12",
            addButtonLabel: false,
            isDelete: false,
            maxHeight: "400px",
            loadMoreLabel: "Load More Employees",
            perPage: 10,
            autoLoad: false, // Will be triggered by Process button
            enableSearch: true,
            searchPlaceholder: "Search employees by name, email, or phone...",

            visibility:
                (form.watch("scope_type") === "company" ||
                    form.watch("scope_type") === "project") &&
                !isEdit,
            loadOptions: preparedLoadOptions,
            fields: [
                {
                    name: "is_selected",
                    type: "checkbox",
                    label: "Select",
                    colSpan: "col-span-12 md:col-span-1",
                    disabled: isView,
                },
                {
                    name: "employee_name",
                    type: "text",
                    label: "Employee Name",
                    colSpan: "col-span-12 md:col-span-2",
                    disabled: true,
                },
                {
                    name: "punishment_month",
                    type: "month",
                    label: "Month *",
                    colSpan: "col-span-12 md:col-span-2",
                    inputProps: { type: "month" }, // controlled by RHF
                    rules: { required: "Month is required" },
                },
                {
                    name: "effective_date",
                    type: "date",
                    label: "Effective Date *",
                    colSpan: "col-span-12 md:col-span-2",
                    rules: { required: "Month is required" },
                },
                {
                    name: "amount_type",
                    type: "select",
                    label: "Amount Type *",
                    placeholder: "Select amount type",
                    colSpan: "col-span-12 md:col-span-3",
                    disabled: isDelete,
                    options: [
                        { label: "Fixed", value: "fixed" },
                        { label: "Basic (%)", value: "basic" },
                        { label: "Gross (%)", value: "gross" },
                    ],
                    handleChange: (e, forms, index) => {
                        const base = `employee_details.${index}`;

                        form.setValue(`${base}.amount_type`, e.value);

                        // 🧹 Clear opposite field
                        if (e.value === "fixed") {
                            form.setValue(`${base}.no_of_day`, null);
                        } else {
                            form.setValue(`${base}.amount`, null);
                        }
                    },
                    rules: { required: "Amount type is required" },
                },

                {
                    name: "amount",
                    type: "number",
                    label: "Amount",
                    colSpan: "col-span-12 md:col-span-2",
                    visibility: (index) =>
                        form.watch(`employee_details.${index}.amount_type`) ==
                        "fixed",
                    disabled: isDelete,
                    inputProps: { min: 0, step: "0.01", type: "number" },
                },

                {
                    name: "no_of_day",
                    type: "number",
                    label: "Number of days",
                    colSpan: "col-span-12 md:col-span-2",
                    visibility: (index) =>
                        form.watch(`employee_details.${index}.amount_type`) ==
                            "basic" ||
                        form.watch(`employee_details.${index}.amount_type`) ==
                            "gross",
                    disabled: isDelete,
                    inputProps: { min: 0, step: "0.01", type: "number" },
                },
                {
                    name: "status",
                    type: "select",
                    label: "Status *",
                    placeholder: "Select status",
                    colSpan: "col-span-12 md:col-span-2",
                    disabled: isDelete,
                    options: [
                        { label: "Active", value: "active" },
                        { label: "Inactive", value: "inactive" },
                    ],
                    rules: {
                        required: "Status is required",
                    },
                },
                {
                    name: "employee_id",
                    type: "text",
                    label: "Employee ID",
                    colSpan: "col-span-12 md:col-span-6",
                    disabled: true,
                    visibility: false,
                },
            ],
        },
    ];
};

export default fields;
