const fields = () => {
    return [
        {
            key: "job_details",
            tab: "Job Details",
            label: "Job Information",
            description: "Core details about the job position",
            fields: [
                {
                    name: "job_title",
                    type: "input",
                    label: "Job Title *",
                    placeholder: "Enter job title",
                    colSpan: "col-span-12 md:col-span-6",
                    rules: {
                        required: "Job title is required",
                        maxLength: {
                            value: 200,
                            message: "Max 200 characters",
                        },
                    },
                    inputProps: { maxLength: 200 },
                },
                {
                    name: "status",
                    type: "select",
                    label: "Status *",
                    placeholder: "Select status",
                    colSpan: "col-span-12 md:col-span-6",
                    options: [
                        { label: "Active", value: "active" },
                        { label: "Inactive", value: "inactive" },
                    ],
                    rules: {
                        required: "Status is required",
                    },
                },
                {
                    name: "workspace_type",
                    type: "select",
                    label: "Workspace Type",
                    placeholder: "Select type",
                    colSpan: "col-span-12 md:col-span-6",
                    options: [
                        { label: "Onsite", value: "onsite" },
                        { label: "Remote", value: "remote" },
                        { label: "Hybrid", value: "hybrid" },
                    ],
                },
                {
                    name: "employment_type",
                    type: "select",
                    label: "Employment Type",
                    placeholder: "Select type",
                    colSpan: "col-span-12 md:col-span-6",
                    options: [
                        { label: "Full-time", value: "full_time" },
                        { label: "Part-time", value: "part_time" },
                        { label: "Temporary", value: "temporary" },
                        { label: "Contract", value: "contract" },
                        { label: "Freelance", value: "freelance" },
                        { label: "Internship", value: "internship" },
                    ],
                },
                {
                    name: "salary_currency",
                    type: "input",
                    label: "Salary Currency",
                    placeholder: "e.g. BDT, USD",
                    colSpan: "col-span-12 md:col-span-6",
                },
                {
                    name: "salary_type",
                    type: "select",
                    label: "Salary Type",
                    placeholder: "Select type",
                    colSpan: "col-span-12 md:col-span-6",
                    options: [
                        { label: "Monthly", value: "monthly" },
                        { label: "Weekly", value: "weekly" },
                        { label: "Hourly", value: "hourly" },
                        { label: "Yearly", value: "yearly" },
                        { label: "Negotiable", value: "negotiable" },
                    ],
                },
                {
                    name: "min_salary",
                    type: "number",
                    label: "Min Salary",
                    placeholder: "0.00",
                    colSpan: "col-span-12 md:col-span-6",
                },
                {
                    name: "max_salary",
                    type: "number",
                    label: "Max Salary",
                    placeholder: "0.00",
                    colSpan: "col-span-12 md:col-span-6",
                },
                {
                    name: "application_deadline",
                    type: "date",
                    label: "Application Deadline *",
                    colSpan: "col-span-12 md:col-span-6",
                    rules: {
                        required: "Application deadline is required",
                    },
                },
                {
                    name: "job_description",
                    type: "rich-text",
                    label: "Job Description",
                    placeholder: "Enter detailed job description...",
                    colSpan: "col-span-12",
                },
            ],
        },
        {
            key: "application",
            tab: "Application",
            label: "Application Process",
            description: "Customize the application flow",
            fields: [
                {
                    name: "default_fields_info",
                    type: "text-display",
                    label: "Default Fields",
                    getValue: () => "Name and Email are always collected.",
                    colSpan: "col-span-12",
                },
                {
                    name: "application_options_card",
                    type: "card",
                    label: "",
                    colSpan: "col-span-12",
                    childFields: [
                        {
                            name: "is_phone",
                            type: "switch",
                            label: "Phone Number",
                            colSpan: "col-span-12 md:col-span-4",
                        },
                        {
                            name: "is_cv",
                            type: "switch",
                            label: "CV / Resume",
                            colSpan: "col-span-12 md:col-span-4",
                        },
                        {
                            name: "is_cover_letter",
                            type: "switch",
                            label: "Cover Letter",
                            colSpan: "col-span-12 md:col-span-4",
                        },
                    ],
                },
                {
                    name: "custom_questions",
                    type: "custom-questions",
                    colSpan: "col-span-12 mt-6",
                },
            ],
        },
        {
            key: "screening",
            tab: "Screening",
            label: "Screening Questions",
            description: "Define interview and screening criteria",
            fields: [
                {
                    name: "screening_questions",
                    type: "screening-questions",
                    colSpan: "col-span-12",
                },
                {
                    name: "is_auto_reject",
                    type: "switch",
                    label: "Auto Reject",
                    description: "Automatically reject candidates who don't meet minimum criteria",
                    colSpan: "col-span-12 md:col-span-6",
                },
                {
                    name: "interview_link",
                    type: "input",
                    label: "Interview Link",
                    placeholder: "Enter interview link (e.g. Zoom, Google Meet)",
                    colSpan: "col-span-12 md:col-span-6",
                },
            ],
        },
    ];
};

export default fields;
