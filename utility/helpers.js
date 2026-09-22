import toast from "react-hot-toast";
import { useAppSelector } from "@/hooks/use-redux";
import { translate } from "@/lib/utils";
// Single Field Validation
export const permissionChecker = (permissionName) => {
    const { user } = useAppSelector((state) => state.auth);

    const permissionNames = user?.permissions?.map(p => p.name) || []; 
    const addButtonVisible = permissionNames.includes(permissionName);
    
    return addButtonVisible;
};
// Single Field Validation
export const singleValidateError = (name, errors) => {
    return errors[name] && errors[name].message;
};
// Multi Field Validation
export const multipleValidateError = (name, errors, index) => {
    return errors?.list?.[index]?.[name]?.message;
};

//Server site Validation
export const handleServerValidationErrors = (error, setError) => {

    handleServerValidationErrorsToast(error, toast);
    if (error?.data?.errors) {
        const errors = error.data.errors;

        Object.keys(errors).forEach((field) => {
            
            setError(field, {
                type: "manual",
                message: translate(errors[field][0],window["allLanguage"]),
            });
        });
    }
};
//Server site Validation with toast
export const handleServerValidationErrorsToast = (error, toast) => {
    // Direct Laravel-like: error.errors
    if (error?.data?.errors && typeof error.errors === "object") {
        const firstKey = Object.keys(error.errors)[0];
        const firstMsg = error.errors[firstKey]?.[0];
        toast.error(firstMsg || "Validation error", { duration: 4000 });
        return;
    }

    // Generic message
    const message =
        error?.data?.message ||
        error?.message ||
        error?.error ||
        "Something went wrong.";

    toast.error(message, { duration: 4000 });
};
//  from reset
export const formReset = (form) => {
    const values = form.getValues();

    const resetValues = Object.fromEntries(
        Object.entries(values).map(([key, value]) => {
            if (Array.isArray(value)) {
                return [key, []];          // ✅ field arrays
            }
            return [key, null];            // ✅ primitives
        })
    );

    form.reset(resetValues);
};

// debounce
export const debounce = (fn, delay = 500) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn(...args);
        }, delay);
    };
};

// Normalize select values for API submission
export const normalizeSelectValues = (obj, keys = []) => {
    const copy = { ...obj };
    keys.forEach((key) => {
        if (
            copy[key] &&
            typeof copy[key] === "object" &&
            "value" in copy[key]
        ) {
            copy[key] = copy[key].value; // keep only the id
        }
    });
    return copy;
};

// Convert nested objects to FormData
export function buildFormData(values, method = "POST") {
    const formData = new FormData();

    function appendFormData(data, parentKey = "") {
        if (data && typeof data === "object" && !(data instanceof File)) {
            Object.entries(data).forEach(([key, value]) => {
                const newKey = parentKey ? `${parentKey}[${key}]` : key;
                appendFormData(value, newKey);
            });
        } else if (data !== null && data !== undefined) {
            formData.append(parentKey, data);
        }
        formData.append("_method", method);
    }

    appendFormData(values);
    return formData;
}

//
export function setFilterParams(params, data) {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set(params, data); // set page number
    window.history.pushState({}, "", url.toString()); // update URL without reload
}

export function getFilterParams(params = false) {
    if (typeof window === "undefined") {
        return params ? null : {};
    }
    const url = new URL(window.location.href);
    if (!params) {
        return Object.fromEntries(url.searchParams.entries());
    }

    return url.searchParams.get(params);
}

export function prepareFilterPayload(values, searchParams) {
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
                    payload[cleanKey] =
                        valuesFromUrl.length > 1
                            ? valuesFromUrl
                            : valuesFromUrl[0];
                }
            }
        }

        return payload;
}

export function normalizeFieldValue(value) {
    // Multi-select: [{label, value}, ...]
    if (Array.isArray(value)) {
        return value.map((item) =>
            typeof item === "object" && item !== null && "value" in item
                ? item.value
                : item,
        );
    }

    // Single select: {label, value}
    if (typeof value === "object" && value !== null && "value" in value) {
        return value.value;
    }

    // Primitive: string | number | boolean | date
    return value;
}
