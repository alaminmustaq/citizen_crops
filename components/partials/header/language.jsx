"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { useThemeStore } from "@/store";
import { useLanguage } from "@/domains/language/hook/useLanguage";

// Convert Emoji → Country code (us, gb, bd etc.)
const emojiToCountryCode = (emoji) => {
    if (!emoji) return "us";
    return [...emoji]
        .map((x) => String.fromCharCode(x.codePointAt(0) - 0x1f1e6 + 65))
        .join("")
        .toLowerCase();
};

const Language = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { languageState, actions } = useLanguage();
    const { setRtl } = useThemeStore();

    const languages = languageState?.data ?? [];

    // Initialize selectedLanguage to default or first language
    const defaultLanguage = languages.find((lang) => lang.is_default) ?? languages[0] ?? null;
    const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);

    // Update selectedLanguage if languages change (safe, no infinite loop)
    useEffect(() => {
        const defaultLang = languages.find((lang) => lang.is_default) ?? languages[0];
        if (defaultLang && (!selectedLanguage || selectedLanguage.id !== defaultLang.id)) {
            setSelectedLanguage(defaultLang);
            setRtl(defaultLang.direction === "rtl");
        }
    }, [languages, selectedLanguage, setRtl]);

    const selectedCode = emojiToCountryCode(selectedLanguage?.flag_icon);

    // Combined handler: set default and navigate to route
    const handleSetDefaultAndRoute = async (lang) => {
        try {
            // 1️⃣ Set default language in backend
            await actions.onSetDefaultLanguage(lang.id);

            // 2️⃣ Update UI immediately
            setSelectedLanguage(lang);
            setRtl(lang.direction === "rtl");

            // 3️⃣ Navigate to the correct route
            const restPath = pathname.split("/").slice(2).join("/") || ""; 
            
            router.push(`/${lang.code}/${restPath}`);
            setTimeout(() => {
                window.location.reload();
            },1000);
            
        } catch (error) {
            console.error(error);
        }
    };

    if (!languages.length || !selectedLanguage) {
        // Render nothing or a loader while languages load
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button type="button" className="bg-transparent hover:bg-transparent">
                    <img
                        src={`https://flagcdn.com/24x18/${selectedCode}.png`}
                        alt={selectedCode}
                        width={24}
                        height={18}
                        onError={(e) =>
                            (e.currentTarget.src = "https://flagcdn.com/24x18/us.png")
                        }
                    />
                    <span className="text-sm text-default-600 capitalize ml-2">
                        {selectedLanguage?.code ?? "en"}
                    </span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="p-2">
                {languages.map((item, index) => {
                    if(item.is_active){
                        const itemCode = emojiToCountryCode(item.flag_icon);
                        return (
                            <DropdownMenuItem
                                key={`lang-${index}`}
                                className={cn(
                                    "py-1.5 px-2 cursor-pointer dark:hover:bg-background mb-[2px] last:mb-0",
                                    {
                                        "bg-primary-100":
                                            selectedLanguage &&
                                            selectedLanguage.code === item.code,
                                    }
                                )}
                                onClick={() => handleSetDefaultAndRoute(item)}
                            >
                                <img
                                    src={`https://flagcdn.com/24x18/${itemCode}.png`}
                                    alt={itemCode}
                                    width={24}
                                    height={18}
                                    className="mr-2"
                                    onError={(e) =>
                                        (e.currentTarget.src = "https://flagcdn.com/24x18/us.png")
                                    }
                                />
                                <span className="text-sm text-default-600 capitalize">
                                    {item.code}
                                </span>

                                {selectedLanguage &&
                                    selectedLanguage.code === item.code && (
                                        <Check className="w-4 h-4 flex-none ltr:ml-auto rtl:mr-auto text-default-700" />
                                    )}
                            </DropdownMenuItem>
                        );
                    }
                    
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Language;
