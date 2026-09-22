import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState, extra }) => {
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

        headers.set("Accept", "application/json");

        // ⚠️ IMPORTANT: Do NOT set Content-Type manually.
        // When the request body is FormData, the browser must set it
        // automatically with the correct multipart/form-data boundary.
        // Manually setting it (even to multipart/form-data) breaks uploads
        // because the boundary string is missing.
        headers.delete("Content-Type");

        return headers;
    },
});
