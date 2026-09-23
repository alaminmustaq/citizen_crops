import {
    handleServerValidationErrors,
    handleServerValidationErrorsToast,
} from "@/utility/helpers";
import {
    useJobPositionCreateMutation,
    useJobPositionUpdateMutation,
    useJobPositionDeleteMutation,
    useJobPositionFetchQuery,
    useJobPositionSearchQuery,
} from "../services/jobPositionApi";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { formReset, normalizeSelectValues } from "@/utility/helpers";
import { debounce } from "@/utility/helpers";
import {
    branchSearchTemplate,
    companySearchTemplate,
    departmentSearchTemplate,
} from "@/utility/templateHelper";
import { getFilterParams } from "@/utility/helpers";
import { useMemo } from "react";

export const useJobPosition = () => {
    const [JobPositionCreate] = useJobPositionCreateMutation();
    const [JobPositionUpdate] = useJobPositionUpdateMutation();
    const [JobPositionDelete] = useJobPositionDeleteMutation();
    const {
        data: JobPosition,
        refetch,
        isFetching,
    } = useJobPositionFetchQuery();

    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
    });

    const { data: JobPositionSearchResult } = useJobPositionSearchQuery(
        { search: form.watch("search") },
        { skip: !form.watch("search") } // skip query if empty
    );

    const jobPositionState = {
        data: JobPosition?.data?.job_positions || [],
        form,
        refetch,
        pagination: JobPosition?.data?.pagination || {},
        isFetching,
    }; 

    const actions = {
        onCreate: async (data) => {
            try {
                let { openModel, ...other } = data;
                let preparedData = normalizeSelectValues(other, [
                    "company_id",
                    "department_id",
                    "branch_id",
                ]);

                const response = await JobPositionCreate(preparedData).unwrap();
                if (response) {
                    toast.success("JobPosition Create Successfully");
                    refetch();
                    formReset(form);

                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                // set server site single errors
                handleServerValidationErrors(apiErrors, form.setError);
            }
        },
        onEdit: (data) => {
            console.log(data);
            form.reset({
                // =============== Relations ===============
                id: data.id || "",
                company_id:
                    companySearchTemplate([data.company])?.at(0) ?? null,
                branch_id:
                    branchSearchTemplate(data?.branch ? [data.branch] : [])?.at(
                        0
                    ) ?? null,
                department_id:
                    departmentSearchTemplate(
                        data?.department ? [data.department] : []
                    )?.at(0) ?? null,
                reports_to_position_id: null,
                direct_reports_count: data.direct_reports_count || "",

                // =============== Core Info ===============
                title: data.title || "",
                code: data.code || "",
                description: data.description || "",

                responsibilities: data?.requirements?.responsibilities || "",
                requirements: data?.requirements?.requirements || "",
                education_required:
                    data?.requirements?.education_required || "",
                education_preferred:
                    data?.requirements?.education_preferred || "",
                // =============== Classification ===============

                job_category: data?.classification_info?.job_category || "",
                employment_type:
                    data?.classification_info?.employment_type || "",
                job_level: data?.classification_info?.job_level || "",

                // =============== Level & Salary ===============

                min_salary: data?.salary_and_benefits?.min_salary ?? "",
                max_salary: data?.salary_and_benefits?.max_salary ?? "",
                currency: data?.salary_and_benefits?.currency || "",
                salary_type: data?.salary_and_benefits?.salary_type || "",
                benefits: data?.salary_and_benefits?.benefits || "",

                // =============== Requirements & Skills ===============
                required_skills: data?.requirements?.required_skills || "",
                preferred_skills: data?.requirements?.preferred_skills || "",
                education_level: data?.requirements?.education_level || "",
                experience_years_min:
                    data?.requirements?.experience_years_min ?? "",
                experience_years_max:
                    data?.requirements?.experience_years_max ?? "",
                hierarchy_level: data?.hierarchy_info?.hierarchy_level ?? "",
                hierarchy_path: data?.hierarchy_info?.hierarchy_path || "",
                sort_order: data.sort_order ?? 0,

                // =============== Recruitment & Vacancy ===============
                total_positions: data?.position_info?.total_positions ?? "",
                filled_positions: data?.position_info?.filled_positions ?? "",
                vacant_positions: data?.position_info?.vacant_positions ?? "",
                is_recruiting: Boolean(data?.position_info?.is_recruiting),
                posting_date: data?.position_info?.posting_date || "", // not present; stays ""
                application_deadline:
                    data?.position_info?.application_deadline || "", // not present; stays ""

                // =============== Status & Work Style ===============
                status: data?.system_info?.status || "inactive",
                is_enabled: Boolean(data?.system_info?.is_enabled),
                is_remote_eligible: data?.is_remote_eligible || false,
                is_travel_required: Boolean(data?.is_travel_required), // not in payload; defaults false
                travel_percentage: data?.travel_percentage ?? 0, // not in payload; keep 0

                is_management_position: data?.is_management_position || false,
                is_executive_position: data?.is_executive_position || false,
            });

            form.setValue("openModel", true);
            // updateUser({ id, ...data });
            // form.reset();
        },

        onUpdate: async (data) => {
            try {
                let { openModel, id, ...other } = data;
                //prepare data
                let preparedData = normalizeSelectValues(other, [
                    "company_id",
                    "department_id",
                    "branch_id",
                ]);
                //set to api
                const response = await JobPositionUpdate({
                    id,
                    credentials: preparedData,
                }).unwrap();

                if (response) {
                    toast.success("JobPosition Update Successfully");
                    refetch();
                    formReset(form);

                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                // set server site single errors
                handleServerValidationErrors(apiErrors, form.setError);
            }
        },
        onDelete: async (id) => {
            try {
                if (
                    confirm("Are you sure you want to delete this JobPosition?")
                ) {
                    const response = await JobPositionDelete({ id });

                    if (response?.data) {
                        // check if response contains data
                        toast.success("JobPosition deleted successfully");
                        refetch();
                    } else {
                        toast.error("Failed to delete JobPosition");
                    }
                }
            } catch (error) {}
        },
        onSearch: debounce(async (inputValue, callback) => {
            form.setValue("search", inputValue);
            let res = JobPositionSearchResult?.data?.job_positions || [];
            callback(companySearchTemplate(res));
        }, 500),
    };

    return {
        actions,
        jobPositionState,
    };
};
