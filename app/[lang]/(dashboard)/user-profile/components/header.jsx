"use client";

import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Home } from "lucide-react";
import coverImage from "@/public/images/all-img/user-cover.png";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Fragment, useContext } from "react";
import { useAppSelector } from "@/hooks/use-redux";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useFormContext } from "../profile-layout";

const Header = () => {
    const location = usePathname();
    const { form } = useFormContext();

    const { profile } = useAppSelector((state) => state.profileData);

    const user = profile?.user;
    const company = user?.company;
    const employee = user?.employee;
    const roles = user?.roles || [];

    const roleLevel = roles[0]?.level ?? 0;
    const canEdit = roleLevel > 1;

    const fileUrlBg = profile?.user?.file_bg_url;

    const [preview, setPreview] = useState(null);

    // when profile loads, set the preview
    useEffect(() => {
        if (fileUrlBg) {
            setPreview(encodeURI(fileUrlBg));
        }
    }, [fileUrlBg]);

    // Role name
    const roleName = roles[0]?.display_name || roles[0]?.name || "User";

    // Display Name
    const displayName = employee
        ? `${employee.first_name || ""} ${employee.last_name || ""}`.trim() ||
          "Unknown Employee"
        : company
        ? company.name || "Unknown Company"
        : user?.email || "Unknown User";

    // Title (role only)
    const displayTitle = roleName;

    // Profile Image
    const profileImage =
        profile?.user?.file_url ?? "/images/avatar/placeholder.jpg";

    // Navigation Links
    const navLinks = [
        { title: "Overview", link: "/user-profile" },
        // Only show Settings if user is an employee
        ...(employee
            ? [{ title: "Settings", link: "/user-profile/settings" }]
            : []),
    ];

    return (
        <Fragment>
            {/* Breadcrumbs */}
            <Breadcrumbs>
                <BreadcrumbItem>
                    <Home className="h-4 w-4" />
                </BreadcrumbItem>
                <BreadcrumbItem>Dashboard</BreadcrumbItem>
                <BreadcrumbItem>Profile</BreadcrumbItem>
            </Breadcrumbs>

            {/* Profile Cover */}
            <Card className="mt-6 rounded-t-2xl">
                <CardContent className="p-0">
                    <div
                        className="relative h-[200px] lg:h-[296px] rounded-t-2xl w-full bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: `url("${
                                preview || coverImage.src
                            }")`,
                        }}
                    >
                        {/* User Info */}
                        <div className="flex items-center justify-between gap-4 absolute ltr:left-10 rtl:right-10 -bottom-2 lg:-bottom-8">
                            <div>
                                <Image
                                    src={
                                        profile?.user?.file_url ??
                                        "/images/avatar/placeholder.jpg"
                                    }
                                    alt="user"
                                    className="h-20 w-20 lg:w-32 lg:h-32 rounded-full object-cover border-2 border-white shadow-md"
                                    width={128}
                                    height={128}
                                    unoptimized
                                />
                            </div>
                            <div>
                                <div className="text-xl lg:text-2xl font-semibold text-primary-foreground mb-1">
                                    {displayName}
                                </div>

                                {/* Always show role name */}
                                <div className="text-xs lg:text-sm font-medium text-default-100 dark:text-default-900 pb-1.5">
                                    {displayTitle}
                                </div>
                            </div>
                        </div>
                        {canEdit && (
                            <Button
                                asChild
                                className="absolute bottom-5 ltr:right-6 rtl:left-6 rounded px-5 hidden lg:flex"
                                size="sm"
                            >
                                <Label htmlFor="avatar-bg">
                                    <Icon
                                        className="w-4 h-4 ltr:mr-1 rtl:ml-1"
                                        icon="heroicons:pencil-square"
                                    />
                                    Edit
                                </Label>
                            </Button>
                        )}

                        <Input
                            type="file"
                            className="hidden"
                            id="avatar-bg"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    form.setValue("avatar_bg", file); // 👈 save file in form
                                    // form.trigger("avatar");
                                    setPreview(URL.createObjectURL(file)); // 👈 image preview
                                }
                            }}
                        />
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex flex-wrap justify-end gap-4 lg:gap-8 pt-7 lg:pt-5 pb-4 px-6">
                        {navLinks.map((item, index) => (
                            <Link
                                key={`user-profile-link-${index}`}
                                href={item.link}
                                className={cn(
                                    "text-sm font-semibold text-default-500 hover:text-primary relative lg:before:absolute before:-bottom-4 before:left-0 before:w-full lg:before:h-[1px] before:bg-transparent",
                                    {
                                        "text-primary lg:before:bg-primary":
                                            location === item.link,
                                    }
                                )}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </Fragment>
    );
};

export default Header;
