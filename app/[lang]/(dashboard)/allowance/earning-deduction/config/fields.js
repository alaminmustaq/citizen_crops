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
    const isDelete =
        form.watch("model_for") === "delete_group_earning_deduction"; // 🔑 detect view mode

    // Prepare employee details load option
    let preparedLoadOptions = [];
    if (form.watch("model_for") === "delete_group_earning_deduction") {
        preparedLoadOptions = [
            "allowance/earning_deduction", // API URL
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
                amount: employee.earning_deduction?.amount || "", // <-- match backend
                status:
                    employee.earning_deduction?.status == 1
                        ? "active"
                        : "inactive", // <-- match backend
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
            name: "type",
            type: "select",
            label: "Type *",
            placeholder: "Select type",
            colSpan: "col-span-12 md:col-span-4",
            options: [
                { label: "Earning", value: "earning" },
                { label: "Deduction", value: "deduction" },
            ],
            rules: {
                required: "Type is required",
            },
        },
        {
            name: "allowance_type_id",
            type: "async-select",
            label: "Allowance Type *",
            loadOptions: [
                "allowance/allowance_type",
                "allowance_types",
                "leaveTypeSearchTemplate",
                "type",
            ],
            placeholder: "Select",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView,
            rules: { required: "Allowance type is required" },
        },
        {
            name: "scope_type",
            type: "select",
            label: "Scope Type *",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView,
            options: [
                { label: "Company wise allowance", value: "company" },
                { label: "Project wise allowance", value: "project" },
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
            name: "job_position_id",
            type: "async-select",
            label: "Job Position",
            colSpan: "col-span-12 md:col-span-4",
            loadOptions: [
                "organization/job-positions",
                "job_positions",
                "jobPositionsTemplate",
                ["branch_id", "project_id", "department_id"],
            ],
        },
        // {
        //     name: "status",
        //     type: "select",
        //     label: "Status *",
        //     colSpan: "col-span-12 md:col-span-4",
        //     options: [
        //         { label: "Approve", value: "approved" },
        //         { label: "Reject", value: "rejected" },
        //     ],
        //     visibility: form.watch("model_for") == "delete_group_earning_deduction",
        //     rules: { required: "Status is required" },
        // },
        {
            name: "amount",
            type: "number",
            label: "Amount",
            visibility: isEdit,
            colSpan: "col-span-12 md:col-span-3",
            inputProps: { min: 0, step: "0.01", type: "number" },
        },
        {
            name: "status",
            type: "select",
            label: "Status *",
            placeholder: "Select status",
            colSpan: "col-span-12 md:col-span-4",
            visibility: isEdit,
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
            ],
            rules: {
                required: "Status is required",
            },
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
            colSpan: "col-span-12 md:col-span-3",
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
            rules: { required: "Global amount is required" },
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
            label: `Employee Details (Check to ${isDelete ? "exclude" : "include"} employee in earning deduction)`,
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
                    colSpan: "col-span-12 md:col-span-4",
                    disabled: true,
                },
                {
                    name: "amount",
                    type: "number",
                    label: "Amount",
                    colSpan: "col-span-12 md:col-span-3",
                    disabled: isDelete,
                    inputProps: { min: 0, step: "0.01", type: "number" },
                },
                {
                    name: "status",
                    type: "select",
                    label: "Status *",
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
