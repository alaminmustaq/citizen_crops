import {
    handleServerValidationErrors,
    formReset,
    prepareFilterPayload,
} from "@/utility/helpers";
import {
    useFetchApplicantsQuery,
    useUpdateApplicantStatusMutation,
} from "../services/applicantsApi";
import { useFetchJobListQuery } from "../../job-list/services/jobListApi";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export const useApplicants = () => {
    const router = useRouter();
    const [updateApplicantStatus] = useUpdateApplicantStatusMutation();

    // For Filters
    const [filters, setFilters] = useState({});
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const queryParams = {
        ...filters,
    };

    const {
        data: applicantsData,
        refetch,
        isFetching,
    } = useFetchApplicantsQuery({ params: queryParams });

    // Fetch Job List
    const { data: jobListData } = useFetchJobListQuery({ 
        params: { per_page: 100, isActive: true }, 
        useFilters: false 
    });
    const jobs = jobListData?.data?.job_lists || [];

    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
    });

    const applicantState = {
        data: applicantsData?.data?.applications || [],
        jobs,
        form: {
            ...form,
        },
        refetch,
        pagination: applicantsData?.data?.pagination || {},
        isFetching,
    };

    const actions = {
        // FILTER
        onFilter: async () => {
            const values = form.getValues();
            const payload = prepareFilterPayload(values, searchParams);
            setFilters(payload);

            const params = new URLSearchParams({ page: "1" });
            Object.entries(payload).forEach(([key, value]) => {
                if (value) params.set(key, value);
            });

            router.push(`${pathname}?${params.toString()}`);
            refetch();
        },

        // RESET
        onReset: async () => {
            const currentValues = form.getValues();
            const resetValues = {};
            
            Object.keys(currentValues).forEach(key => {
                const val = Array.isArray(currentValues[key]) ? [] : "";
                resetValues[key] = val;
                form.setValue(key, val, { shouldValidate: false });
            });

            form.reset(resetValues);
            setFilters({});
            router.push(pathname);
            refetch();
        },

        // UPDATE STATUS
        onUpdateStatus: async (id, status, interview_date = null) => {
            try {
                const payload = { status };
                if (interview_date) {
                    payload.interview_date = interview_date;
                }
                const response = await updateApplicantStatus({ id, ...payload }).unwrap();
                if (response) {
                    toast.success("Status updated successfully");
                    refetch();
                    return true;
                }
            } catch (error) {
                const message = error?.data?.message || "Failed to update status";
                toast.error(message);
                return false;
            }
        },
    };

    return {
        actions,
        applicantState,
    };
};
