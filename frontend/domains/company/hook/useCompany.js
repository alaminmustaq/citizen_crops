import { handleServerValidationErrors } from "@/utility/helpers";
import {
    useCompanyCreateMutation,
    useCompanyUpdateMutation,
    useCompanyDeleteMutation,
    useCompanyFetchQuery,
    useCompanySearchQuery,
} from "../services/companyApi";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { formReset } from "@/utility/helpers";
import { debounce } from "@/utility/helpers";
import { companySearchTemplate } from "@/utility/templateHelper";
import { getFilterParams } from "@/utility/helpers";

import useAuth from "@/domains/auth/hooks/useAuth";
import { useMemo } from "react";

export const useCompany = () => {
    const [userCreate] = useCompanyCreateMutation();
    const [userUpdate] = useCompanyUpdateMutation();
    const [userDelete] = useCompanyDeleteMutation();
    const { loginAsCompany } = useAuth();

    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
    });

    // Only run query if searchValue is not empty
    const { data: companySearchResult } = useCompanySearchQuery(
        { search: form.watch("search") },
        { skip: !form.watch("search") } // skip query if empty
    );

    const { data: company, refetch, isFetching } = useCompanyFetchQuery();

    const companiesState = {
        data: company?.data?.companies || [],
        form,
        refetch,
        pagination: company?.data?.pagination || {},
        isFetching,
        
    };

    const actions = {
        onCreate: async (data) => {
            try {
                let { openModel, ...other } = data;

                const response = await userCreate(other).unwrap();
                if (response) {
                    toast.success("Company Create Successfully");
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
            form.reset({
                id: data.id || "",
                code: data.code || "",
                name: data.name || "",
                legal_name: data.legal_name || "",
                status: data.system_info.status || "",
                // contact_info
                email: data.contact_info?.email || "",
                phone: data.contact_info?.phone || "",
                fax: data.contact_info?.fax || "",

                website: data.contact_info?.website || "",
                locale: data.locale,
                incorporation_date: data.registration_info?.incorporation_date,
                incorporation_country_id:
                    data.registration_info?.incorporation_country_id,
                is_active: data.is_active,
                is_main_company: data.is_main_company,
                subscription_status: data.subscription_status,
                subscription_plan: data.subscription_plan,
                suspended_reason: data.suspended_reason,
                feature_configuration: data.feature_configuration,
                trial_ends_at: data.trial_ends_at,
                suspended_at: data.suspended_at,
                slug: data.slug,
                subdomain: data.subdomain,

                // business_info
                industry: data.business_info?.industry || "",
                business_type: data.business_info?.business_type || "",
                description: data.business_info?.description || "",
                employee_size: data.business_info?.employee_size || "",
                annual_revenue: data.business_info?.annual_revenue || "",
                fiscal_year_start: data.business_info?.fiscal_year_start || "",
                currency: data.business_info?.currency || "",

                timezone: data.business_info?.timezone || "",

                // registration_info
                registration_number:
                    data.registration_info?.registration_number || "",
                tax_id: data.registration_info?.tax_id || "",
                vat_number: data.registration_info?.vat_number || "",

                // system_info
                logo_url: data.system_info?.logo_url || "",
            });

            form.setValue("openModel", true);
            // updateUser({ id, ...data });
            // form.reset();
        },

        onUpdate: async (data) => {
            try {
                let { openModel, id, ...other } = data;
        
                const response = await userUpdate({
                    id,
                    credentials: other,
                }).unwrap();
        
                if (response) {
                    toast.success("Company Updated Successfully");
                    refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                // Handle server-side validation errors just like onCreate
                handleServerValidationErrors(apiErrors, form.setError);
            }
        },
        onDelete: (id) => {
            if (confirm("are you sure to delete it")) {
                toast.success("Company Delete Successfully");
                userDelete({ id });
            }
        },
        onSearch: debounce(async (inputValue, callback) => {
            form.setValue("search", inputValue);
            let res = companySearchResult?.data?.companies || [];

            callback(companySearchTemplate(res));
        }, 500),
        onLoginAsCompany: async (data) => {
            const res = await loginAsCompany(data.id);

            if (res.success) {
                toast.success("Login as company successfully");

                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 1000);
            }
        },
    };

    return {
        actions,
        companiesState,
    };
};
