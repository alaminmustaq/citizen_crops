import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
export const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
        // Get token from Redux state instead of localStorage directly
        const token = Cookies.get("auth-token");
        // Fallback to localStorage if token is not in state (for page refresh)
        const fallbackToken =
            typeof window !== "undefined"
                ? localStorage.getItem("token")
                : null;

        const authToken = token || fallbackToken;

        if (authToken) {
            headers.set("Authorization", `Bearer ${authToken}`);
        }

        // const isFormData = meta?.arg instanceof FormData;
        // if (!isFormData) {
        //     headers.set("Content-Type", "application/json");
        // }

        headers.set("Accept", "application/json");

        return headers;
    },
});
