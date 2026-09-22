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
    const isDelete = form.watch("model_for") === "delete_group_advance";

    let preparedLoadOptions = [];
    if (isDelete) {
        preparedLoadOptions = [
            "hrm/advance",
            "items",
            (item) => {
                const employee = item.employee || {};
                return {
                    id: item.id,
                    employee_name:
                        [employee.first_name || "", employee.last_name || ""]
                            .join(" ")
                            .trim() || "Unknown",
                    employee_code: employee.employee_code || "N/A",
                    amount: item.amount ?? 0,
                    status: item.status,
                };
            },
            [
                "project_id",
                "branch_id",
                "department_id",
                "scope_type",
                "status",
                "model_for",
            ],
        ];
    } else {
        preparedLoadOptions = [
            "hrm/employees",
            "employees",
            (employee) => ({
                id: employee.id,
                employee_name:
                    employee.personal_info?.full_name ||
                    `${employee.personal_info?.first_name || ""} ${employee.personal_info?.last_name || ""}`.trim() ||
                    employee.first_name ||
                    "Unknown",
                employee_email:
                    employee.contact_info?.work_email ||
                    employee.work_email ||
                    "",
                employee_phone:
                    employee.contact_info?.primary_phone ||
                    employee.primary_phone ||
                    "",
                amount: "",
                status: "active",
                month: "",
                year: new Date().getFullYear().toString(),
                advance_date: new Date().toISOString().split("T")[0],
            }),
            [
                "branch_id",
                form.watch("scope_type") === "company"
                    ? "department_id"
                    : "project_id",
                "employee_type",
            ],
        ];
    }

    return [
        {
            name: "scope_type",
            type: "select",
            label: "Scope Type *",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView || isEdit,
            options: [
                { label: "Company wise", value: "company" },
                { label: "Project wise", value: "project" },
            ],
            handleChange: (e) => {
                if (isView || isEdit) return;
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
                form.setValue("employee_ids", null);
                form.setValue("project_id", null);
                form.setValue("employee_type", e.value);
            },
            rules: { required: "Scope type is required" },
        },
        {
            name: "branch_id",
            type: "async-select",
            label: "Branch *",
            loadOptions: [
                "organization/branches",
                "branches",
                "branchSearchTemplate",
            ],
            placeholder: "Select",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView || isEdit,
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
                ["branch_id"],
            ],
            placeholder: "Optional",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView || isEdit,
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
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView || isEdit,
            rules: { required_if: { field: "scope_type", value: "project" } },
        },
        // Edit Mode specific fields
        {
            name: "advance_date",
            type: "date",
            label: "Advance Date *",
            visibility: isEdit,
            colSpan: "col-span-12 md:col-span-4",
            rules: { required: "Date is required" },
        },
        {
            name: "month",
            type: "select",
            label: "Month *",
            visibility: isEdit,
            colSpan: "col-span-12 md:col-span-4",
            options: [
                { label: "January", value: "01" },
                { label: "February", value: "02" },
                { label: "March", value: "03" },
                { label: "April", value: "04" },
                { label: "May", value: "05" },
                { label: "June", value: "06" },
                { label: "July", value: "07" },
                { label: "August", value: "08" },
                { label: "September", value: "09" },
                { label: "October", value: "10" },
                { label: "November", value: "11" },
                { label: "December", value: "12" },
            ],
            rules: { required: "Month is required" },
        },
        {
            name: "year",
            type: "text",
            label: "Year *",
            visibility: isEdit,
            colSpan: "col-span-12 md:col-span-4",
            rules: { required: "Year is required" },
        },
        {
            name: "amount",
            type: "number",
            label: "Amount *",
            visibility: isEdit,
            colSpan: "col-span-12 md:col-span-4",
            inputProps: { min: 0, step: "0.01", type: "number" },
            rules: { required: "Amount is required" },
        },
        {
            name: "status",
            type: "select",
            label: "Status *",
            visibility: isEdit,
            colSpan: "col-span-12 md:col-span-4",
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
            ],
            rules: { required: "Status is required" },
        },
        {
            name: "reason",
            type: "textarea",
            label: "Reason",
            visibility: isEdit,
            colSpan: "col-span-12",
        },

        // Global values for bulk create
        {
            name: "global_advance_date",
            type: "date",
            label: "Global Advance Date",
            visibility: !isEdit && !isView && !isDelete,
            colSpan: "col-span-12 md:col-span-3",
            handleChange: (value) => {
                const employees = form.getValues("employee_details") || [];
                employees.forEach((_, index) =>
                    form.setValue(
                        `employee_details.${index}.advance_date`,
                        value,
                    ),
                );
                toast.success("Global date applied");
            },
        },
        {
            name: "global_month",
            type: "select",
            label: "Global Month",
            visibility: !isEdit && !isView && !isDelete,
            colSpan: "col-span-12 md:col-span-3",
            options: [
                { label: "January", value: "01" },
                { label: "February", value: "02" },
                { label: "March", value: "03" },
                { label: "April", value: "04" },
                { label: "May", value: "05" },
                { label: "June", value: "06" },
                { label: "July", value: "07" },
                { label: "August", value: "08" },
                { label: "September", value: "09" },
                { label: "October", value: "10" },
                { label: "November", value: "11" },
                { label: "December", value: "12" },
            ],
            handleChange: (value) => {
                const employees = form.getValues("employee_details") || [];
                employees.forEach((_, index) =>
                    form.setValue(
                        `employee_details.${index}.month`,
                        value.value,
                    ),
                );
                toast.success("Global month applied");
            },
        },
        {
            name: "global_year",
            type: "text",
            label: "Global Year",
            visibility: !isEdit && !isView && !isDelete,
            colSpan: "col-span-12 md:col-span-3",
            handleChange: (value) => {
                const employees = form.getValues("employee_details") || [];
                employees.forEach((_, index) =>
                    form.setValue(`employee_details.${index}.year`, value),
                );
                toast.success("Global year applied");
            },
        },
        {
            name: "global_amount",
            type: "number",
            label: "Global Amount",
            visibility: !isEdit && !isView && !isDelete,
            colSpan: "col-span-12 md:col-span-3",
            inputProps: { min: 0, step: "0.01", type: "number" },
            handleChange: (value) => {
                const employees = form.getValues("employee_details") || [];
                employees.forEach((_, index) =>
                    form.setValue(`employee_details.${index}.amount`, value),
                );
                toast.success("Global amount applied");
            },
        },
        {
            name: "process_button",
            type: "button",
            placeholder: "Load Employees",
            colSpan: "col-span-12 md:col-span-4",
            visibility: !isEdit && !isView,
            handleChange: (e, form) => {
                setTimeout(() => {
                    if (form._paginatedLoaders?.employee_details) {
                        form._paginatedLoaders.employee_details();
                    }
                }, 100);
            },
        },
        {
            name: "employee_details",
            type: "group-form-paginated",
            label: "Employee Details (Check to include employee in advance)",
            colSpan: "col-span-12",
            addButtonLabel: false,
            isDelete: false,
            perPage: 10,
            autoLoad: false,
            enableSearch: true,
            visibility: !isEdit && !isView,
            loadOptions: preparedLoadOptions,
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
                    label: "Employee",
                    colSpan: "col-span-12 md:col-span-2",
                    disabled: true,
                },
                {
                    name: "advance_date",
                    type: "date",
                    label: "Date",
                    colSpan: "col-span-12 md:col-span-2",
                    disabled: isDelete,
                },
                {
                    name: "month",
                    type: "select",
                    label: "Month",
                    colSpan: "col-span-12 md:col-span-2",
                    disabled: isDelete,
                    options: [
                        { label: "Jan", value: "01" },
                        { label: "Feb", value: "02" },
                        { label: "Mar", value: "03" },
                        { label: "Apr", value: "04" },
                        { label: "May", value: "05" },
                        { label: "Jun", value: "06" },
                        { label: "Jul", value: "07" },
                        { label: "Aug", value: "08" },
                        { label: "Sep", value: "09" },
                        { label: "Oct", value: "10" },
                        { label: "Nov", value: "11" },
                        { label: "Dec", value: "12" },
                    ],
                },
                {
                    name: "year",
                    type: "text",
                    label: "Year",
                    colSpan: "col-span-12 md:col-span-1",
                    disabled: isDelete,
                },
                {
                    name: "amount",
                    type: "number",
                    label: "Amount",
                    colSpan: "col-span-12 md:col-span-2",
                    disabled: isDelete,
                    inputProps: { min: 0, step: "0.01", type: "number" },
                },
                {
                    name: "status",
                    type: "select",
                    label: "Status",
                    colSpan: "col-span-12 md:col-span-2",
                    disabled: isDelete,
                    options: [
                        { label: "Active", value: "active" },
                        { label: "Inactive", value: "inactive" },
                    ],
                },
            ],
        },
    ];
};

export default fields;
