import {
    handleServerValidationErrors,
    formReset,
    normalizeSelectValues,
} from "@/utility/helpers";
import {
    useProjectCreateMutation,
    useProjectUpdateMutation,
    useProjectDeleteMutation,
    useProjectFetchQuery,
    useProjectSearchQuery,
    useProjectGetByIdQuery,
    useLazyProjectFetchQuery,
    useProjectUpdateAssignedEmployeesMutation,
} from "../services/projectApi";
import { setProjectData } from "../model/projectSlice";
import { jobPositionsTemplate, employTemplate, clientTemplate, branchSearchTemplate } from "@/utility/templateHelper";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { useRef } from "react";
import { useAppDispatch } from "@/hooks/use-redux";
import { useParams } from "next/navigation";

export const useProject = () => {
    const dispatch = useAppDispatch(); 
    const { id } = useParams();
    const [projectCreate] = useProjectCreateMutation();
    const [projectUpdate] = useProjectUpdateMutation();
    const [projectDelete] = useProjectDeleteMutation();
    const [projectUpdateAssignedEmployees] =
        useProjectUpdateAssignedEmployeesMutation();

    const {
        data: project,
        refetch,
        isFetching,
    } = useProjectFetchQuery(id ? { id } : "", {
        selectFromResult: (result) => {
            if (result?.data) {
                dispatch(setProjectData(result?.data?.data)); 
            } 
            return result; 
        },
    }); 

    //Lazy query
    const [triggerGetProject] = useLazyProjectFetchQuery();
    // Ref to prevent multiple simultaneous calls to setAssignEmployModel
    const isLoadingAssignEmployees = useRef(false);

    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
        defaultValues: {
            start_date: "",
            end_date: "",
            employee_id: null,
            assignEmployees: [], // Initialize the field array
            openModel: false,
        },
    });

    const fieldArray = useFieldArray({
        control: form.control,
        name: "assignEmployees", // This matches the field name in form
    });

    const projectState = {
        data: project?.data?.projects || [],
        form: {
            ...form,
            fields: fieldArray, // Merge fieldArray into form
        },
        refetch,
        pagination: project?.data?.pagination || {},
        isFetching,
    };

    const actions = {
        onCreate: async (data) => {
            try {
                const { openModel, employee_id, assignEmployees, ...payload } =
                    data;

                // Normalize employee_id array - extract values if objects
                const employeeList = (employee_id || []).map((item) =>
                    typeof item === "object" && item?.value ? item.value : item
                );

                // Prepare assigned employees data
                const assignedEmployees = (assignEmployees || []).map(
                    (emp) => ({
                        employee_id: emp.id,
                        name: emp.name,
                        start_date: emp.start_date,
                        end_date: emp.end_date,
                        salary_type: emp.salary_type,
                        basic_salary: parseFloat(emp.basic_salary) || 0,
                        status: emp.status,
                    })
                );

                // Prepare payload with normalized data
                const preparedData = normalizeSelectValues(
                    {
                        ...payload,
                        employee_id: employeeList,
                        assigned_employees: assignedEmployees,
                    },
                    ["job_position_id", "client_id","branch_id"]
                );

            

                const response = await projectCreate(preparedData).unwrap();

                if (response.success) {
                    toast.success("Project created successfully");
                    refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
            }
        },

        onEdit: (data) => {
            console.log(data);
            
            // Prepare employee data for editing using template
            const employeeData = data.employees?.length
                ? employTemplate(data.employees)
                : []; 

            // Prepare job position data using template
            const jobPositionData = data.job_position
                ? jobPositionsTemplate([data.job_position])?.at(0) ?? null
                : null;
            const client= data.client ?
            clientTemplate([data.client])?.at(0) ?? null : null;

            const resetData = {
                id: data.id || "",
                name: data.name || "",
                description: data.description || "",
                budget: data.budget || "",
                start_date: data.start_date || "",
                end_date: data.end_date || "",
                status: data.status || "planned",
                job_position_id: jobPositionData,
                employee_id: employeeData, 
                branch_id:
                    branchSearchTemplate(data?.branch ? [data.branch] : [])?.at(
                        0
                    ) ?? null,
                client_id: client,
                expiry_warning_days: data.expiry_warning_days || 0,
                observation: data.observation || "",
            };
            
            form.reset(resetData);
            form.setValue("openModel", true);
        },

          getProject: async (id = null) => {
          
              
                    // ✅ trigger API
              const result = await triggerGetProject({ id:id }).unwrap();

                  
                    // ✅ if data exists, push to redux + form
                    if (result?.data) {
                        
                        dispatch(setProjectData(result.data));
                        
                    }
                },

        onUpdate: async (data) => {
            try {
                if (form.getValues("assignEmployMode")) {
                    actions.onUpdateAssignedEmployees(data);
                    return;
                }

                const {
                    id,
                    openModel,
                    employee_id,
                    assignEmployees,
                    ...payload
                } = data;

                // Normalize employee_id array - extract values if objects
                const employeeList = (employee_id || []).map((item) =>
                    typeof item === "object" && item?.value ? item.value : item
                );

                // Prepare assigned employees data
                const assignedEmployees = (assignEmployees || []).map(
                    (emp) => ({
                        employee_id: emp.id,
                        name: emp.name,
                        start_date: emp.start_date,
                        end_date: emp.end_date,
                        salary_type: emp.salary_type,
                        basic_salary: parseFloat(emp.basic_salary) || 0,
                        status: emp.status,
                    })
                );

                // Prepare update payload
                const preparedData = normalizeSelectValues(
                    {
                        ...payload,
                        employee_id: employeeList,
                        assigned_employees: assignedEmployees,
                    },
                    ["job_position_id", "client_id","branch_id"]
                );

                console.log(
                    "Updating project data with assigned employees:",
                    preparedData
                );

                const response = await projectUpdate({
                    id,
                    credentials: preparedData,
                }).unwrap();

                if (response.success) {
                    toast.success("Project updated successfully");
                    refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
            }
        },

        onDelete: async (id) => {
            if (!confirm("Are you sure you want to delete this project?"))
                return;
            try {
                await projectDelete({ id }).unwrap();
                toast.success("Project deleted successfully");
                refetch();
            } catch (error) {
                toast.error(error?.data?.message || "Failed to delete project");
            }
        },
        setAssignEmployModel: async (data) => {
            // Prevent multiple simultaneous calls
            if (isLoadingAssignEmployees.current) {
                console.log(
                    "setAssignEmployModel already running, skipping..."
                );
                return;
            }

            isLoadingAssignEmployees.current = true;

            try {
                // Set the basic form values
                form.setValue("openModel", true);
                form.setValue("assignEmployMode", true);
                form.setValue("start_date", data?.start_date || "");
                form.setValue("end_date", data?.end_date || "");
                form.setValue("id", data?.id || "");

                // Fetch the project data with assigned employees if we have an ID
                if (data?.id) {
                    console.log("Looking for project with ID:", data.id);

                    // Use the existing project data if available, or fetch from server
                    const projectData =
                        project?.data?.projects?.find(
                            (p) => p.id === data.id
                        ) || data;

                    console.log("Found project data:", projectData);

                    // Prepare assigned employees data for field array
                    const assignedEmployeesData =
                        projectData?.assigned_employees?.map((assignedEmp) => ({
                            id: assignedEmp.employee_id,
                            employee_id: assignedEmp.employee_id,
                            name: assignedEmp.name,
                            start_date: assignedEmp.start_date,
                            end_date: assignedEmp.end_date,
                            salary_type: assignedEmp.salary_type,
                            basic_salary: assignedEmp.basic_salary,
                            status: assignedEmp.status,
                        })) || [];

                    console.log(
                        "Prepared assigned employees data:",
                        assignedEmployeesData
                    );

                    // Replace all fields at once (safer than individual remove/append)
                    fieldArray.replace(assignedEmployeesData);
                } else {
                    // If no ID, just clear the field array
                    fieldArray.replace([]);
                }
            } catch (error) {
                console.error("Error in setAssignEmployModel:", error);
                toast.error("Failed to load assigned employees");

                // Ensure modal still opens even if there's an error
                form.setValue("openModel", true);
                form.setValue("assignEmployMode", true);

                // Clear field array on error to prevent hanging
                try {
                    fieldArray.replace([]);
                } catch (fieldError) {
                    console.error("Error clearing field array:", fieldError);
                }
            } finally {
                // Always reset the loading flag
                isLoadingAssignEmployees.current = false;
            }
        },

        onUpdateAssignedEmployees: async (data) => {
            try {
                const { id, assignEmployees, ...payload } = data;

                // Prepare assigned employees data
                const assignedEmployees = (assignEmployees || []).map(
                    (emp) => ({
                        employee_id: emp.employee_id || emp.id,
                        name: emp.name || "",
                        start_date: emp.start_date || "",
                        end_date: emp.end_date || "",
                        salary_type: emp.salary_type || "monthly",
                        basic_salary: parseFloat(emp.basic_salary) || 0,
                        status: emp.status || "active",
                    })
                );

                console.log(
                    "Updating assigned employees only:",
                    assignedEmployees
                );

                const response = await projectUpdateAssignedEmployees({
                    id,
                    credentials: { assigned_employees: assignedEmployees },
                }).unwrap();

                if (response.success) {
                    toast.success("Assigned employees updated successfully");
                    refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                    form.setValue("assignEmployMode", false);
                }
            } catch (apiErrors) {
                console.error("API Error:", apiErrors);
                handleServerValidationErrors(apiErrors, form.setError);
            }
        },
    };

    return {
        actions,
        projectState,
    };
};
