import { toast } from "react-hot-toast";
 

const fields = (form) => 
{
    const disableWarehouse = form.watch("disableWarehouse") ?? false;

    console.log(disableWarehouse);
    

    return [
    { 
        name: "warehouse_id",
        type: "async-select",
        label: "Warehouse *",
        loadOptions: [
            "inventory/warehouses",
            "warehouses",
            "warehouseSearchTemplate",
        ],
        placeholder: "Select Warehouse",
        colSpan: "col-span-12 md:col-span-6",
        disabled: disableWarehouse,
        // rules: { required: "Warehouse is required" },
    },
    {
        name: "project_id",
        type: "async-select",
        label: "Project *",
        loadOptions: ["projects", "projects", "projectTemplate"],
        placeholder: "Select Project",
        colSpan: "col-span-12 md:col-span-6",
        rules: { required: "Project is required" },
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
        placeholder: "Optional",
        colSpan: "col-span-12 md:col-span-6",
    }, 
    {
        name: "employee_id",
        type: "async-select",
        label: "Employee *",
        loadOptions: [
            "hrm/employees",
            "employees",
            "employTemplate",
            "project_id",
        ],
        placeholder: "Select employee",
        colSpan: "col-span-12 md:col-span-6",
        rules: { required: "Employee is required" },
    },
    {
        name: "distribution_date",
        type: "input",
        label: "Distribution Date *",
        placeholder: "Select distribution date",
        colSpan: "col-span-12 md:col-span-6",
        rules: { required: "Distribution date is required" },
        inputProps: { type: "date" },
    },
    {
        name: "expected_return_date",
        type: "input",
        label: "Expected Return Date",
        placeholder: "Select expected return date",
        colSpan: "col-span-12 md:col-span-6",
        inputProps: { type: "date" },
    },
    {
        name: "tool_id",
        type: "async-select",
        label: "Tool ",
        loadOptions: ["inventory/tools", "tools", "toolSearchTemplate","warehouse_id"],
        placeholder: "Select tool",
        colSpan: "col-span-12 md:col-span-12",
        rules: { required: "Tool is required" },
        handleChange: (e, form, field, allData) => { 
            const existingTool = form.getValues("assignTools") || [];
            const exists = existingTool.some(
                (tool) => tool.tool_id === e.value
            );
            const rawData = allData.find((item) => item.value === e.value);

            if (exists) {
                toast.error("Tool already assigned!");
            } else {
                form.fields.append({
                    tool_name: e.label,
                    tool_id: e.value,
                    available_stock: rawData?.stock ?? 0,
                    quantity: 0,
                });
            }
            field.onChange(null);
        },
    },
    // =============== Assign Employees ===============
    {
        name: "assignTools",
        type: "group-form",
        label: "Assign Tool",
        placeholder: "Add tool",
        colSpan: "col-span-12",
        addButtonLabel: false,

        fields: [
            {
                name: "tool_name",
                type: "text",
                label: "Tool Name *",
                placeholder: "Enter tool name",
                colSpan: "col-span-12 md:col-span-4",
                rules: {
                    required: "Tool name is required",
                },
                disabled: true,
            },
            {
                name: "available_stock",
                type: "number",
                label: "Available Stock *",
                placeholder: "Available stock",
                colSpan: "col-span-12 md:col-span-2",
                rules: {
                    required: "Available stock is required",
                    min: {
                        value: 0,
                        message: "Stock cannot be negative",
                    },
                },
                disabled: true,
            },
            {
                name: "quantity",
                type: "number",
                label: "Quantity *",
                placeholder: "Enter quantity to assign",
                colSpan: "col-span-12 md:col-span-2",
                rules: {
                    required: "Quantity is required",
                    min: {
                        value: 1,
                        message: "Quantity must be at least 1",
                    },
                },
            },
            {
                name: "notes",
                type: "text",
                label: "Notes",
                placeholder: "Enter any remarks or details (optional)",
                colSpan: "col-span-12 md:col-span-4",
                rules: {
                    maxLength: {
                        value: 255,
                        message: "Note cannot exceed 255 characters",
                    },
                },
            },
        ],
    },
    ];
}

export default fields;
