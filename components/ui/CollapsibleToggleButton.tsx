// components/ui/CollapsibleToggleButton.tsx
"use client";

import { FC } from "react";

interface CollapsibleToggleButtonProps {
    isOpen: boolean;
    onToggle: () => void;
    openLabel?: string;
    closeLabel?: string;
}

const CollapsibleToggleButton: FC<CollapsibleToggleButtonProps> = ({
    isOpen,
    onToggle,
    openLabel = "Show Filters",
    closeLabel = "Hide Filters",
}) => {
    return (
        <button
            type="button"
            onClick={onToggle}
            className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100 transition"
        >
            <span>{isOpen ? closeLabel : openLabel}</span>
            <svg
                className={`w-4 h-4 transform transition-transform duration-300 ${
                    isOpen ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
            </svg>
        </button>
    );
};

export default CollapsibleToggleButton;
