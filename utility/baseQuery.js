import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState, extra }) => {
        const token = Cookies.get("auth-token");
        const fallbackToken =
            typeof window !== "undefined"
                ? localStorage.getItem("token")
                : null;

        const authToken = token || fallbackToken;

        if (authToken) {
            headers.set("Authorization", `Bearer ${authToken}`);
        }

        headers.set("Accept", "application/json");
        headers.delete("Content-Type");

        return headers;
    },
});
