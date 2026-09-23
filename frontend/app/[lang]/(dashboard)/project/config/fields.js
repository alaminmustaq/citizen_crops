import { useAppSelector } from "@/hooks/use-redux"; 
const fields = () => {
    const { user, branch } = useAppSelector((state) => state.auth);
    console.log(branch);
    
    return [
        // =============== Core ===============
        {
            name: "name",
            type: "input",
            label: "Project Name *",
            placeholder: "Website Redesign",
            colSpan: "col-span-12 md:col-span-6",
            rules: {
                required: "Project name is required",
                maxLength: { value: 200, message: "Max 200 characters" },
            },
            inputProps: { maxLength: 200 },
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
            placeholder: "Branch",
            colSpan: "col-span-12 md:col-span-6",
        }, 
        {
            name: "status",
            type: "select",
            label: "Status *",
            placeholder: "Select status",
            colSpan: "col-span-12 md:col-span-6",
            options: [
                { label: "Planned", value: "planned" },
                { label: "In Progress", value: "in_progress" },
                { label: "On Hold", value: "on_hold" },
                { label: "Completed", value: "completed" },
                { label: "Cancelled", value: "cancelled" },
            ],
            rules: { required: "Status is required" },
        },

        // =============== Dates ===============
        {
            name: "start_date",
            type: "date",
            label: "Start Date *",
            colSpan: "col-span-12 md:col-span-6",
            rules: { required: "Start date is required" },
        },
        {
            name: "end_date",
            type: "date",
            label: "End Date *",
            colSpan: "col-span-12 md:col-span-6",
        },
        {
            name: "expiry_warning_days",
            type: "number",
            label: "End Warning (days)",
            placeholder: "e.g. 30",
            colSpan: "col-span-12 md:col-span-6",
            inputProps: { min: 0, step: "1" }, 
        },

        // =============== Budget & Client ===============
        {
            name: "budget",
            type: "number",
            label: "Budget",
            placeholder: "50000",
            colSpan: "col-span-12 md:col-span-6",
            inputProps: { min: 0, step: "0.01" },
        },
        {
            name: "client_id",
            type: "async-select",
            label: "Client",
            loadOptions: ["clients/clients", "clients", "clientTemplate"],
            placeholder: "Select client",
            colSpan: "col-span-12 md:col-span-6",
        },

        // =============== Relations ===============
        {
            name: "job_position_id",
            type: "async-select",
            label: "Job Position *",
            colSpan: "col-span-12 md:col-span-6",
            loadOptions: [
                "organization/job-positions",
                "job_positions",
                "jobPositionsTemplate",
            ],
            rules: { required: "Job position is required" },
        },
        {
            name: "employee_id",
            type: "multi-async-select",
            label: "Responsible Employee *",

            loadOptions: [
                "hrm/employees",
                "employees",
                "employTemplate",
                "job_position_id",
            ],
            placeholder: "Optional",
            colSpan: "col-span-12 md:col-span-6",
            rules: { required: "Employ  is required" },
        },
        // =============== Details ===============
        {
            name: "description",
            type: "textarea",
            label: "Description",
            placeholder: "Describe the project objectives…",
            colSpan: "col-span-12",
        },
        {
            name: "observation",
            type: "textarea",
            label: "Observation / Notes",
            placeholder: "Any notes or remarks…",
            colSpan: "col-span-12",
        },
    ];
};

export default fields;
