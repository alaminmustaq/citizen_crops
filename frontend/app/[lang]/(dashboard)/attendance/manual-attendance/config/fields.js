import toast from "react-hot-toast";

const fields = (actions,form) => {
    return [
        {
            name: "attendance_type",
            type: "select",
            label: "Attendance For *",
            colSpan: "col-span-12 md:col-span-6",
            options: [
                {
                    label: "Company wise Attendance",
                    value: "company_attendance",
                },
                {
                    label: "Project wise Attendance",
                    value: "project_attendance",
                },
            ],
            handleChange: (e) => {   
                form.setValue('attendance_type',e.value)
                form.setValue('branch_id',null)
                form.setValue('department_id',null)
                form.setValue('project_id',null) 
            },
            disabled:form.watch('id'),
            rules: { required: "Status is required" },
        },
        {
            name: "branch_id",
            type: "async-select",
            label: "Branch",
            visibility: form.watch("attendance_type") === "company_attendance",
            loadOptions: [
                "organization/branches",
                "branches",
                "branchSearchTemplate",
            
            ],
            placeholder: "Optional",
            colSpan: "col-span-12 md:col-span-6",
            handleChange: (e) => {  
            
                form.setValue('branch_id',e) 
                actions.onAttendanceTypeChange();
            },
            disabled:form.watch('id'),
        },  
        {
            name: "department_id",
            type: "async-select",
            label: "Department",
            visibility: form.watch("attendance_type") === "company_attendance",
            loadOptions: [
                "organization/departments",
                "departments",
                "departmentSearchTemplate",
            ],
            handleChange: (e) => {  
              
                form.setValue('department_id',e) 
                actions.onAttendanceTypeChange();
            },
            disabled:form.watch('id'),
            placeholder: "Optional",
            colSpan: "col-span-12 md:col-span-6",
        },
        {
            name: "project_id",
            type: "async-select",
            label: "Project",
            visibility: form.watch("attendance_type") === "project_attendance",
            loadOptions: [
                "projects",
                "projects",
                "projectTemplate",
            ],
            handleChange: (e) => {  
                form.setValue('project_id',e) 
                actions.onAttendanceTypeChange();
            },
            disabled:form.watch('id'),
            placeholder: "Optional",
            colSpan: "col-span-12 md:col-span-6",
        },
        {
            name: "attendance_scope", // renamed
            type: "select",
            label: "Attendance Scope *",
            colSpan: "col-span-12 md:col-span-6",
            options: [
                {
                    label: "All Attendance",
                    value: "all_attendance",
                },
                {
                    label: "Single Attendance",
                    value: "single_attendance",
                },
            ],
            handleChange: (e) => {   
                form.setValue('attendance_scope', e.value);

                // Clear single_attendance if switching to all attendance
                if (e.value === "all_attendance") {
                    form.setValue('single_attendance', null);
                }
            },
            disabled:form.watch('id'),
            rules: { required: "Attendance scope is required" },
        }, 
        {
            name: "single_attendance",
            type: "async-select",
            label: "Single Attendance *",
            visibility: form.watch("attendance_scope") === "single_attendance",
            loadOptions: [
                "hrm/filter-employees",
                "employees",
                "employTemplate",
                ["department_id","branch_id",'project_id']
              
            ],
            handleChange: (value) => {  
                const existingEmployees =
                        form.getValues("employees") || [];
                        console.log(existingEmployees);
                        
                    const exists = existingEmployees.some(
                        (emp) => emp.employee_id === value.value
                    );

                    if (exists) {
                        toast.error("Employee already assigned!");
                    } else {
                        // Append new employee assignment with pre-filled data
                        form.fields.append({
                            name: `${value.label}`,
                            employee_id: value.value,
                            check_in_time: "",
                            check_out_time: "",
                        })
                    }

            },
            placeholder: "Select employee",
            colSpan: "col-span-12 md:col-span-6", 
            rules: { required: "Single Attendance is required" },
        },


        // Global Settings Section
        {
            name: "global_date",
            type: "date",
            label: "Global Date *",
            placeholder: "Select attendance date",
            colSpan: "col-span-12 md:col-span-4",
            inputProps: { type: "date" },
            handleChange: (value, form) => {
                console.log(value);
                // Apply global date to all employees
                const employees = form.getValues("employees") || [];
                employees.forEach((_, index) => {
                    form.setValue(`employees.${index}.date`, value, {
                        shouldDirty: true,
                    });
                });
                form.trigger("employees"); // Trigger validation/re-render
                toast.success("Global date applied to all employees");
            },
            rules: { required: "Global date is required" },
        },
        {
            name: "global_check_in_time",
            type: "date",
            label: "Global Check-in Time *",
            placeholder: "Select global check-in time",
            colSpan: "col-span-12 md:col-span-4",
            inputProps: { type: "time" },
            handleChange: (value, form) => {
                // Apply global check-in time to all employees
                const employees = form.getValues("employees") || [];
                employees.forEach((_, index) => {
                    form.setValue(`employees.${index}.check_in_time`, value, {
                        shouldDirty: true,
                    });
                });
                form.trigger("employees"); // Trigger validation/re-render
                toast.success("Global check-in time applied to all employees");
            },
            rules: { required: "Global check-in time is required" },
        },
        {
            name: "global_check_out_time",
            type: "date",
            label: "Global Check-out Time *",
            placeholder: "Select global check-out time",
            colSpan: "col-span-12 md:col-span-4",
            inputProps: { type: "time" },
            handleChange: (value, form) => {
                // Apply global check-out time to all employees
                const employees = form.getValues("employees") || [];
                employees.forEach((_, index) => {
                    form.setValue(`employees.${index}.check_out_time`, value, {
                        shouldDirty: true,
                    });
                });
                form.trigger("employees"); // Trigger validation/re-render
                toast.success("Global check-out time applied to all employees");
            },
            rules: { required: "Global check-out time is required" },
        },

        {
            name: "employees",
            type: "group-form",
            label: "Employee Attendance",
            placeholder: "Add employees for attendance",
            colSpan: `col-span-12 ${form.watch('attendance_scope') == 'all_attendance' ? 'hidden':''}`,
            addButtonLabel: false,
            fields: [
                {
                    name: "name",
                    type: "text",
                    label: "Employee Name *",
                    placeholder: "Enter employee name",
                    colSpan: "col-span-12 md:col-span-3",
                    rules: { required: "Employee name is required" },
                },
                {
                    name: "date",
                    type: "date",
                    label: "Attendance Date *",
                    placeholder: "Select date",
                    colSpan: "col-span-12 md:col-span-3",
                    inputProps: { type: "date" },
                    rules: { required: "Date is required" },
                },
                {
                    name: "check_in_time",
                    type: "date",
                    label: "Check-in Time *",
                    placeholder: "Select check-in time",
                    colSpan: "col-span-12 md:col-span-3",
                    inputProps: { type: "time" },
                    rules: { required: "Check-in time is required" },
                },
                {
                    name: "check_out_time",
                    type: "date",
                    label: "Check-out Time *",
                    placeholder: "Select check-out time",
                    colSpan: "col-span-12 md:col-span-3",
                    inputProps: { type: "time" },
                    rules: { required: "Check-out time is required" },
                },
            ],
        },
    ];
};

export default fields;
