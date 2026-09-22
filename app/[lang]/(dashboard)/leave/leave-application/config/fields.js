import useAuth from "@/domains/auth/hooks/useAuth";
import { branchSearchTemplate } from "@/utility/templateHelper";

const fields = (form, actions) => {
    const { user } = useAuth();
    const roleLevel = user?.user?.roles?.[0]?.level ?? null;
    const level = Number(roleLevel);

    const isAssignedToProject = user?.isAssignedToProject === true;
    const isResponsibleForProject = user?.isResponsibleForProject === true;

    const isEmployee = user?.employee && level === 3;

    // console.log(user);

    const isView = form.watch("mode") === "view"; // 🔑 detect view mode
    const isEdit = form.watch("mode") === "edit"; // 🔑 detect view mode

    // Prepare type options
    let preparedData = [];

    // Company / HR / Admin logic
    if (user?.employee && (level === 1 || level === 2)) {
        console.log("admin or manager");

        preparedData = isAssignedToProject
            ? [
                  {
                      label: "Single project wise leave",
                      value: "single_project_leave",
                  },
                  { label: "Department wise leave", value: "department_leave" },
                  { label: "Project wise leave", value: "project_leave" },
              ]
            : [
                  { label: "Single leave", value: "single_leave" },
                  { label: "Department wise leave", value: "department_leave" },
                  { label: "Project wise leave", value: "project_leave" },
              ];
    } else if (isEmployee) {
        console.log("Employee");

        preparedData = isAssignedToProject
            ? [
                  {
                      label: "Single project wise leave",
                      value: "single_project_leave",
                  },
              ]
            : [{ label: "Single leave", value: "single_leave" }];
    } else {
        console.log("Company");
        preparedData = [
            { label: "Department wise leave", value: "department_leave" },
            { label: "Project wise leave", value: "project_leave" },
        ];
    }

    if (form.watch("model_for") == "delete_group_leave") {
        preparedData = [
            { label: "Department wise leave", value: "department_leave" },
            { label: "Project wise leave", value: "project_leave" },
        ];
    }
    if (form.watch("model_for") == "approve_single_leave") {
        preparedData = [
            { label: "Single leave", value: "single_leave" },
            {
                label: "Single project wise leave",
                value: "single_project_leave",
            },
        ];
    }

    // Prepare employee details load option
    let preparedLoadOptions = [];

    if (form.watch("model_for") == "approve_single_leave") {
        preparedLoadOptions = [
            "leave/leave_application", // URL
            "leave_details", // dataKey in response
            // dataMapper function
            (leave) => {
                const employee = leave.employee || {};

                return {
                    id: leave.id,
                    start_date:
                        actions.formatDateForForm(leave.start_date) || "",
                    end_date: actions.formatDateForForm(leave.end_date) || "",
                    employee_name:
                        [employee.first_name || "", employee.last_name || ""]
                            .join(" ")
                            .trim() || "Unknown",
                    employee_code: employee.employee_code || "N/A",
                    employee_phone:
                        employee.primary_phone ||
                        employee.contact_info?.primary_phone ||
                        "",
                    leave_reason:
                        leave.reason?.name || leave.other_reason || "No reason",
                };
            },
            // filterFields - fields to use as filters from form
            ["project_id", "start_date", "end_date", "leave_type_id", "type"],
        ];
    } else if (form.watch("model_for") == "delete_group_leave") {
        preparedLoadOptions = [
            "leave/leave_application", // URL
            "leave_details", // dataKey in response
            // dataMapper function
            (leave) => {
                const employee = leave.employee || {};

                return {
                    id: leave.id,
                    start_date:
                        actions.formatDateForForm(leave.start_date) || "",
                    end_date: actions.formatDateForForm(leave.end_date) || "",
                    employee_name:
                        [employee.first_name || "", employee.last_name || ""]
                            .join(" ")
                            .trim() || "Unknown",
                    employee_code: employee.employee_code || "N/A",
                    employee_phone:
                        employee.primary_phone ||
                        employee.contact_info?.primary_phone ||
                        "",
                };
            },
            // filterFields - fields to use as filters from form
            [
                "project_id",
                "start_date",
                "department_id",
                "end_date",
                "leave_type_id",
                "type",
                "model_for",
            ],
        ];
    } else {
        preparedLoadOptions = [
            "hrm/employees", // URL
            "employees", // dataKey in response
            // dataMapper function
            (employee) => ({
                id: employee.id,
                employee_name:
                    employee.personal_info?.full_name ||
                    `${employee.personal_info?.first_name || ""} ${
                        employee.personal_info?.last_name || ""
                    }`.trim() ||
                    employee.first_name ||
                    "Unknown",
                employee_email:
                    employee.contact_info?.work_email ||
                    employee.contact_info?.primary_email ||
                    employee.work_email ||
                    "",
                employee_phone:
                    employee.contact_info?.primary_phone ||
                    employee.primary_phone ||
                    "",
            }),
            // filterFields - fields to use as filters from form
            [
                "branch_id",
                `${
                    form.watch("type") == "department_leave"
                        ? "department_id"
                        : "project_id"
                }`,
            ],
        ];
    }

    return [
        {
            name: "start_date",
            type: "date",
            label: "Start Date *",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView,
            rules: { required: "Start date is required" },
        },
        {
            name: "end_date",
            type: "date",
            label: "End Date *",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView,
            rules: {
                required: "End date is required",
                validate: (value) =>
                    new Date(value) >= new Date(form?.watch("start_date")) ||
                    "End date cannot be before start date",
            },
        },
        {
            name: "leave_type_id",
            type: "async-select",
            label: "Leave Type *",
            loadOptions: [
                "leave/leave_type",
                "leave_types",
                "leaveTypeSearchTemplate",
            ],
            placeholder: "Select",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView,
            rules: { required: "Leave type is required" },
        },
        {
            name: "type",
            type: "select",
            label: "Type *",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView || isEdit,
            options: preparedData,
            handleChange: (e) => {
                if (isView) return; // prevent changes in view mode
                const value = e?.value ?? null;
                form.setValue("type", value);
                form.setValue(
                    "branch_id",
                    branchSearchTemplate(
                        user?.employee?.branch ? [user?.employee?.branch] : [],
                    )?.at(0) ?? null,
                );
                form.setValue("department_id", null);
                form.setValue("employee_ids", null);
                form.setValue("project_id", null);
                if (
                    value === "project_leave" ||
                    value === "single_project_leave"
                ) {
                    form.setValue("employee_id", user?.employee?.id);
                }
            },
            rules: { required: "Type is required" },
        },
        {
            name: "leave_status",
            type: "select",
            label: "Leave Status *",
            colSpan: "col-span-12 md:col-span-4",
            options: [
                { label: "Approve", value: "approved" },
                { label: "Reject", value: "rejected" },
            ],
            visibility: form.watch("model_for") == "approve_single_leave",
            rules: { required: "Leave Status is required" },
        },
        {
            name: "branch_id",
            type: "async-select",
            label: "Branch *",
            visibility:
                form.watch("type") === "department_leave" ||
                form.watch("type") === "project_leave" ||
                form.watch("type") === "single_project_leave" ||
                (form.watch("model_for") == "approve_single_leave" &&
                    form.watch("type") === "single_leave"),
            loadOptions: [
                "organization/branches",
                "branches",
                "branchSearchTemplate",
            ],
            placeholder: "Select",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView,
        },

        {
            name: "department_id",
            type: "async-select",
            label: "Department",
            visibility:
                form.watch("type") === "department_leave" ||
                (form.watch("model_for") == "approve_single_leave" &&
                    form.watch("type") === "single_leave"),
            loadOptions: [
                "organization/departments",
                "departments",
                "departmentSearchTemplate",
                ["branch_id", "type"],
            ],
            placeholder: "Optional",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView,
        },
        {
            name: "project_id",
            type: "async-select",
            label: "Project",
            visibility:
                form.watch("type") === "project_leave" ||
                form.watch("type") === "single_project_leave",
            loadOptions: [
                "projects",
                "projects",
                "projectTemplate",
                ["branch_id", "employee_id", "type", "user_type"],
            ],
            placeholder: "Optional",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView,
        },
        {
            name: "reason_id",
            type: "async-select",
            label: "Leave Reason *",
            loadOptions: [
                "leave/leave_reason",
                "leave_reasons",
                "leaveReasonSearchTemplate",
            ],
            lastChildren: [{ label: "Other", value: "other" }],
            placeholder: "Select",
            colSpan: "col-span-12 md:col-span-4",
            handleChange: (e) => {
                if (isView) return;
                form.setValue("reason_id", e);
                form.setValue("other_reason", "");
            },
            disabled: isView,
            visibility:
                form.watch("model_for") != "delete_group_leave" &&
                form.watch("model_for") != "approve_single_leave",
            rules: { required: "Leave reason is required" },
        },
        {
            name: "other_reason",
            type: "text",
            label: "Other Reason *",
            placeholder: "Enter other reason name",
            colSpan: "col-span-12 md:col-span-4",
            visibility: form?.watch("reason_id")?.value === "other",
            rules: { required: "Other reason is required" },
            disabled: isView,
        },
        {
            name: "process_button",
            type: "button",
            placeholder: "Process Leave",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView,
            visibility:
                form.watch("model_for") == "approve_single_leave" ||
                form.watch("type") === "department_leave" ||
                form.watch("type") === "project_leave",
            handleChange: (e, form) => {
                // Trigger the paginated component to load data
                // Use setTimeout to ensure component is mounted
                setTimeout(() => {
                    if (
                        form._paginatedLoaders &&
                        form._paginatedLoaders.employee_details
                    ) {
                        form._paginatedLoaders.employee_details();
                    } else {
                        console.warn(
                            "Paginated loader not found for employee_details",
                        );
                    }
                }, 100);
            },
        },
        {
            name: "remarks",
            type: "textarea",
            label: "Remarks",
            placeholder: "Optional remarks",
            colSpan: "col-span-12",
            rules: { maxLength: { value: 500, message: "Max 500 characters" } },
            disabled: isView,
            visibility:
                form.watch("model_for") != "delete_group_leave" &&
                form.watch("model_for") != "approve_single_leave",
        },
        {
            name: "application_file",
            type: "file",
            label: "Application File",
            placeholder: isEdit
                ? "Upload a new PDF, DOC, or DOCX to replace the current file"
                : "Optional PDF, DOC, or DOCX file",
            colSpan: "col-span-12 md:col-span-6",
            disabled: isView,
            inputProps: {
                accept: ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                onViewFile: () => actions?.onViewCurrentFile?.(),
                viewFileLabel: "View application file",
            },
            visibility:
                (((isView || isEdit) && !!form.watch("application_file")) ||
                    (isEdit &&
                        (form.watch("type") === "single_leave" ||
                            form.watch("type") === "single_project_leave")) ||
                    (form.watch("model_for") != "delete_group_leave" &&
                        form.watch("model_for") != "approve_single_leave" &&
                        (!form.watch("type") ||
                            form.watch("type") === "single_leave" ||
                            form.watch("type") === "single_project_leave"))),
        },

        // ===== Dynamic Employee Details with Pagination =====
        {
            name: "employee_details",
            type: "group-form-paginated",
            label: "Employee Details (Check to exclude employee from leave)",
            colSpan: "col-span-12",
            addButtonLabel: false,
            isDelete: false,
            maxHeight: "400px",
            loadMoreLabel: "Load More Employees",
            perPage: 10,
            autoLoad: false, // Will be triggered by Process button
            enableSearch: true,
            searchPlaceholder: "Search employees by name, email, or phone...",

            visibility:
                form.watch("model_for") == "approve_single_leave" ||
                form.watch("type") === "department_leave" ||
                form.watch("type") === "project_leave",
            loadOptions: preparedLoadOptions,
            fields: [
                {
                    name: "is_selected",
                    type: "checkbox",
                    label: "Select",
                    colSpan: "col-span-12 md:col-span-1",
                    disabled: isView,
                },
                {
                    name: "employee_name",
                    type: "text",
                    label: "Employee Name",
                    colSpan: `col-span-12 ${
                        form.watch("model_for") == "approve_single_leave"
                            ? "md:col-span-2"
                            : "md:col-span-4"
                    }`,
                    disabled: true,
                },
                {
                    name: "start_date",
                    type: "date",
                    label: "Start Date",
                    colSpan: "col-span-12 md:col-span-2",
                    disabled: true,
                    visibility:
                        form.watch("model_for") == "approve_single_leave",
                },
                {
                    name: "end_date",
                    type: "date",
                    label: "End Date",
                    colSpan: "col-span-12 md:col-span-2",
                    disabled: true,
                    visibility:
                        form.watch("model_for") == "approve_single_leave",
                },
                {
                    name: "employee_id",
                    type: "text",
                    label: "Employee ID",
                    colSpan: "col-span-12 md:col-span-6",
                    disabled: true,
                    visibility: false,
                },
                {
                    name: "employee_code",
                    type: "text",
                    label: "Employee Code",
                    colSpan: "col-span-12 md:col-span-4",
                    disabled: true,
                    visibility:
                        form.watch("model_for") != "approve_single_leave",
                },
                {
                    name: "employee_phone",
                    type: "text",
                    label: "Employee Phone",
                    colSpan: `col-span-12 ${
                        form.watch("model_for") == "approve_single_leave"
                            ? "md:col-span-2"
                            : "md:col-span-3"
                    }`,
                    disabled: true,
                },
                {
                    name: "leave_reason",
                    type: "text",
                    label: "Reason",
                    colSpan: "col-span-12 md:col-span-3",
                    disabled: true,
                    visibility:
                        form.watch("model_for") == "approve_single_leave",
                },
            ],
        },
    ];
};

export default fields;
