import { toast } from "react-hot-toast";

const fields = (form) => {
    return [
        // =============== Project Dates ===============
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
            rules: { required: "End date is required" },
        },

        // =============== Project Employee ===============
        {
            name: "employee_id",
            type: "async-select",
            label: "Employee",
            loadOptions: ["hrm/employees", "employees", "employTemplate"],
            placeholder: "Select an employee (optional)",

            handleChange: (selectedEmployee, form, field) => {
                if (selectedEmployee) {
                    // Get current form values
                    const startDate = form.getValues("start_date") || "";
                    const endDate = form.getValues("end_date") || "";

                    const newEmployee = {
                        id: selectedEmployee.value, // important for uniqueness
                        name: selectedEmployee.label || "",
                        start_date: startDate,
                        end_date: endDate,
                        salary_type: "monthly",
                        basic_salary: 0,
                        status: "active",
                    };

                    // Check existing employees in assignEmployees
                    const existingEmployees =
                        form.getValues("assignEmployees") || [];
                    const exists = existingEmployees.some(
                        (emp) => emp.id === newEmployee.id
                    );

                    if (exists) {
                        toast.error("Employee already assigned!");
                    } else {
                        // Append new employee assignment with pre-filled data
                        form.fields.append(newEmployee);
                    }

                    // Clear the employee selection
                    field.onChange(null);
                }
            },

            colSpan: "col-span-12 md:col-span-6",
        },

        // =============== Assign Employees ===============
        {
            name: "assignEmployees",
            type: "group-form",
            label: "Assign Employees",
            placeholder: "Add employee assignment",
            colSpan: "col-span-12",
            addButtonLabel: false,
            fields: [
                {
                    name: "name",
                    type: "text",
                    label: "Employee Name *",
                    placeholder: "Enter employee full name",
                    colSpan: "col-span-12 md:col-span-6",
                    rules: { required: "Employee name is required" },
                },
                {
                    name: "start_date",
                    type: "date",
                    label: "Start Date *",
                    placeholder: "Select start date",
                    colSpan: "col-span-12 md:col-span-6",
                    rules: { required: "Start date is required" },
                },
                {
                    name: "end_date",
                    type: "date",
                    label: "End Date *",
                    placeholder: "Select end date",
                    colSpan: "col-span-12 md:col-span-6",
                    rules: { required: "End date is required" },
                },
                {
                    name: "salary_type",
                    type: "select",
                    label: "Salary Type *",
                    placeholder: "Select salary type",
                    colSpan: "col-span-12 md:col-span-6",
                    options: [
                        { label: "Hourly", value: "hourly" },
                        { label: "Monthly", value: "monthly" },
                        { label: "Weekly", value: "weekly" },
                        { label: "Daily", value: "daily" },
                    ],
                    rules: { required: "Salary type is required" },
                },
                {
                    name: "basic_salary",
                    type: "number",
                    label: "Basic Salary *",
                    placeholder: "Enter basic salary",
                    colSpan: "col-span-12 md:col-span-6",
                    rules: { required: "Basic salary is required" },
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
                    rules: { required: "Status is required" },
                },
            ],
        },
    ];
};

export default fields;
