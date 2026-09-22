import { setCredentials, logout as logoutAction } from "../model/authSlice";
import {
    useLoginMutation,
    useLogoutMutation,
    useLazyMeQuery,
    useLoginAsCompanyMutation,
    useLoginAsBranchMutation,
} from "../services/authApi";
import { useAppDispatch, useAppSelector } from "../../../hooks/use-redux";
import Cookies from "js-cookie";

const useAuth = () => {
    const dispatch = useAppDispatch();

    // Get current auth state
    const { user, token, isAuthenticated, permissions } = useAppSelector(
        (state) => state.auth,
    );

    const [loginAsCompanyMutation] = useLoginAsCompanyMutation();
    const [loginAsBranchMutation] = useLoginAsBranchMutation();
    const [loginMutation, { isLoading: isLoggingIn, error: loginError }] =
        useLoginMutation();

    const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();
    const [triggerMe] = useLazyMeQuery();

    const login = async (email, password, remember = false) => {
        try {
            const response = await loginMutation({
                email,
                password,
                remember,
            }).unwrap();

            Cookies.set("auth-token", response.data.token, {
                expires: remember ? 30 : 1,
            }); // expires in 30 days if remember is true, else 1 day

            dispatch(
                setCredentials({
                    user: response.data?.user ?? response.user,
                    token: response.data?.token ?? response.token,
                }),
            );
            return { success: true };
        } catch (error) {
            return { success: false, error };
        }
    };
    const getMe = async () => {
        try {
            const response = await triggerMe().unwrap();

            dispatch(
                setCredentials({
                    user: response.data,
                    token: Cookies.get("auth-token") || null,
                    setPermissions: response.data.permission,
                    notificationData: response.data.notificationData,
                    branch: response?.data?.employee?.branch,
                    general_setting: response?.data?.general_setting,
                    translation: response?.data?.translation,
                    language_code: response?.data?.language_code,
                }),
            );

            return { success: true, data: response };
        } catch (error) {
            if (error?.status === 401) {
                Cookies.remove("auth-token");

                dispatch(logoutAction());
            }

            return { success: false, error };
        }
    };

    const logout = async () => {
        try {
            await logoutMutation().unwrap();
            dispatch(logoutAction());
            return { success: true };
        } catch (error) {
            // Even if API call fails, clear local state
            dispatch(logoutAction());
            return { success: false, error };
        }
    };
    const loginAsCompany = async (companyId) => {
        try {
            const response = await loginAsCompanyMutation({
                company_id: companyId,
            }).unwrap();

            Cookies.set("auth-token", response.data.token, { expires: 7 }); // expires in 7 days

            return { success: true };
        } catch (error) {
            return { success: false, error };
        }
    };
    const loginAsBranch = async (data) => {
        const branch_id = data.id;
        const email = data.email;
        try {
            const response = await loginAsBranchMutation({
                branch_id: branch_id,
                email: email,
            }).unwrap();

            Cookies.set("auth-token", response.data.token, { expires: 7 }); // expires in 7 days

            return { success: true };
        } catch (error) {
            return { success: false, error };
        }
    };

    return {
        // Auth state
        user,
        token,
        isAuthenticated,
        getMe,
        loginAsCompany,
        loginAsBranch,
        // Actions
        login,
        logout,

        // Loading states
        isLoggingIn,
        isLoggingOut,

        // Errors
        loginError,
    };
};

export default useAuth;
