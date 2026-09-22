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
                ["branch_id"], // dependency
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
            name: "job_position_id",
            type: "async-select",
            label: "Job Position",
            loadOptions: ["organization/job-positions", "job_positions", "jobPositionsTemplate", ["branch_id", "department_id", "project_id"]],
            colSpan: "col-span-12 md:col-span-3",
        },
        {
            name: "allowance_type_id",
            type: "async-select",
            label: "Allowance Type",
            loadOptions: ["allowance/allowance_type", "allowance_types", "leaveTypeSearchTemplate"],
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
