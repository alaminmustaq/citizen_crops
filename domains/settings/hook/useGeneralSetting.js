import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { formReset, handleServerValidationErrors } from "@/utility/helpers";
import {
    useFetchGeneralSettingsQuery,
    useUpdateGeneralSettingsMutation,
} from "../services/generalSettingApi";
import { useRef } from "react";

export const useGeneralSetting = () => {
    const { data, refetch, isFetching } = useFetchGeneralSettingsQuery();
    const [updateGeneralSettings] = useUpdateGeneralSettingsMutation();

    // Prevents repeated reset
    const initialized = useRef(false);

    // Create form
    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        defaultValues: {
            company_name: "",
            is_12_hour_format: 0,
            allowed_file_types: [],
            icon: null,
            logo: null,
            favicon: null,
        },
    });
    if (!isFetching && data?.data?.setting && !initialized.current) {
        initialized.current = true;

        const setting = data.data.setting;

        form.reset({
            ...setting,
            is_12_hour_format: Number(setting.is_12_hour_format ?? 0),
            allowed_file_types: setting.allowed_file_types
                ? setting.allowed_file_types.split(",")
                : [],
            icon: null,
            logo: null,
            favicon: null,
        });
    }

    const actions = {
        onUpdate: async (values) => {
            try {
                const formData = new FormData();

                // Text fields
                formData.append("company_name", values.company_name);
                if (values.next_day_time) {
                    formData.append("next_day_time", values.next_day_time);
                }
                formData.append(
                    "is_12_hour_format",
                    Number(values.is_12_hour_format ?? 0),
                );
                formData.append(
                    "allowed_file_types",
                    Array.isArray(values.allowed_file_types)
                        ? values.allowed_file_types.join(",")
                        : "",
                );

                // Files only if new
                if (values.icon instanceof File)
                    formData.append("icon", values.icon);
                if (values.logo instanceof File)
                    formData.append("logo", values.logo);
                if (values.favicon instanceof File)
                    formData.append("favicon", values.favicon);

                await updateGeneralSettings({
                    id: values.id,
                    formData: formData,
                }).unwrap();

                toast.success("General settings updated successfully");

                //  get fresh data from server
                const refreshed = await refetch();
                const setting = refreshed.data?.data?.setting;

                if (setting) {
                    form.reset({
                        ...setting,
                        is_12_hour_format: Number(
                            setting.is_12_hour_format ?? 0,
                        ),
                        allowed_file_types: setting.allowed_file_types
                            ? setting.allowed_file_types.split(",")
                            : [],
                        icon: null,
                        logo: null,
                        favicon: null,
                    });
                }
            } catch (error) {
                handleServerValidationErrors(error, form.setError);
            }
        },

        onEdit: (data) => {
            form.reset({
                ...data,
                icon: null,
                logo: null,
                favicon: null,
            });
            form.setValue("openModel", true);
        },
    };

    // console.log("General Settings API Data:", data?.data);

    return {
        generalSettingState: {
            data: data?.data || {},
            form,
            isFetching,
            refetch,
        },
        actions,
    };
};
