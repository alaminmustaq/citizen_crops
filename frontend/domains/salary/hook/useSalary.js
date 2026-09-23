import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import {
    handleServerValidationErrors,
    formReset,
    normalizeSelectValues,
    debounce,
} from "@/utility/helpers";
import {
    useSalaryCreateMutation,
    useSalaryFetchQuery,
    useSalaryFilterMutation, // filter salary by company/branch/department/job
} from "../services/salaryApi";
import { getFilterParams } from "@/utility/helpers";
import { useMemo } from "react";

export const useSalary = () => {
    const [salaryFilter] = useSalaryFilterMutation();
    const [salaryCreate] = useSalaryCreateMutation();
    const { data: salary, refetch, isFetching  } = useSalaryFetchQuery();

    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
        defaultValues: {
            salary_month: new Date().toISOString().slice(0, 7), // YYYY-MM
        },
    });

    const openModel = useWatch({ control: form.control, name: "openModel" });

    // Update salary_month when modal opens
    useEffect(() => {
        if (openModel) {
            form.setValue("salary_month", new Date().toISOString().slice(0, 7));
        }
    }, [openModel]);

    const salaryState = { data: salary?.data || [], 
        form,
         refetch,
        pagination:  salary?.data?.pagination || {},
        isFetching,
     };

    const actions = {
        onCreate: async (data) => {
         
            //  Uncomment and implement if you want to save the generated salary
            try {
                let { openModel, ...other } = data;
                let preparedData = normalizeSelectValues(other, [ 
                    "branch_id",
                    "branch_id", 
                    "department_id",
                    "job_position_id",
                ]);
                const response = await salaryCreate(preparedData).unwrap();

                if (response) {
                    toast.success("Salary generated successfully");
                    refetch();
                    formReset(form);
                    form.setValue(
                        "salary_month",
                        new Date().toISOString().slice(0, 7)
                    );
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
            }
        },

        onFilter: async (data) => {
            try {
                const {
                    company_id,
                    branch_id,
                    department_id,
                    job_position_id,
                } = data;

                const response = await salaryFilter({
                    company_id,
                    branch_id,
                    department_id,
                    job_position_id,
                }).unwrap();

                form.setValue("basic_salary", Number(response.max_salary) || 0);
            } catch (error) {
                toast.error("Failed to fetch salary");
            }
        },

        onSearch: debounce(async (inputValue, callback) => {
            form.setValue("search", inputValue);
            // Currently placeholder; replace with salary-related search if needed
            callback([]);
        }, 500),

        onGenerateSalary: async () => {
            form.reset({openModel: true}) 
        },
        onApproveSalary: async () => {

            form.reset({openModel: true, model_for: "approved_salary"}) 
        },
    };

    return { actions, salaryState };
};
