"use client";

import { useForm } from "react-hook-form"; 
import {
    useLazyGetProfileQuery,
    useUpdateProfileMutation, 
    useUpdatePasswordMutation,
} from "../services/profileApi";
import { setProfile } from "../model/profileSlice";
import { useAppDispatch } from "@/hooks/use-redux";

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

    // Actions
    const actions = {
        onEditProfile: (profile) => {
            form.reset({
                id: profile?.user?.id || "",
                first_name: profile?.user?.employee?.first_name || "",
                last_name: profile?.user?.employee?.last_name || "",
                email: profile?.user?.employee?.work_email || "",
                phone: profile?.user?.employee?.primary_phone || "",
                bio: profile?.user?.employee?.bio || "",
                employment_status: profile?.user?.employee?.employment_status || "",
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
                console.error("Failed to update profile:", err);
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
