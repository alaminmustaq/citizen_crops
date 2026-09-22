"use client";

import PageLayout from "@/components/page-layout";
import { DynamicForm } from "@/components/form/dynamic-form";
import { Button } from "@/components/ui/button";
import { useGeneralSetting } from "@/domains/settings/hook/useGeneralSetting";
import fields from "./config/fields";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useState } from "react";

const GeneralSettingsPage = () => {
    const { generalSettingState, actions } = useGeneralSetting();
    const { form, data } = generalSettingState;
    // console.log(data);

    const onSubmit = (values) => actions.onUpdate(values);

    // State for previews
    const [logoPreview, setLogoPreview] = useState(null);
    const [iconPreview, setIconPreview] = useState(null);
    const [faviconPreview, setFaviconPreview] = useState(null);

    // Set initial previews from API data
    useEffect(() => {
        if (data?.setting) {
            setLogoPreview(data.setting.logo_url || null);
            setIconPreview(data.setting.icon_url || null);
            setFaviconPreview(data.setting.favicon_url || null);
        }
    }, [data]);

    return (
        <PageLayout>
            <div className="bg-white p-6 rounded-md shadow space-y-6">
                {/* Dynamic form for text fields only */}
                <DynamicForm
                    form={form}
                    fields={fields().filter(
                        (f) => !["logo", "icon", "favicon"].includes(f.name),
                    )}
                    onSubmit={onSubmit}
                />

                {/* Logo, Icon, Favicon Fields */}
                <div className="grid grid-cols-3 gap-6">
                    {/* Logo */}
                    <div className="flex flex-col items-center">
                        <div className="w-[96px] h-[96px] relative rounded-md">
                            <Image
                                src={
                                    logoPreview ||
                                    "/images/avatar/placeholder.jpg"
                                }
                                width={96}
                                height={96}
                                alt="Company Logo"
                                className="w-full h-full object-contain rounded-md"
                                unoptimized
                            />
                            <label
                                htmlFor="logo"
                                className="h-8 w-8 rounded-full cursor-pointer absolute bottom-0 right-0 bg-primary inline-flex items-center justify-center"
                            >
                                <Icon
                                    className="w-5 h-5 text-primary-foreground"
                                    icon="heroicons:pencil-square"
                                />
                            </label>
                            <Input
                                type="file"
                                className="hidden"
                                id="logo"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        form.setValue("logo", file);
                                        setLogoPreview(
                                            URL.createObjectURL(file),
                                        );
                                    }
                                }}
                            />
                        </div>
                        <span className="mt-2 text-sm">Company Logo</span>
                    </div>

                    {/* Icon */}
                    <div className="flex flex-col items-center">
                        <div className="w-[96px] h-[96px] relative rounded-md">
                            <Image
                                src={
                                    iconPreview ||
                                    "/images/avatar/placeholder.jpg"
                                }
                                width={96}
                                height={96}
                                alt="App Icon"
                                className="w-full h-full object-contain rounded-md"
                                unoptimized
                            />
                            <label
                                htmlFor="icon"
                                className="h-8 w-8 rounded-full cursor-pointer absolute bottom-0 right-0 bg-primary inline-flex items-center justify-center"
                            >
                                <Icon
                                    className="w-5 h-5 text-primary-foreground"
                                    icon="heroicons:pencil-square"
                                />
                            </label>
                            <Input
                                type="file"
                                className="hidden"
                                id="icon"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        form.setValue("icon", file);
                                        setIconPreview(
                                            URL.createObjectURL(file),
                                        );
                                    }
                                }}
                            />
                        </div>
                        <span className="mt-2 text-sm">App Icon</span>
                    </div>

                    {/* Favicon */}
                    <div className="flex flex-col items-center">
                        <div className="w-[96px] h-[96px] relative rounded-md">
                            <Image
                                src={
                                    faviconPreview ||
                                    "/images/avatar/placeholder.jpg"
                                }
                                width={96}
                                height={96}
                                alt="Favicon"
                                className="w-full h-full object-contain rounded-md"
                                unoptimized
                            />
                            <label
                                htmlFor="favicon"
                                className="h-8 w-8 rounded-full cursor-pointer absolute bottom-0 right-0 bg-primary inline-flex items-center justify-center"
                            >
                                <Icon
                                    className="w-5 h-5 text-primary-foreground"
                                    icon="heroicons:pencil-square"
                                />
                            </label>
                            <Input
                                type="file"
                                className="hidden"
                                id="favicon"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        form.setValue("favicon", file);
                                        setFaviconPreview(
                                            URL.createObjectURL(file),
                                        );
                                    }
                                }}
                            />
                        </div>
                        <span className="mt-2 text-sm">Favicon</span>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6 flex justify-end">
                    <Button
                        type="button"
                        onClick={form.handleSubmit(onSubmit)}
                        className="cursor-pointer"
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </PageLayout>
    );
};

export default GeneralSettingsPage;
