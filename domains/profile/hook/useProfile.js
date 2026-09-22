"use client";

import { useForm } from "react-hook-form";
import {
    useLazyGetProfileQuery,
    useUpdateProfileMutation,
    useUpdatePasswordMutation,
} from "../services/profileApi";
import { setProfile } from "../model/profileSlice";
import { useAppDispatch } from "@/hooks/use-redux";
import { handleServerValidationErrors } from "@/utility/helpers";
import { toast } from "react-hot-toast";
import { use, useEffect } from "react";

export const useProfile = () => {
    const dispatch = useAppDispatch();

    // Lazy query
    const [triggerGetProfile, { isFetching }] = useLazyGetProfileQuery();
    const [updateProfileApi] = useUpdateProfileMutation();
    const [updatePasswordApi] = useUpdatePasswordMutation();

    // Form setup
    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
    });
    useEffect(() => {
        actions.getProfile();
    }, []);
    // Actions
    const actions = {
        onSubmit: async (data) => {
            try {
                if (!data) return;

                const formData = new FormData();
                formData.append("first_name", data.first_name || "");
                formData.append("last_name", data.last_name || "");
                formData.append("work_email", data.email || "");
                formData.append("primary_phone", data.phone || "");
                formData.append("bio", data.bio || "");

                const avatar = form.watch("avatar");
                const avatar_bg = form.watch("avatar_bg");

                if (avatar instanceof File) {
                    formData.append("avatar", avatar);
                } else if (avatar_bg instanceof File) {
                    formData.append("avatar_bg", avatar_bg);
                }

                // Call your profile update action
                const response = await actions.updateProfile(formData);

                // Show success toast if backend returns success
                if (response?.message) {
                    toast.success(response.message); // ✅ Show success
                }
            } catch (err) {
                console.error(err);

                // Check if backend returned validation errors
                if (err?.data?.errors) {
                    Object.entries(err.data.errors).forEach(
                        ([field, messages]) => {
                            toast.error(`${field}: ${messages?.[0]}`);
                        }
                    );
                } else {
                    toast.error("Failed to update profile");
                }
            }
        },
        onEditProfile: (profile) => {
            form.reset({
                id: profile?.user?.id || "",
                first_name: profile?.user?.employee?.first_name || "",
                last_name: profile?.user?.employee?.last_name || "",
                email: profile?.user?.employee?.work_email || "",
                phone: profile?.user?.employee?.primary_phone || "",
                bio: profile?.user?.employee?.bio || "",
                employment_status:
                    profile?.user?.employee?.employment_status || "",
            });
        },
        getProfile: async (id = null) => {
            try {
                const result = await triggerGetProfile({ id });

                if (result?.data) {
                    // Push to redux
                    dispatch(setProfile(result.data));

                    // Reset form with fetched data
                    actions.onEditProfile(result.data);
                }
            } catch (err) {
                console.error("Failed to fetch profile:", err);
            }
        },
        updateProfile: async (data) => {
            try {
                const result = await updateProfileApi(data).unwrap();
                // Optionally update redux state after successful update
                dispatch(setProfile(result));
                return result;
            } catch (err) {
                handleServerValidationErrors(err, form.setError);
                throw err;
            }
        },
        resetPassword: async (data) => {
            try {
                const result = await updatePasswordApi(data).unwrap();
                alert("Password changed successfully!");
                return result;
            } catch (err) {
                console.error("Failed to reset password:", err);
                alert(err?.data?.message || "Failed to reset password.");
                throw err;
            }
        },
    };

    return {
        form,
        actions,
        isFetching,
    };
};
