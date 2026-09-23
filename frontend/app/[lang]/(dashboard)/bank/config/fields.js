import { toast } from "react-hot-toast";

const fields = (form) => [
    // ===== Bank Master Fields =====
    {
        name: "bank_name",
        type: "text",
        label: "Bank Name *",
        placeholder: "Enter bank name",
        colSpan: "col-span-12 md:col-span-6",
        rules: { required: "Bank name is required" },
    },

    // ===== Dynamic Branches =====
    {
        name: "branches",
        type: "group-form",
        label: "Bank Branches",
        colSpan: "col-span-12",
        addButtonLabel: "Add Branch",
        fields: [
            // { name: "id", type: "hidden" },
            {
                name: "branch_name",
                type: "text",
                label: "Branch Name *",
                placeholder: "Enter branch name",
                colSpan: "col-span-12 md:col-span-4",
                rules: { required: "Branch name is required" },
            },
            {
                name: "branch_address",
                type: "text",
                label: "Branch Address",
                placeholder: "Enter branch address",
                colSpan: "col-span-12 md:col-span-4",
            },
            {
                name: "account_no",
                type: "text",
                label: "Account Number *",
                placeholder: "Enter account number",
                colSpan: "col-span-12 md:col-span-2",
                rules: { required: "Account number is required" },
            },
            {
                name: "account_holder_name",
                type: "text",
                label: "Account Holder Name *",
                placeholder: "Enter account holder name",
                colSpan: "col-span-12 md:col-span-2",
                rules: { required: "Account holder name is required" },
            },
            {
                name: "status",
                type: "select",
                label: "Status",
                placeholder: "Select status",
                colSpan: "col-span-12 md:col-span-2",
                options: [
                    { label: "Active", value: 1 },
                    { label: "Inactive", value: 0 },
                ],
                defaultValue: { label: "Active", value: 1 }, // <-- default selected option
            },
        ],
    },
];

export default fields;
