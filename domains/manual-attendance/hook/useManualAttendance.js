import { useForm, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";
import { useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
    debounce,
    handleServerValidationErrors,
    formReset,
    normalizeSelectValues,
} from "@/utility/helpers";
import {
    useUpdateManualAttendanceMutation,
    useDeleteManualAttendanceMutation,
    useFetchManualAttendancesQuery,
    useLazyFilterEmployeesForAttendanceQuery,
    useCreateManualAttendanceMutation,
    useApproveManualAttendanceMutation,
    useBulkApproveManualAttendanceMutation,
} from "../services/manualAttendanceApi";
import {
    branchSearchTemplate,
    departmentSearchTemplate,
    projectTemplate,
} from "@/utility/templateHelper";
import useAuth from "@/domains/auth/hooks/useAuth";
import dayjs from "dayjs";
export const useManualAttendance = () => {
    // RTK Query mutations
    const [updateManualAttendance] = useUpdateManualAttendanceMutation();
    const [deleteManualAttendance] = useDeleteManualAttendanceMutation();
    const [createManualAttendance] = useCreateManualAttendanceMutation();
    const [approveManualAttendance] = useApproveManualAttendanceMutation();
    const [bulkApproveManualAttendance] = useBulkApproveManualAttendanceMutation();

    const { user } = useAuth();
    const roleLevel = Number(user?.user?.roles?.[0]?.level ?? user?.role_id);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [filters, setFilters] = useState({});

    const pageFromUrl = searchParams.get("page") || "1";
    const queryParams = {
        ...filters,
        ...(pageFromUrl ? { page: pageFromUrl } : {}),
    };

    // Lazy query for employee filter
    const [
        filterEmployees,
        { data: employeeFilterResults, isFetching: isFiltering },
    ] = useLazyFilterEmployeesForAttendanceQuery();

    // Fetch query
    const {
        data: manualAttendanceData,
        refetch,
        isFetching,
    } = useFetchManualAttendancesQuery(queryParams);

    const defaultValue = {
        attendance_type: "company_attendance",
        branch_id:
            branchSearchTemplate(
                user?.employee?.branch ? [user?.employee?.branch] : [],
            )?.at(0) ?? null,
        department_id:
            departmentSearchTemplate(
                user?.employee?.department ? [user?.employee?.department] : [],
            )?.at(0) ?? null,
        attendance_scope: "all_attendance",
        adjustment_type: "increment",
        salary_type: "monthly",
        global_date: dayjs().format("YYYY-MM-DD"),
    };

    // Form
    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
        defaultValues: defaultValue,
    });

    const fieldArray = useFieldArray({
        control: form.control,
        name: "employees", // This matches the field name in form
    });

    // Debounced filter function
    async function handleEmployeeFilter(filterTerm) {
        try {
            // const response = await filterEmployees(filterTerm);
            // fieldArray.remove();
            // response?.data?.data?.forEach((item) => {
            //     fieldArray.append({
            //         name: `${item.first_name} ${item.last_name}`,
            //         employee_id: item.id,
            //         date: form.getValues("global_date") || defaultValue.global_date,
            //         check_in_time: form.getValues("global_check_in_time") || "",
            //         check_out_time: form.getValues("global_check_out_time") || "",
            //     });
            // });
        } catch (error) {
            console.error("Employee filter error:", error);
            toast.error("Failed to filter employees");
        }
    }
    // State object
    const manualAttendanceState = {
        data: manualAttendanceData?.data?.master_attendances || [],
        form: {
            ...form,
            defaultValue: defaultValue,
            fields: fieldArray,
        },
        refetch,
        pagination: manualAttendanceData?.data?.pagination || {},
        isFetching,
        employeeFilterResults: employeeFilterResults?.data || [],
        isFiltering,
    };

    // Actions
    const actions = {
        // Utility function to format date
        formatDateForForm: (dateString) => {
            if (!dateString) return "";
            try {
                const date = new Date(dateString); // create date from your string
                date.setDate(date.getDate() + 1); // add 1 day
                return date.toISOString().split("T")[0]; // format as YYYY-MM-DD
            } catch (error) {
                console.error("Date formatting error:", error);
                return "";
            }
        },

        // Utility function to get employee name from different formats
        getEmployeeName: (employee) => {
            if (!employee) return "";
            if (employee.name) return employee.name;
            if (employee.first_name && employee.last_name) {
                return `${employee.first_name} ${employee.last_name}`;
            }
            if (employee.first_name) return employee.first_name;
            return "";
        },

        // Validate form data before submission
        validateFormData: (data) => {
            console.log(data);

            const errors = [];

            if (!data.attendance_type) {
                errors.push("Attendance type is required");
            }

            if (!data.global_date) {
                errors.push("Global date is required");
            }

            if (!data.global_check_in_time) {
                errors.push("Global check-in time is required");
            }

            if (!data.global_check_out_time) {
                errors.push("Global check-out time is required");
            }

            if (!data.employees || data.employees.length === 0) {
                errors.push("At least one employee is required");
            }

            // Validate each employee
            data?.employees?.forEach((emp, index) => {
                if (!emp.employee_id) {
                    errors.push(
                        `Employee ${index + 1}: Employee ID is required`,
                    );
                }
                if (!emp.name) {
                    errors.push(
                        `Employee ${index + 1}: Employee name is required`,
                    );
                }
                if (!emp.date) {
                    errors.push(`Employee ${index + 1}: Date is required`);
                }
                if (!emp.check_in_time) {
                    errors.push(
                        `Employee ${index + 1}: Check-in time is required`,
                    );
                }
                // if (!emp.check_out_time) {
                //     errors.push(
                //         `Employee ${index + 1}: Check-out time is required`
                //     );
                // }
            });

            return errors;
        },

        onCreate: async (data) => {
            try {
                if (form.watch("model_for") === "bulk_approve_manual_attendance") {
                    const selectedItems =
                        form.selectedData?.employees?.items || [];

                    if (selectedItems.length === 0) {
                        toast.error(
                            "Please select at least one pending attendance record",
                        );
                        return;
                    }

                    const pendingItems = selectedItems
                        .map((item) => ({
                            id: item.master_attendance_id,
                            employee_id: item.employee_id,
                            date: item.date
                                ? dayjs(item.date).format("YYYY-MM-DD")
                                : null,
                        }))
                        .filter((item) => item.id && item.employee_id);

                    const response =
                        await bulkApproveManualAttendance(pendingItems).unwrap();

                    if (response.success || response) {
                        const approvedCount = response?.data?.approved_count;
                        toast.success(
                            approvedCount
                                ? `${approvedCount} attendance record(s) approved successfully`
                                : "Manual attendances approved successfully",
                        );
                        refetch();
                        formReset(form);
                        form.setValue("openModel", false);
                    }

                    return;
                }

                if (data.attendance_scope != "all_attendance") {
                    const validationErrors = actions.validateFormData(data);
                    if (validationErrors.length > 0) {
                        toast.error(
                            `Validation failed: ${validationErrors[0]}`,
                        );
                        return;
                    }
                }
                // Validate form data

                let value = normalizeSelectValues(data, [
                    "branch_id",
                    "department_id",
                    "project_id",
                ]);

                const response = await createManualAttendance(value).unwrap();
                if (response.success) {
                    toast.success("Master attendance created successfully");
                    refetch();
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                if (apiErrors?.data?.errors?.employees) {
                    const employeeErrors = apiErrors.data.errors.employees;
                    if (Array.isArray(employeeErrors)) {
                        toast.error(employeeErrors[0]);
                    }
                }
                // Handle server validation errors
                handleServerValidationErrors(apiErrors, form.setError);

                // Show specific error messages for duplicate attendance

                throw apiErrors;
            }
        },

        onEdit: (masterAttendanceData) => {
            console.log(masterAttendanceData);

            try {
                // Validate input data
                if (!masterAttendanceData) {
                    toast.error("Invalid attendance data provided for editing");
                    return;
                }

                // Small helper for H:i format (24h)
                const formatTime = (time) => {
                    if (!time) return "";
                    // Check if it's already HH:mm
                    if (
                        /^\d{2}:\d{2}$/.test(time) ||
                        /^\d{2}:\d{2}:\d{2}$/.test(time)
                    ) {
                        return time.slice(0, 5);
                    }
                    try {
                        const d = new Date(`1970-01-01T${time}`);
                        const hours = String(d.getHours()).padStart(2, "0");
                        const minutes = String(d.getMinutes()).padStart(2, "0");
                        return `${hours}:${minutes}`;
                    } catch {
                        return time;
                    }
                };

                // Check for single attendance edit structure (row.original mapped by new API)
                if (
                    masterAttendanceData.master_attendance_id &&
                    masterAttendanceData.employee_id &&
                    masterAttendanceData.check_in_time
                ) {
                    form.reset({
                        model_for: "single_edit",
                        id: masterAttendanceData.master_attendance_id,
                        employee_id: masterAttendanceData.employee_id,
                        date: dayjs(masterAttendanceData.date).format(
                            "YYYY-MM-DD",
                        ),
                        check_in_time: formatTime(
                            masterAttendanceData.check_in_time,
                        ),
                        check_out_time: formatTime(
                            masterAttendanceData.check_out_time,
                        ),
                        openModel: true,
                    });
                    return;
                }

                // Handle both raw API data and transformed tableData
                const isRawApiData =
                    masterAttendanceData.attendance_type &&
                    masterAttendanceData.attendances;

                let formData;

                if (isRawApiData) {
                    // Handle raw API data structure
                    formData = {
                        ...defaultValue,
                        id: masterAttendanceData.id,
                        attendance_scope:
                            masterAttendanceData.attendance_scope ??
                            defaultValue.attendance_scope,
                        attendance_type:
                            masterAttendanceData.attendance_type ??
                            defaultValue.attendance_type,
                        // model_for: masterAttendanceData?.attendances[0]?.adjustment_type ? "adjust_hours" : false,
                        adjustment_type:
                            masterAttendanceData?.attendances[0]
                                ?.adjustment_type || null,
                        salary_type:
                            masterAttendanceData?.salary_type ??
                            defaultValue.salary_type,
                        global_date: actions.formatDateForForm(
                            masterAttendanceData.global_date,
                        ),
                        global_check_in_time: formatTime(
                            masterAttendanceData.global_check_in_time,
                        ),
                        global_check_out_time: formatTime(
                            masterAttendanceData.global_check_out_time,
                        ),
                        branch_id:
                            branchSearchTemplate(
                                masterAttendanceData?.branch
                                    ? [masterAttendanceData.branch]
                                    : [],
                            )?.at(0) ?? null,
                        department_id:
                            departmentSearchTemplate(
                                masterAttendanceData?.department
                                    ? [masterAttendanceData.department]
                                    : [],
                            )?.at(0) ?? null,
                        project_id:
                            projectTemplate(
                                masterAttendanceData?.project
                                    ? [masterAttendanceData.project]
                                    : [],
                            )?.at(0) ?? null,
                        notes: masterAttendanceData.notes || "",
                        // Prepare employee data from raw attendances array
                        employees: (masterAttendanceData.attendances || []).map(
                            (attendance) => ({
                                employee_id: attendance.employee_id,
                                name: actions.getEmployeeName(
                                    attendance.employee,
                                ),
                                date: actions.formatDateForForm(
                                    attendance.date,
                                ),
                                check_in_time: formatTime(
                                    attendance.check_in_time,
                                ),
                                check_out_time: formatTime(
                                    attendance.check_out_time,
                                ),
                                status: attendance.status || "present",
                            }),
                        ),
                    };
                } else {
                    // Handle transformed tableData structure
                    formData = {
                        ...defaultValue,
                        id:
                            masterAttendanceData.id ||
                            masterAttendanceData.masterAttendanceId,
                        attendance_type:
                            masterAttendanceData.attendanceType ??
                            defaultValue.attendance_type,
                        global_date: masterAttendanceData.globalDate,
                        global_check_in_time: formatTime(
                            masterAttendanceData.globalCheckInTime,
                        ),
                        global_check_out_time: formatTime(
                            masterAttendanceData.globalCheckOutTime,
                        ),
                        project_id: masterAttendanceData.project?.id || null,
                        notes: masterAttendanceData.notes || "",
                        openModel: true,
                        // Prepare employee data for editing from employeeAttendances
                        employees: (
                            masterAttendanceData.employeeAttendances || []
                        ).map((empAtt) => ({
                            employee_id: empAtt.employeeId,
                            name: empAtt.employeeName,
                            date: actions.formatDateForForm(empAtt.date),
                            check_in_time: formatTime(empAtt.checkInTime),
                            check_out_time: formatTime(empAtt.checkOutTime),
                            status: empAtt.status || "present",
                        })),
                    };
                }

                form.reset(formData);

                // Clear existing field array and populate with employee data
                fieldArray.remove();
                formData.employees.forEach((employee) => {
                    fieldArray.append(employee);
                });

                form.setValue("openModel", true);
            } catch (error) {
                console.error("Error in onEdit:", error);
                toast.error(
                    "Failed to prepare data for editing. Please try again.",
                );
            }
        },
        onUpdate: async (data) => {
            try {
                if (data.model_for === "single_edit") {
                    const { id, ...rest } = data;
                    const response = await updateManualAttendance({
                        id,
                        ...rest,
                    }).unwrap();

                    if (response.success || response) {
                        toast.success("Attendance updated successfully");
                        refetch();
                        formReset(form);
                        form.setValue("openModel", false);
                    }
                    return;
                }

                // Validate form data
                const validationErrors = actions.validateFormData(data);
                if (validationErrors.length > 0) {
                    toast.error(`Validation failed: ${validationErrors[0]}`);
                    return;
                }

                const { id, ...rest } = data;

                const preparedData = normalizeSelectValues(rest, [
                    "branch_id",
                    "department_id",
                    "project_id",
                ]);

                // 🟢 Fix for monthly salary: convert empty strings to null
                if (
                    preparedData.salary_type === "monthly" &&
                    Array.isArray(preparedData.employees)
                ) {
                    preparedData.employees = preparedData.employees.map(
                        (emp) => ({
                            ...emp,
                            check_out_time: emp.check_out_time?.trim() || null,
                        }),
                    );
                }

                const response = await updateManualAttendance({
                    id,
                    ...preparedData,
                }).unwrap();

                if (response.success) {
                    toast.success("Master attendance updated successfully");
                    refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);

                if (apiErrors?.data?.errors?.employees) {
                    const employeeErrors = apiErrors.data.errors.employees;
                    if (Array.isArray(employeeErrors)) {
                        toast.error(employeeErrors[0]);
                    }
                }

                throw apiErrors;
            }
        },

        onDelete: async (data) => {
            try {
                // Ensure we have the necessary identifiers
                const masterId = data?.master_attendance_id || data?.id;
                const empId =
                    data?.employee_id ||
                    (data?.employee ? data.employee.id : null);
                // Format date to YYYY-MM-DD for backend consistency
                const attDate = data?.date
                    ? dayjs(data.date).format("YYYY-MM-DD")
                    : null;

                if (!masterId || !empId || !attDate) {
                    toast.error(
                        "Missing required information to delete attendance",
                    );
                    console.error("Missing fields:", {
                        masterId,
                        empId,
                        attDate,
                        originalData: data,
                    });
                    return;
                }

                if (
                    confirm(
                        "Are you sure you want to delete this employee's attendance for this date? If this is the last entry, the master record will also be removed.",
                    )
                ) {
                    const response = await deleteManualAttendance({
                        id: masterId,
                        employee_id: empId,
                        date: attDate,
                    }).unwrap();

                    if (response.success || response) {
                        toast.success("Attendance record deleted successfully");
                        refetch();
                    } else {
                        toast.error("Failed to delete attendance record");
                    }
                }
            } catch (error) {
                console.error("Delete attendance error:", error);
                toast.error(
                    error?.data?.message ||
                        "Something went wrong while deleting attendance",
                );
            }
        },

        onApprove: async (data) => {
            try {
                const masterId = data?.master_attendance_id || data?.id;
                const employeeId =
                    data?.employee_id ||
                    (data?.employee ? data.employee.id : null);
                const attendanceDate = data?.date
                    ? dayjs(data.date).format("YYYY-MM-DD")
                    : null;

                if (!masterId || !employeeId) {
                    toast.error("Missing required information to approve attendance");
                    return;
                }

                const response = await approveManualAttendance({
                    id: masterId,
                    employee_id: employeeId,
                    date: attendanceDate,
                }).unwrap();

                if (response.success || response) {
                    toast.success("Manual attendance approved successfully");
                    refetch();
                }
            } catch (error) {
                toast.error(
                    error?.data?.message ||
                        "Something went wrong while approving attendance",
                );
            }
        },

        onBulkApprove: async () => {
            form.selectedData = {};
            form.reset({
                openModel: true,
                model_for: "bulk_approve_manual_attendance",
                approval_status: "pending",
                employees: [],
                selectedId: [],
            });
        },

        roleLevel,

        // View details of a master attendance
        onViewDetails: (masterAttendanceData) => {
            return {
                masterInfo: {
                    id: masterAttendanceData.id,
                    type: masterAttendanceData.attendanceTypeDisplay,
                    date: masterAttendanceData.displayDate,
                    timeRange: masterAttendanceData.displayTimeRange,
                    project: masterAttendanceData.displayProject,
                    notes: masterAttendanceData.notes,
                    creator: masterAttendanceData.displayCreator,
                    status: masterAttendanceData.displayStatus,
                },
                employees: masterAttendanceData.employeeAttendances,
                statistics: masterAttendanceData.statistics,
            };
        },

        // Filter and search functions
        onSearch: (searchTerm) => {
            // You can implement search logic here
            // This could trigger a new API call with search parameters
            refetch({ search: searchTerm });
        },

        onFilter: (filters) => {
            // Handle filtering by attendance type, date range, etc.
            refetch(filters);
        },

        // Debug helper function
        debugFormData: () => {
            const formValues = form.getValues();
            const fieldArrayValues = fieldArray.fields;
            return { formValues, fieldArrayValues };
        },

        // Employee filtering for attendance creation
        onAttendanceTypeChange: async () => {
            try {
                const value = form.getValues();
                const {
                    branch_id,
                    department_id,
                    project_id,
                    attendance_type,
                } = normalizeSelectValues(value, [
                    "branch_id",
                    "department_id",
                    "project_id",
                ]);
                let currentValueIs = {
                    branch_id,
                    department_id,
                    project_id,
                    attendance_type,
                };

                await handleEmployeeFilter(currentValueIs);
                // return employeeFilterResults?.data || [];
            } catch (error) {
                console.error("Employee filter error:", error);
                toast.error("Failed to filter employees");
                return [];
            }
        },
        onAddAttendance: async () => {
            form.reset({ openModel: true, ...defaultValue });
        },
        onAdjustHours: async () => {
            form.reset({
                openModel: true,
                model_for: "adjust_hours",
                ...defaultValue,
            });
        },
    };

    return {
        actions,
        manualAttendanceState,
    };
};
