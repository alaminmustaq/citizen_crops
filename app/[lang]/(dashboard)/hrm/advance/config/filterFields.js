import { branchSearchTemplate, departmentSearchTemplate } from "@/utility/templateHelper";

const filterFields = (form, actions) => {
    return [
        {
            name: "start_date",
            type: "date",
            label: "Start Date",
            colSpan: "col-span-12 md:col-span-3",
        },
        {
            name: "end_date",
            type: "date",
            label: "End Date",
            colSpan: "col-span-12 md:col-span-3",
            rules: {
                validate: (value) => {
                    const start = form.getValues("start_date");
                    if (start && value) {
                        return new Date(start) <= new Date(value) || "Start date cannot be after end date";
                    }
                    return true;
                },
            },
        }, 
        {
            name: "branch_id",
            type: "async-select",
            label: "Branch",
            loadOptions: ["organization/branches", "branches", "branchSearchTemplate"],
            colSpan: "col-span-12 md:col-span-3",
        },
        {
            name: "department_id",
            type: "async-select",
            label: "Department",
            loadOptions: [
                "organization/departments",
                "departments",
                "departmentSearchTemplate",
                ["branch_id"],
            ],
            colSpan: "col-span-12 md:col-span-3",
        },
        {
            name: "project_id",
            type: "async-select",
            label: "Project",
            loadOptions: ["projects", "projects", "projectTemplate",["branch_id"]],
            colSpan: "col-span-12 md:col-span-3",
        },
        {
            name: "month",
            type: "select",
            label: "Month",
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
            colSpan: "col-span-12 md:col-span-3",
        },
        {
            name: "year",
            type: "text",
            label: "Year",
            colSpan: "col-span-12 md:col-span-3",
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
    ];
};

export default filterFields;
