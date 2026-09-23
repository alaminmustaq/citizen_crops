const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fields = () => {
    return [
        // 1. Identity & Org
        {
            key: "identity",
            tab: "Identity",
            label: "Identity & Organization",
            description: "Organizational mapping and core identity",
            fields: [
                {
                    name: "branch_id",
                    type: "async-select",
                    label: "Branch",
                    loadOptions: [
                        "organization/branches",
                        "branches",
                        "branchSearchTemplate",
                    ],
                    placeholder: "Optional",
                    colSpan: "col-span-12 md:col-span-4",
                },
                {
                    name: "department_id",
                    type: "async-select",
                    label: "Department",
                    colSpan: "col-span-12 md:col-span-4",
                    loadOptions: [
                        "organization/departments",
                        "departments",
                        "departmentSearchTemplate",
                    ],
                },
                {
                    name: "job_position_id",
                    type: "async-select",
                    label: "Job Position",
                    colSpan: "col-span-12 md:col-span-4",
                    loadOptions: [
                        "organization/job-positions",
                        "job_positions",
                        "jobPositionsTemplate",
                    ],
                },
                // {
                //     name: "manager_id",
                //     type: "async-select",
                //     label: "Manager",
                //     colSpan: "col-span-12 md:col-span-4",
                // },
                {
                    name: "employee_code",
                    type: "input",
                    label: "Employee Code *",
                    colSpan: "col-span-12 md:col-span-4",
                    rules: { required: "Employee code is required" },
                },
                {
                    name: "badge_number",
                    type: "input",
                    label: "Badge Number",
                    colSpan: "col-span-12 md:col-span-4",
                },
                {
                    name: "first_name",
                    type: "input",
                    label: "First Name *",
                    colSpan: "col-span-12 md:col-span-4",
                    rules: { required: "First name is required" },
                },
                {
                    name: "middle_name",
                    type: "input",
                    label: "Middle Name",
                    colSpan: "col-span-12 md:col-span-4",
                },
                {
                    name: "last_name",
                    type: "input",
                    label: "Last Name *",
                    colSpan: "col-span-12 md:col-span-4",
                    rules: { required: "Last name is required" },
                },
                {
                    name: "preferred_name",
                    type: "input",
                    label: "Preferred Name",
                    colSpan: "col-span-12 md:col-span-4",
                }, 
            ],
        },

        // 2. Personal Details
        {
            key: "personal",
            tab: "Personal",
            label: "Personal Details",
            description: "Demographics and identification",
            fields: [
                {
                    name: "gender",
                    type: "select",
                    label: "Gender",
                    colSpan: "col-span-12 md:col-span-4",
                    options: [
                        { label: "Male", value: "male" },
                        { label: "Female", value: "female" },
                        { label: "Other", value: "other" },
                        {
                            label: "Prefer not to say",
                            value: "prefer_not_to_say",
                        },
                    ],
                },
                {
                    name: "date_of_birth",
                    type: "date",
                    label: "Date of Birth",
                    colSpan: "col-span-12 md:col-span-4",
                },
                {
                    name: "nationality",
                    type: "input",
                    label: "Nationality",
                    colSpan: "col-span-12 md:col-span-4",
                },
                {
                    name: "national_id",
                    type: "input",
                    label: "National ID",
                    colSpan: "col-span-12 md:col-span-4",
                },
                {
                    name: "passport_number",
                    type: "input",
                    label: "Passport Number",
                    colSpan: "col-span-12 md:col-span-4",
                },
                {
                    name: "passport_expiry",
                    type: "date",
                    label: "Passport Expiry",
                    colSpan: "col-span-12 md:col-span-4",
                }, 
                {
                    name: "marital_status",
                    type: "select",
                    label: "Marital Status",
                    colSpan: "col-span-12 md:col-span-4",
                    options: [
                        { label: "Single", value: "single" },
                        { label: "Married", value: "married" },
                        { label: "Divorced", value: "divorced" },
                        { label: "Widowed", value: "widowed" },
                    ], 
                },
                {
                    name: "blood_group",
                    type: "select",
                    label: "Blood Group",
                    colSpan: "col-span-12 md:col-span-4",
                    options: [
                        { label: "A+", value: "A+" },
                        { label: "A-", value: "A-" },
                        { label: "B+", value: "B+" },
                        { label: "B-", value: "B-" },
                        { label: "O+", value: "O+" },
                        { label: "O-", value: "O-" },
                        { label: "AB+", value: "AB+" },
                        { label: "AB-", value: "AB-" },
                    ], 
                },

            ],
        },

        // 3. Contact
        {
            key: "contact",
            tab: "Contact",
            label: "Contact Information",
            description: "Email, phone, emergency",
            fields: [
                {
                    name: "personal_email",
                    type: "email",
                    label: "Personal Email",
                    colSpan: "col-span-12 md:col-span-4",
                    rules: {
                        validate: (v) =>
                            !v || RE_EMAIL.test(v) || "Invalid email",
                    },
                },
                {
                    name: "work_email",
                    type: "email",
                    label: "Work Email *",
                    colSpan: "col-span-12 md:col-span-4",
                    rules: {
                        validate: (v) =>
                            !v || RE_EMAIL.test(v) || "Invalid email",
                    },
                    rules: { required: "Work email is required" },
                },
                {
                    name: "primary_phone",
                    type: "input",
                    label: "Primary Phone",
                    colSpan: "col-span-12 md:col-span-4",
                },
                {
                    name: "secondary_phone",
                    type: "input",
                    label: "Secondary Phone",
                    colSpan: "col-span-12 md:col-span-4",
                },
                {
                    name: "contact_preferences",
                    type: "input",
                    label: "Contact Preferences",
                    colSpan: "col-span-12 md:col-span-4",
                },
                {
                    name: "emergency_contact_name",
                    type: "input",
                    label: "Emergency Contact Name",
                    colSpan: "col-span-12 md:col-span-4",
                },
                {
                    name: "emergency_contact_relation",
                    type: "input",
                    label: "Relation",
                    colSpan: "col-span-12 md:col-span-4",
                },
                {
                    name: "emergency_contact_phone",
                    type: "input",
                    label: "Emergency Phone",
                    colSpan: "col-span-12 md:col-span-4",
                },
                {
                    name: "emergency_contact_email",
                    type: "email",
                    label: "Emergency Email",
                    colSpan: "col-span-12 md:col-span-4",
                },
            ],
        },

        // 4. Addresses
        // {
        //     key: "addresses",
        //     tab: "Addresses",
        //     label: "Addresses",
        //     description: "Current and permanent addresses",
        //     fields: [
        //         {
        //             name: "current_address_line_1",
        //             type: "textarea",
        //             label: "Current Address Line 1",
        //             colSpan: "col-span-12",
        //         },
        //         {
        //             name: "current_address_line_2",
        //             type: "textarea",
        //             label: "Current Address Line 2",
        //             colSpan: "col-span-12",
        //         },
        //         {
        //             name: "current_city",
        //             type: "input",
        //             label: "City",
        //             colSpan: "col-span-12 md:col-span-4",
        //         },
        //         {
        //             name: "current_state",
        //             type: "input",
        //             label: "State",
        //             colSpan: "col-span-12 md:col-span-4",
        //         },
        //         {
        //             name: "current_postal_code",
        //             type: "input",
        //             label: "Postal Code",
        //             colSpan: "col-span-12 md:col-span-4",
        //         },
        //         {
        //             name: "current_country",
        //             type: "input",
        //             label: "Country",
        //             colSpan: "col-span-12 md:col-span-4",
        //         },
        //         {
        //             name: "same_as_current_address",
        //             type: "checkbox",
        //             label: "Same as current",
        //             colSpan: "col-span-12",
        //         },
        //         {
        //             name: "permanent_address_line_1",
        //             type: "textarea",
        //             label: "Permanent Address Line 1",
        //             colSpan: "col-span-12",
        //         },
        //         {
        //             name: "permanent_address_line_2",
        //             type: "textarea",
        //             label: "Permanent Address Line 2",
        //             colSpan: "col-span-12",
        //         },
        //         {
        //             name: "permanent_city",
        //             type: "input",
        //             label: "City",
        //             colSpan: "col-span-12 md:col-span-4",
        //         },
        //         {
        //             name: "permanent_state",
        //             type: "input",
        //             label: "State",
        //             colSpan: "col-span-12 md:col-span-4",
        //         },
        //         {
        //             name: "permanent_postal_code",
        //             type: "input",
        //             label: "Postal Code",
        //             colSpan: "col-span-12 md:col-span-4",
        //         },
        //         {
        //             name: "permanent_country",
        //             type: "input",
        //             label: "Country",
        //             colSpan: "col-span-12 md:col-span-4",
        //         },
        //     ],
        // },

        // 5. Employment
        {
            key: "employment",
            tab: "Employment",
            label: "Employment Details",
            description: "Hire and contract details",
            fields: [
                {
                    name: "hire_date",
                    type: "date",
                    label: "Hire Date *",
                    colSpan: "col-span-12 md:col-span-4",
                    rules: { required: "Hire date required" },
                },
                {
                    name: "start_date",
                    type: "date",
                    label: "Start Date",
                    colSpan: "col-span-12 md:col-span-4",
                },
                {
                    name: "basic_salary",
                    type: "number",
                    label: "Basic Salary *",
                    placeholder: "90000.00",
                    colSpan: "col-span-12 md:col-span-4",
                    inputProps: { min: 0, step: "0.01" },
                    rules: { min: { value: 0, message: "Must be ≥ 0" } },
                },

                {
                    name: "salary_type",
                    type: "select",
                    label: "Salary Type *",
                    colSpan: "col-span-12 md:col-span-4",
                    options: [
                        { label: "Hourly", value: "hourly" },
                        { label: "Daily", value: "daily" },
                        { label: "Weekly", value: "weekly" },
                        { label: "Monthly", value: "monthly" },
                        { label: "Yearly", value: "yearly" },
                        { label: "Annual", value: "annual" },
                    ],
                    rules: { required: "Salary type is required" },
                },
                {
                    name: "probation_end_date",
                    type: "date",
                    label: "Probation End",
                    colSpan: "col-span-12 md:col-span-4",
                },
                {
                    name: "confirmation_date",
                    type: "date",
                    label: "Confirmation",
                    colSpan: "col-span-12 md:col-span-4",
                },
                {
                    name: "termination_date",
                    type: "date",
                    label: "Termination",
                    colSpan: "col-span-12 md:col-span-4",
                },
                {
                    name: "termination_reason",
                    type: "input",
                    label: "Termination Reason",
                    colSpan: "col-span-12 md:col-span-4",
                },
                {
                    name: "role_id",
                    type: "async-select",
                    label: "Role *",
                    colSpan: "col-span-12 md:col-span-4",
                    loadOptions: [
                        "admin/roles-permissions/roles",
                        "roles",
                        "roleTemplate",
                    ],
                    rules: { required: "Role is required" },
                },
                {
                    name: "employment_status",
                    type: "select",
                    label: "Status *",
                    colSpan: "col-span-12 md:col-span-4",
                    options: [
                        { label: "Active", value: "active" },
                        { label: "Inactive", value: "inactive" },
                        { label: "Probation", value: "probation" },
                        { label: "Confirmed", value: "confirmed" },
                        { label: "Notice Period", value: "notice_period" },
                        { label: "Terminated", value: "terminated" },
                        { label: "Resigned", value: "resigned" },
                        { label: "Retired", value: "retired" },
                        { label: "Suspended", value: "suspended" },
                        { label: "On Leave", value: "on_leave" },
                    ],
                    rules: { required: "Status required" },
                },
                {
                    name: "employment_type",
                    type: "select",
                    label: "Employment Type *",
                    colSpan: "col-span-12 md:col-span-4",
                    options: [
                        { label: "Permanent", value: "permanent" },
                        { label: "Temporary", value: "temporary" },
                        { label: "Contract", value: "contract" },
                        { label: "Internship", value: "internship" },
                        { label: "Consultant", value: "consultant" },
                    ],
                    rules: { required: "Employment type required" },
                },
                {
                    name: "work_mode",
                    type: "select",
                    label: "Work Mode *",
                    colSpan: "col-span-12 md:col-span-4",
                    options: [
                        { label: "Office", value: "office" },
                        { label: "Remote", value: "remote" },
                        { label: "Hybrid", value: "hybrid" },
                    ],
                    rules: { required: "Work mode required" },
                },
            ],
        },

        // 6. Experience & Education
        {
            key: "experience",
            tab: "Experience",
            label: "Experience & Education",
            description: "Career and academic background",
            fields: [
                {
                    name: "work_history",
                    type: "input",
                    label: "Work History",
                    colSpan: "col-span-12 md:col-span-4",
                },

                {
                    name: "years_of_experience",
                    type: "number",
                    label: "Years of Experience *",
                    colSpan: "col-span-12 md:col-span-4",
                    rules: { required: "Experience required" },
                },
                {
                    name: "highest_education",
                    type: "input",
                    label: "Highest Education",
                    colSpan: "col-span-12 md:col-span-4",
                },
                {
                    name: "university",
                    type: "input",
                    label: "University",
                    colSpan: "col-span-12 md:col-span-4",
                },
                {
                    name: "degree",
                    type: "input",
                    label: "Degree",
                    colSpan: "col-span-12 md:col-span-4",
                },
                {
                    name: "graduation_year",
                    type: "number",
                    label: "Graduation Year",
                    colSpan: "col-span-12 md:col-span-4",
                },
                {
                    name: "skills",
                    type: "textarea",
                    label: "Skills",
                    colSpan: "col-span-12",
                },
                {
                    name: "certifications",
                    type: "textarea",
                    label: "Certifications",
                    colSpan: "col-span-12",
                },

                {
                    name: "languages",
                    type: "textarea",
                    label: "Languages",
                    colSpan: "col-span-12",
                },
            ],
        },

        // 7. Compensation
        // {
        //     key: "compensation",
        //     tab: "Compensation",
        //     label: "Compensation",
        //     description: "Salary and benefits",
        //     fields: [
        //         {
        //             name: "basic_salary",
        //             type: "number",
        //             label: "Basic Salary",
        //             colSpan: "col-span-12 md:col-span-4",
        //         },
        //         {
        //             name: "gross_salary",
        //             type: "number",
        //             label: "Gross Salary",
        //             colSpan: "col-span-12 md:col-span-4",
        //         },
        //         {
        //             name: "salary_currency",
        //             type: "input",
        //             label: "Currency *",
        //             colSpan: "col-span-12 md:col-span-4",
        //             rules: { required: "Currency required" },
        //         },
        //         {
        //             name: "salary_period",
        //             type: "select",
        //             label: "Period *",
        //             colSpan: "col-span-12 md:col-span-4",
        //             options: [
        //                 { label: "Hourly", value: "hourly" },
        //                 { label: "Daily", value: "daily" },
        //                 { label: "Weekly", value: "weekly" },
        //                 { label: "Monthly", value: "monthly" },
        //                 { label: "Yearly", value: "yearly" },
        //             ],
        //             rules: { required: "Period required" },
        //         },
        //         {
        //             name: "last_salary_review",
        //             type: "date",
        //             label: "Last Review",
        //             colSpan: "col-span-12 md:col-span-4",
        //         },
        //         {
        //             name: "next_salary_review",
        //             type: "date",
        //             label: "Next Review",
        //             colSpan: "col-span-12 md:col-span-4",
        //         },
        //         {
        //             name: "allowances",
        //             type: "textarea",
        //             label: "Allowances",
        //             colSpan: "col-span-12",
        //         },
        //         {
        //             name: "deductions",
        //             type: "textarea",
        //             label: "Deductions",
        //             colSpan: "col-span-12",
        //         },
        //     ],
        // },

        // 8. Banking & Tax
        // {
        //     key: "banking",
        //     tab: "Banking",
        //     label: "Banking & Tax",
        //     description: "Bank, tax, and insurance",
        //     fields: [
        //         {
        //             name: "bank_name",
        //             type: "input",
        //             label: "Bank Name",
        //             colSpan: "col-span-12 md:col-span-4",
        //         },
        //         {
        //             name: "bank_account_number",
        //             type: "input",
        //             label: "Account Number",
        //             colSpan: "col-span-12 md:col-span-4",
        //         },
        //         {
        //             name: "bank_routing_number",
        //             type: "input",
        //             label: "Routing Number",
        //             colSpan: "col-span-12 md:col-span-4",
        //         },
        //         {
        //             name: "tax_id",
        //             type: "input",
        //             label: "Tax ID",
        //             colSpan: "col-span-12 md:col-span-4",
        //         },
        //         {
        //             name: "social_security_number",
        //             type: "input",
        //             label: "SSN",
        //             colSpan: "col-span-12 md:col-span-4",
        //         },
        //         {
        //             name: "pension_number",
        //             type: "input",
        //             label: "Pension Number",
        //             colSpan: "col-span-12 md:col-span-4",
        //         },
        //         {
        //             name: "health_insurance_number",
        //             type: "input",
        //             label: "Health Insurance Number",
        //             colSpan: "col-span-12 md:col-span-4",
        //         },
        //     ],
        // },

        // 9. Profile & System
        {
            key: "system",
            tab: "System",
            label: "Profile & System",
            description: "Profile, preferences, and system flags",
            fields: [
                // Removed  Select Options
                // File upload & metadata
                //   {
                //      name: "file_upload",
                //      type: "file",
                //     label: "Upload File *",
                //     colSpan: "col-span-12 md:col-span-6",
                //     rules: { required: "File is required" },
                //   },

                {
                    name: "bio",
                    type: "textarea",
                    label: "Bio",
                    colSpan: "col-span-12",
                },
                {
                    name: "preferences",
                    type: "textarea",
                    label: "Preferences",
                    colSpan: "col-span-12",
                },

                // {
                //     name: "is_system_user",
                //     type: "checkbox",
                //     label: "System User",
                //     colSpan: "col-span-12 md:col-span-4",
                // },
            ],
        },
    ];
};

export default fields;
