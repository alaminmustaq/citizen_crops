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
import {
    branchSearchTemplate, 
} from "@/utility/templateHelper";
import { getFilterParams } from "@/utility/helpers";
import { useMemo } from "react";
import useAuth from "@/domains/auth/hooks/useAuth";

export const useSalary = () => {
    const [salaryFilter] = useSalaryFilterMutation();
    const [salaryCreate] = useSalaryCreateMutation();
    const { data: salary, refetch, isFetching  } = useSalaryFetchQuery();
    const {user} = useAuth(); 

    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true, 
    });

    const openModel = useWatch({ control: form.control, name: "openModel" });

    // Update salary_month and payment_frequency when modal opens
    useEffect(() => {
        if (openModel) {
            form.setValue("salary_month", new Date().toISOString().slice(0, 7));
            if (!form.getValues("payment_frequency")) {
                form.setValue("payment_frequency", "monthly");
            }
        }
    }, [openModel]);

    const defaultValue={
            branch_id: branchSearchTemplate(user?.employee?.branch ? [user?.employee?.branch] : [])?.at(0) ?? null,
            salary_month: new Date().toISOString().slice(0, 7), // YYYY-MM
            payment_frequency: "monthly",
        }
    console.log(salary);
    
    const salaryState = { 
        data: salary?.data?.items || [], 
        form:{
            ...form,
            defaultValue: defaultValue,
        },
         refetch,
        pagination:  salary?.data?.pagination || {},
        isFetching,
     }; 
    const actions = {
        onCreate: async (data) => {
            try {
                let { openModel, payroll_week, ...other } = data;
                let preparedData = normalizeSelectValues(other, [ 
                    "branch_id",
                    "department_id",
                    "project_id",
                    "job_position_id",
                ]);
                const response = await salaryCreate(preparedData).unwrap();

                if (response) {
                    toast.success(response?.message || "Salary generated successfully");
                    
                    if (response?.warnings && Array.isArray(response.warnings)) {
                        response.warnings.forEach((warn) => {
                            toast(warn, { icon: "⚠️", duration: 6000 });
                        });
                    }

                    refetch();
                    formReset(form);
                    form.setValue(
                        "salary_month",
                        new Date().toISOString().slice(0, 7)
                    );
                    form.setValue("payment_frequency", "monthly");
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
            form.reset({ openModel: true, payment_frequency: "monthly", salary_month: new Date().toISOString().slice(0, 7) }) 
        },
        onApproveSalary: async () => {
            form.reset({ openModel: true, model_for: "approved_salary" }) 
        },
    };

    return { actions, salaryState };
};
