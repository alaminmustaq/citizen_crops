"use client"; // make sure this hook is used in a client component

import { useForm } from "react-hook-form";
import {
    useFetchReportQuery,
    useGenerateReportMutation,
} from "../services/reportApi";
import { normalizeSelectValues } from "@/utility/helpers";
import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export const useReport = (route = "reports", file_route="reports", options = {}) => {
    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
    });

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState({});

    // Build query params from filters + page from URL
    const pageFromUrl = searchParams.get("page") || "1";
    const queryParams = {
        ...filters,
        ...(pageFromUrl ? { page: pageFromUrl } : {}),
    };

    const { data, refetch, isFetching } = useFetchReportQuery(
        {
            route,
            params: queryParams,
        },
        { refetchOnMountOrArgChange: true }
    );

    const [generateReportMutation] = useGenerateReportMutation();
    const extractItems = (data) => {
        if (!data?.data) return [];

        return (
            Object.entries(data.data).find(
            ([key, value]) => key !== "pagination" && Array.isArray(value)
            )?.[1] || []
        );
    };

    const reportState = {
        data: extractItems(data) || [],
        pagination: data?.data?.pagination || {},
        refetch,
        isFetching,
        form,
    };
    // console.log(reportState);
    
    const openPdfReport = (res) => {
        if (res?.pdf) {
            const byteCharacters = atob(res.pdf);
            const byteNumbers = new Array(byteCharacters.length);

            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const blob = new Blob([new Uint8Array(byteNumbers)], {
                type: "application/pdf",
            });

            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
            setTimeout(() => URL.revokeObjectURL(url), 10000);
            return;
        }

        console.error("PDF response missing pdf payload", res);
        toast.error("Failed to generate PDF report. Please try again.");
    };

    const handleReportAction = async (type) => {
        const values = form.getValues();
        const payload = prepareReportPayload(values, searchParams);
        const customAction = options.actions?.[type];

        if (customAction?.format === "pdf") {
            const customPayload =
                typeof customAction.preparePayload === "function"
                    ? customAction.preparePayload(payload)
                    : payload;

            try {
                const res = await generateReportMutation({
                    route: customAction.route,
                    filters: customPayload,
                    format: "pdf",
                }).unwrap();

                openPdfReport(res);
            } catch (error) {
                console.error("PDF report generation failed", error);
                const message =
                    error?.data?.message ||
                    error?.error ||
                    error?.message ||
                    "Failed to generate PDF report.";
                toast.error(message);
            }
            return;
        }

        switch (type) {
            case "filter": {
                setFilters(payload);

                const params = new URLSearchParams({
                    // ...Object.fromEntries(searchParams),
                    page: "1",
                });

                Object.entries(payload).forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                        value.forEach((v) => params.append(`${key}[]`, v));
                    } else {
                        params.set(key, value);
                    }
                });

                router.push(`${pathname}`);
                break;
            }

            case "pdf": {
                try {
                    const res = await generateReportMutation({
                        route: file_route,
                        filters: payload,
                        format: "pdf",
                    }).unwrap();

                    openPdfReport(res);
                } catch (error) {
                    console.error("PDF report generation failed", error);
                    const message =
                        error?.data?.message ||
                        error?.error ||
                        error?.message ||
                        "Failed to generate PDF report.";
                    toast.error(message);
                }
                break;
            }

            case "excel": {
                try {
                    const res = await generateReportMutation({
                        route: file_route,
                        filters: payload,
                        format: "excel",
                    }).unwrap();

                    if (res?.file) {
                        const byteCharacters = atob(res.file);
                        const byteNumbers = new Array(byteCharacters.length);

                        for (let i = 0; i < byteCharacters.length; i++) {
                            byteNumbers[i] = byteCharacters.charCodeAt(i);
                        }

                        const blob = new Blob([new Uint8Array(byteNumbers)], {
                            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        });

                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "report.xlsx";
                        a.click();

                        setTimeout(() => URL.revokeObjectURL(url), 10000);
                    } else {
                        console.error("Excel response missing file payload", res);
                        toast.error("Failed to generate Excel report. Please try again.");
                    }
                } catch (error) {
                    console.error("Excel report generation failed", error);
                    const message =
                        error?.data?.message ||
                        error?.error ||
                        error?.message ||
                        "Failed to generate Excel report.";
                    toast.error(message);
                }
                break;
            }

            default:
                console.warn("Unknown report action:", type);
        }
    };

    const normalizeFieldValue = (value) => {
        // Multi-select: [{label, value}, ...]
        if (Array.isArray(value)) {
            return value.map((item) =>
                typeof item === "object" && item !== null && "value" in item
                    ? item.value
                    : item
            );
        }

        // Single select: {label, value}
        if (typeof value === "object" && value !== null && "value" in value) {
            return value.value;
        }

        // Primitive: string | number | boolean | date
        return value;
    };

    const prepareReportPayload = (values, searchParams) => {
      const payload = {};

      Object.entries(values).forEach(([key, value]) => {
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          (Array.isArray(value) && !value.length)
        ) {
          return;
        }

        payload[key] = normalizeFieldValue(value);
      });

      /* ===============================
        Special business rules
      =============================== */

      // Employment status logic
      if (payload.employment_status === "inactive") {
        payload.include_inactive_employees = true;
      }

      // Dynamically fill missing fields from URL
      for (const key of searchParams.keys()) {
        const cleanKey = key.replace(/\[\]$/, ""); // remove brackets if multi-select
        if (!(cleanKey in payload)) {
          const valuesFromUrl = searchParams.getAll(key);
          if (valuesFromUrl.length) {
            payload[cleanKey] = valuesFromUrl.length > 1 ? valuesFromUrl : valuesFromUrl[0];
          }
        }
      }

      return payload;
    };

    const actions = {
        handleAction: handleReportAction,
        onReset: async () => {
            // Reset all fields: arrays → [], others → ""
            const resetValues = Object.fromEntries(
                Object.entries(reportState.form.getValues()).map(
                    ([key, value]) => [key, Array.isArray(value) ? [] : ""]
                )
            );

            reportState.form.reset(resetValues);

            // Trigger validation / update for all fields
            await reportState.form.trigger();
        },
    };

    return { actions, reportState };
};
