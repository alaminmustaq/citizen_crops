import toast from "react-hot-toast";
import useAuth from "@/domains/auth/hooks/useAuth";
import {
    branchSearchTemplate,
    departmentSearchTemplate,
} from "@/utility/templateHelper";

const fields = (form, actions) => {
    const { user } = useAuth();

    const isView = form.watch("mode") === "view";
    const isEdit = form.watch("mode") === "edit";

    // Prepare employee details load option
    const preparedLoadOptions = [
        "hrm/employees", // URL
        "employees", // dataKey in response
        // dataMapper function
        (employee) => ({
            id: employee.id,
            employee_id: employee.id,
            employee_name:
                `${employee.personal_info?.first_name || ""} ${employee.personal_info?.last_name || ""}`.trim() ||
                employee.first_name ||
                "Unknown",
            status: "active", // Default status for new entries
            amount_type: "basic", // Default amount type
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
        ],
    ];

    return [
        {
            name: "scope_type",
            type: "select",
            label: "Scope Type *",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView,
            options: [
                { label: "Company wise", value: "company" },
                { label: "Project wise", value: "project" },
            ],
            handleChange: (e) => {
                if (isView) return;
                form.setValue("scope_type", e.value);

                // Clear filters
                form.setValue("employee_ids", null);
                form.setValue("project_id", null);
                form.setValue("department_id", null);

                // Set employee_type for backend filtering
                if (e.value === "company") {
                    form.setValue("employee_type", "company");
                } else if (e.value === "project") {
                    form.setValue("employee_type", "project");
                }

                // Set default branch for current user
                form.setValue(
                    "branch_id",
                    branchSearchTemplate(
                        user?.employee?.branch ? [user?.employee?.branch] : [],
                    )?.at(0) ?? null,
                );
            },
            rules: { required: "Scope Type is required" },
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
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView,
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
                ["branch_id", "employee_id", "scope_type"],
            ],
            placeholder: "Select",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView,
            rules: { required: "Project is required" },
        },

        // Single Edit Mode Fields
        {
            name: "amount",
            type: "number",
            label: "Amount (Per Hour) *",
            visibility: isEdit,
            colSpan: "col-span-12 md:col-span-4",
            inputProps: { min: 0, step: "0.01", type: "number" },
            rules: { required: "Amount is required" },
        },
        {
            name: "amount_type",
            type: "select",
            label: "Amount Type *",
            visibility: isEdit,
            colSpan: "col-span-12 md:col-span-4",
            options: [
                { label: "Fixed", value: "fixed" },
                { label: "Basic", value: "basic" },
            ],
            rules: { required: "Amount Type is required" },
        },
        {
            name: "status",
            type: "select",
            label: "Status",
            visibility: isEdit,
            colSpan: "col-span-12 md:col-span-4",
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
            ],
        },

        // Global Fields for Create Mode (Bulk)
        {
            name: "global_amount",
            type: "number",
            label: "Global Amount (Per Hour)",
            colSpan: "col-span-12 md:col-span-4",
            inputProps: { min: 0, step: "0.01", type: "number" },
            visibility:
                (form.watch("scope_type") === "company" ||
                    form.watch("scope_type") === "project") &&
                !isEdit,
            handleChange: (value) => {
                const employees = form.getValues("employee_details") || [];
                employees.forEach((_, index) => {
                    form.setValue(`employee_details.${index}.amount`, value, {
                        shouldDirty: true,
                    });
                });
                form.trigger("employee_details");
                toast.success("Global amount applied to all employees");
            },
        },
        {
            name: "global_amount_type",
            type: "select",
            label: "Global Amount Type",
            colSpan: "col-span-12 md:col-span-4",
            options: [
                { label: "Fixed", value: "fixed" },
                { label: "Basic", value: "basic" },
            ],
            visibility:
                (form.watch("scope_type") === "company" ||
                    form.watch("scope_type") === "project") &&
                !isEdit,
            handleChange: (e) => {
                const value = e?.value;
                if (!value) return;
                const employees = form.getValues("employee_details") || [];
                employees.forEach((_, index) => {
                    form.setValue(
                        `employee_details.${index}.amount_type`,
                        value,
                        {
                            shouldDirty: true,
                        },
                    );
                });
                form.trigger("employee_details");
                toast.success("Global amount type applied to all employees");
            },
        },

        {
            name: "process_button",
            type: "button",
            placeholder: "Load Employees",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView,
            visibility:
                (form.watch("scope_type") === "company" ||
                    form.watch("scope_type") === "project") &&
                !isEdit,
            handleChange: (e, form) => {
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
            label: "Employee Details (Check to exclude employee from overtime)",
            colSpan: "col-span-12",
            addButtonLabel: false,
            isDelete: false,
            maxHeight: "400px",
            loadMoreLabel: "Load More Employees",
            perPage: 10,
            autoLoad: false,
            enableSearch: true,
            searchPlaceholder: "Search employees...",

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
                    colSpan: "col-span-12 md:col-span-3",
                    disabled: true,
                },
                {
                    name: "amount",
                    type: "number",
                    label: "Amount(Hr) *",
                    colSpan: "col-span-12 md:col-span-2",
                    inputProps: { min: 0, step: "0.01", type: "number" },
                    rules: { required: "Required" },
                },
                {
                    name: "amount_type",
                    type: "select",
                    label: "Type *",
                    colSpan: "col-span-12 md:col-span-3",
                    options: [
                        { label: "Fixed", value: "fixed" },
                        { label: "Basic", value: "basic" },
                    ],
                    rules: { required: "Required" },
                },
                {
                    name: "status",
                    type: "select",
                    label: "Status",
                    colSpan: "col-span-12 md:col-span-3",
                    options: [
                        { label: "Active", value: "active" },
                        { label: "Inactive", value: "inactive" },
                    ],
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
