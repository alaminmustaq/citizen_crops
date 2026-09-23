import { toast } from "react-hot-toast";

const ReturnFields = (form) => [
    // Hidden warehouse_id field
    {
        name: "warehouse_id",
        type: "input",
        label: "Warehouse ID",
        colSpan: "col-span-12",
        inputProps: { type: "hidden" }, // hidden field
    },
    // return_date
    {
        name: "return_date",
        type: "input",
        label: "Return Date *",
        placeholder: "Select return date",
        colSpan: "col-span-12 md:col-span-6",
        rules: { required: "Return date is required" },
        inputProps: { type: "date" },
    },
    // =============== Assign Employees ===============
    {
        name: "assignTools",
        type: "group-form",
        label: "Assign Tool",
        placeholder: "Add tool",
        colSpan: "col-span-12",
        addButtonLabel: false,
        isDelete: false,

        fields: [
            {
                name: "tool_name",
                type: "text",
                label: "Tool Name *",
                placeholder: "Enter tool name",
                colSpan: "col-span-12 md:col-span-4",
                rules: { required: "Tool name is required" },
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
                    min: { value: 1, message: "Quantity must be at least 1" },
                },
                disabled: true,
            },
            {
                name: "return_quantity",
                type: "number",
                label: "Return quantity *",
                placeholder: "Enter quantity to assign",
                colSpan: "col-span-12 md:col-span-2",
                rules: {
                    required: "Return Quantity is required",
                    min: { value: 0, message: "Return Quantity must be at least 0" },
                },
            },
            {
                name: "status",
                type: "select",
                label: "Status *",
                colSpan: "col-span-12 md:col-span-4",
                placeholder: "Select status",
                options: [
                    { label: "Returned", value: "returned" },
                    { label: "Lost", value: "lost" },
                    { label: "Damaged", value: "damaged" },
                ],
                rules: { required: "Please select a status" },
            },
        ],
    },
];

export default ReturnFields;
