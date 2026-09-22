"use client";

import { useEffect } from "react";
import { useFetchGeneralSettingsQuery } from "@/domains/settings/services/generalSettingApi";

/**
 * FaviconProvider
 * Fetches the company's general settings and dynamically sets
 * the browser favicon to the stored fav_icon image.
 *
 * Uses a single stable <link> element (id="app-favicon") to avoid
 * conflicting with React's DOM reconciliation (removeChild errors).
 */
export default function FaviconProvider({ children }) {
    const { data } = useFetchGeneralSettingsQuery();

    useEffect(() => {
        const faviconUrl = data?.data?.setting?.favicon_url;
        if (!faviconUrl) return;

        // Reuse our dedicated favicon link if it already exists,
        // otherwise create a new one. Never remove existing links —
        // that would cause React's removeChild reconciliation to throw.
        let link = document.getElementById("app-favicon");

        if (!link) {
            link = document.createElement("link");
            link.id = "app-favicon";
            link.rel = "icon";
            link.type = "image/x-icon";
            document.head.appendChild(link);
        }

        // Just update the href — no DOM removal needed
        link.href = faviconUrl;
    }, [data]);

    return children;
}
