import { handleServerValidationErrors } from "@/utility/helpers";
import {
    useEmployCreateMutation,
    useEmployUpdateMutation,
    useEmployDeleteMutation,
    useEmployFetchQuery,
    useLazyEmployFetchQuery 
} from "../services/employApi";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import {
    formReset,
    normalizeSelectValues,
    buildFormData,
} from "@/utility/helpers";

import {
    branchSearchTemplate,
    companySearchTemplate,
    departmentSearchTemplate,
    jobPositionsTemplate,
    roleTemplate, 
} from "@/utility/templateHelper";
import { getFilterParams } from "@/utility/helpers";
import { useMemo } from "react";
import { useAppDispatch } from "@/hooks/use-redux";
import { setEmployData } from "../model/employSlice";
import { useParams } from "next/navigation";

export const useEmploy = () => {
    const dispatch = useAppDispatch(); 
      const { id } = useParams();
    const [EmployCreate] = useEmployCreateMutation();
    const [EmployUpdate] = useEmployUpdateMutation();
    const [EmployDelete] = useEmployDeleteMutation();
    const {
        data: employ,
        refetch,
        isFetching,
      } = useEmployFetchQuery(id ? { id } : "", {
        refetchOnMountOrArgChange: true,
        selectFromResult: (result) => {
          if (result?.data) {
            dispatch(setEmployData(result?.data?.data));
          }
          return result;
        },
      });



    //Lazy query
    const [triggerGetEmploy] = useLazyEmployFetchQuery();
    
    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
    });

    const employState = {
        data: employ?.data?.employees || [],
        form,
        refetch,
        pagination: employ?.data?.pagination || {},
        isFetching,
      };
  

    const actions = {
        // ✅ New: fetch single employee by ID
        getEmploy: async (id = null) => {
            // ✅ trigger API
            const result = await triggerGetEmploy({ id:id }).unwrap();
            // ✅ if data exists, push to redux + form
            if (result?.data) {
                dispatch(setEmployData(result.data));
                
            } 
          },
        onCreate: async (data) => {
            try {
                let { openModel, ...other } = data;
                let preparedData = normalizeSelectValues(other, [
                    "branch_id",
                    "department_id",
                    "job_position_id",
                    "manager_id",
                    'role_id',
                    'marital_status',
                    'blood_group'
                ]);

                const response = await EmployCreate(
                    buildFormData(preparedData)
                ).unwrap();
                if (response.message == "Employee created successfully") {
                    toast.success("Employ Create Successfully");
                    formReset(form);
                }
                return response;
            } catch (apiErrors) {
                // set server site single errors
                handleServerValidationErrors(apiErrors, form.setError);
            }
        },
        onEdit: (mainData) => {
            const data = mainData.employee;

            if(!data) return; 
            
            form.reset({
                // =============== Identity & Org ===============
                id: data.id || "",

                branch_id:
                    branchSearchTemplate(data?.branch ? [data.branch] : [])?.at(
                        0
                    ) ?? null,
                department_id:
                    departmentSearchTemplate(
                        data?.department ? [data.department] : []
                    )?.at(0) ?? null,
                job_position_id:
                    jobPositionsTemplate(
                        data?.job_position ? [data.job_position] : []
                    )?.at(0) ?? null,
                manager_id: data?.manager?.id ?? null,
                employee_code: data?.employee_code || "",
                badge_number: data?.badge_number || "",
                role_id: (data?.user?.roles && roleTemplate(data?.user?.roles)?.at(0)) ?? null,

                // =============== Personal Info ===============
                first_name: data?.personal_info?.first_name || "",
                middle_name: data?.personal_info?.middle_name || "",
                last_name: data?.personal_info?.last_name || "",
                preferred_name: data?.personal_info?.preferred_name || "",
                display_name: data?.personal_info?.display_name || "",
                gender: data?.personal_info?.gender || "",
                national_id: data?.personal_info?.national_id || "",
                passport_number: data?.personal_info?.passport_number || "",
                passport_expiry: data?.personal_info?.passport_expiry || "",
                date_of_birth: data?.personal_info?.date_of_birth || "",
                nationality: data?.personal_info?.nationality || "",
                marital_status: data?.personal_info?.marital_status || "",
                blood_group: data?.personal_info?.blood_group || "",

                // =============== Contact Info ===============
                personal_email: data?.contact_info?.personal_email || "",
                work_email: data?.contact_info?.work_email || "",
                primary_phone: data?.contact_info?.primary_phone || "",
                secondary_phone: data?.contact_info?.secondary_phone || "",

                // =============== Emergency Contact ===============
                contact_preferences: data?.emergency_contact?.contact_preferences || "",
                emergency_contact_name: data?.emergency_contact?.name || "",
                emergency_contact_relation:
                    data?.emergency_contact?.relation || "",
                emergency_contact_phone: data?.emergency_contact?.phone || "",
                emergency_contact_email: data?.emergency_contact?.email || "",

                // =============== Addresses ===============
                // current_address_line_1: data?.addresses?.current?.line_1 || "",
                // current_address_line_2: data?.addresses?.current?.line_2 || "",
                // current_city: data?.addresses?.current?.city || "",
                // current_state: data?.addresses?.current?.state || "",
                // current_postal_code:
                //     data?.addresses?.current?.postal_code || "",
                // current_country: data?.addresses?.current?.country || "",

                // permanent_address_line_1:
                //     data?.addresses?.permanent?.line_1 || "",
                // permanent_address_line_2:
                //     data?.addresses?.permanent?.line_2 || "",
                // permanent_city: data?.addresses?.permanent?.city || "",
                // permanent_state: data?.addresses?.permanent?.state || "",
                // permanent_postal_code:
                //     data?.addresses?.permanent?.postal_code || "",
                // permanent_country: data?.addresses?.permanent?.country || "",
                // same_as_current_address: Boolean(
                //     data?.addresses?.permanent?.same_as_current
                // ),

                // =============== Employment Info ===============
                hire_date: data?.employment_info?.hire_date || "",
                start_date: data?.employment_info?.start_date || "",
                probation_end_date:
                    data?.employment_info?.probation_end_date || "",
                confirmation_date:
                    data?.employment_info?.confirmation_date || "",
                termination_date: data?.employment_info?.termination_date || "",
                termination_reason:
                    data?.employment_info?.termination_reason || "",
                employment_status:
                    data?.employment_info?.employment_status || "probation",
                employment_type:
                    data?.employment_info?.employment_type || "permanent",
                work_mode: data?.employment_info?.work_mode || "office",
                basic_salary: data?.employment_info?.basic_salary || "",
                salary_type: data?.employment_info?.salary_type|| "monthly",

                // =============== Professional Info ===============
                work_history:
                    data?.professional_info?.work_history || "",
                years_of_experience:
                    data?.professional_info?.years_of_experience || "",
                skills: data?.professional_info?.skills || "",
                certifications: data?.professional_info?.certifications || "",
                languages: data?.professional_info?.languages || "",

                // =============== Education ===============
                highest_education: data?.education?.highest_education || "",
                university: data?.education?.university || "",
                degree: data?.education?.degree || "",
                graduation_year: data?.education?.graduation_year || "",

                // =============== Compensation ===============
                // basic_salary: data?.compensation?.basic_salary || "",
                // gross_salary: data?.compensation?.gross_salary || "",
                // salary_currency: data?.compensation?.salary_currency || "USD",
                // salary_period: data?.compensation?.salary_period || "monthly",
                // last_salary_review:
                //     data?.compensation?.last_salary_review || "",
                // next_salary_review:
                //     data?.compensation?.next_salary_review || "",
                // allowances: data?.compensation?.allowances || "",
                // deductions: data?.compensation?.deductions || "",

                // =============== Banking & Tax ===============
                // bank_name: data?.banking?.bank_name || "",
                // bank_account_number: data?.banking?.bank_account_number || "",
                // bank_routing_number: data?.banking?.bank_routing_number || "",
                // tax_id: data?.banking?.tax_id || "",
                // social_security_number:
                //     data?.banking?.social_security_number || "",
                // pension_number: data?.banking?.pension_number || "",
                // health_insurance_number:
                //     data?.banking?.health_insurance_number || "",

                // =============== System Info ===============
                profile_photo_url: data?.system_info?.profile_photo_url || "",
                // type: data?.system_info?.type || "",
                bio: data?.system_info?.bio || "",
                timezone: data?.system_info?.timezone || "UTC",
                locale: data?.system_info?.locale || "en",
                preferences: data?.system_info?.preferences || "",
                // is_enabled: Boolean(data?.system_info?.is_enabled),
                is_system_user: Boolean(data?.system_info?.is_system_user),
            });
            
            // updateUser({ id, ...data });
            // form.reset();
        },

        onUpdate: async (data) => {
            try {
                let { openModel, id, ...other } = data;
                //prepare data
                let preparedData = normalizeSelectValues(other, [

                    "branch_id",
                    "department_id",
                    "job_position_id",
                    "manager_id",
                    "role_id",
                    'marital_status',
                    'blood_group'
                ]);
             
                //set to api
                const response = await EmployUpdate({
                    id,
                    credentials: preparedData,
                }).unwrap();

                if (response.message == "Employee updated successfully") {
                    toast.success("Employ Update Successfully");
                }

                return response;
            } catch (apiErrors) {
                // set server site single errors
                handleServerValidationErrors(apiErrors, form.setError);
            }
        },
        onDelete: async (id) => {
            try {
                if (confirm("Are you sure you want to delete this Employ?")) {
                    const response = await EmployDelete({ id });

                    if (response?.data) {
                        // check if response contains data
                        toast.success("Employ deleted successfully");
                        refetch();
                    } else {
                        toast.error("Failed to delete Employ");
                    }
                }
            } catch (error) {}
        },
    };

    return {
        actions,
        employState,
    };
};
