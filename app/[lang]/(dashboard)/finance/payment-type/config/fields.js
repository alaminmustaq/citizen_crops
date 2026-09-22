import { toast } from "react-hot-toast";
import { useAppSelector } from "@/hooks/use-redux";
const fields = (form) => {
    const { user } = useAppSelector((state) => state.auth);
    console.log(user.employee);
    const is_employee = user.employee;
    // ===== Warehouse Basic Info =====
    return [
        {
            name: "name",
            type: "text",
            label: "Name *",
            placeholder: "Enter name",
            colSpan: "col-span-12 md:col-span-6",
            rules: { required: "Name is required" },
        },

        {
            name: "branch_id",
            type: "async-select",
            label: `Branch ${is_employee ? "*" : ""}`,
            loadOptions: [
                "organization/branches",
                "branches",
                "branchSearchTemplate",
            ],
            placeholder: "Branch",
            colSpan: "col-span-12 md:col-span-6",
        },

        // ===== Transaction Type Selection =====
        {
            name: "transaction_for",
            type: "select",
            label: "Transaction For *",
            options: [
                { label: "Income", value: "income" },
                { label: "Expense", value: "expense" },
            ],
            placeholder: "Select Transaction Type",
            colSpan: "col-span-12 md:col-span-6",
            rules: { required: "Transaction For is required" },
        },

        // ===== Status Selection =====
        {
            name: "status",
            type: "select",
            label: "Status *",
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
            ],
            placeholder: "Select status",
            colSpan: "col-span-12 md:col-span-6",
            rules: { required: "Status is required" },
        },
    ];
};

export default fields;
