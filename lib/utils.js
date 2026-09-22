import { clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";
import store from "./store";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const isLocationMatch = (targetLocation, locationName) => {
    return (
        locationName === targetLocation ||
        locationName.startsWith(`${targetLocation}/`)
    );
};

export const RGBToHex = (r, g, b) => {
    const componentToHex = (c) => {
        const hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };

    const redHex = componentToHex(r);
    const greenHex = componentToHex(g);
    const blueHex = componentToHex(b);

    return "#" + redHex + greenHex + blueHex;
};

export function hslToHex(hsl) {
    // Remove "hsla(" and ")" from the HSL string
    hsl = hsl.replace("hsla(", "").replace(")", "");

    // Split the HSL string into an array of H, S, and L values
    const [h, s, l] = hsl.split(" ").map((value) => {
        if (value.endsWith("%")) {
            // Remove the "%" sign and parse as a float
            return parseFloat(value.slice(0, -1));
        } else {
            // Parse as an integer
            return parseInt(value);
        }
    });

    // Function to convert HSL to RGB
    function hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;

        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        // Convert RGB values to integers
        const rInt = Math.round(r * 255);
        const gInt = Math.round(g * 255);
        const bInt = Math.round(b * 255);

        // Convert RGB values to a hex color code
        const rgbToHex = (value) => {
            const hex = value.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        };

        return `#${rgbToHex(rInt)}${rgbToHex(gInt)}${rgbToHex(bInt)}`;
    }

    // Call the hslToRgb function and return the hex color code
    return hslToRgb(h, s, l);
}

export const hexToRGB = (hex, alpha) => {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
};

export const formatTime = (time) => {
    if (!time) return "";

    const generalSetting = store.getState().auth?.general_setting;
    const use12Hour = Boolean(generalSetting?.is_12_hour_format);
    const rawTime = String(time).trim();
    const timeMatch = rawTime.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);

    if (timeMatch) {
        const hours = Number(timeMatch[1]);
        const minutes = timeMatch[2];

        if (!use12Hour) {
            return `${String(hours).padStart(2, "0")}:${minutes}`;
        }

        const normalizedHour = hours % 24;
        const period = normalizedHour >= 12 ? "PM" : "AM";
        const displayHour = normalizedHour % 12 || 12;

        return `${String(displayHour).padStart(2, "0")}:${minutes} ${period}`;
    }

    const date = new Date(rawTime);
    if (Number.isNaN(date.getTime())) {
        return rawTime;
    }

    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: use12Hour,
    });
};

export const formatDateTime = (value) => {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    const generalSetting = store.getState().auth?.general_setting;
    const use12Hour = Boolean(generalSetting?.is_12_hour_format);

    return date.toLocaleString([], {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: use12Hour,
    });
};

export const parseTimeToSeconds = (time) => {
    if (!time) return null;

    const rawTime = String(time).trim();
    const match = rawTime.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);

    if (match) {
        const hours = Number(match[1]);
        const minutes = Number(match[2]);
        const seconds = Number(match[3] ?? 0);
        return hours * 3600 + minutes * 60 + seconds;
    }

    const date = new Date(rawTime);
    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
};

export const isTimeAfter = (candidateTime, referenceTime) => {
    const candidateSeconds = parseTimeToSeconds(candidateTime);
    const referenceSeconds = parseTimeToSeconds(referenceTime);

    if (candidateSeconds === null || referenceSeconds === null) {
        return false;
    }

    return candidateSeconds > referenceSeconds;
};

export const getAttendanceDisplayTimes = ({
    checkInTime,
    checkOutTime,
    lastInTime,
}) => {
    if (!checkInTime || !lastInTime) {
        return {
            checkInTime,
            checkOutTime,
        };
    }

    if (isTimeAfter(checkInTime, lastInTime)) {
        return {
            checkInTime: null,
            checkOutTime: checkInTime,
        };
    }

    return {
        checkInTime,
        checkOutTime,
    };
};

// object check
export function isObjectNotEmpty(obj) {
    if (typeof obj !== "object" || obj === null) {
        return false;
    }
    return Object.keys(obj).length > 0;
}

export const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    return format(parsedDate, "yyyy-MM-dd");
};

// random word
export function getWords(inputString) {
    // Remove spaces from the input string
    const stringWithoutSpaces = inputString.replace(/\s/g, "");

    // Extract the first three characters
    return stringWithoutSpaces.substring(0, 3);
}

// for path name
export function getDynamicPath(pathname) {
    const prefixes = ["en", "bn", "ar"];

    for (const prefix of prefixes) {
        if (pathname.startsWith(`/${prefix}/`)) {
            return `/${pathname.slice(prefix.length + 2)}`;
        }
    }

    return pathname;
}

// translate

export const translate = (title, trans = []) => {
  // If title is not a string, return it directly
  if (typeof title !== "string") return title;

  let translation;

  if (trans && trans.length === 0) {
    translation = store.getState().auth.translation;
  } else {
    translation = trans;
  }

  const lowercaseTitle = title.toLowerCase();

  if (translation?.hasOwnProperty(lowercaseTitle)) {
    const translatedValue = translation[lowercaseTitle];

    if (
      translatedValue === null ||
      translatedValue === undefined ||
      translatedValue.length === 0
    ) {
      return title;
    }

    return translatedValue;
  }

  return title;
};
