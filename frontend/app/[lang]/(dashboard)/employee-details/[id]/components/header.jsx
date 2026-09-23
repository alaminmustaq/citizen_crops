"use client";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Home } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname, useParams } from "next/navigation";
import { Fragment } from "react";
import { permissionChecker } from "@/utility/helpers";

const Header = () => {
    const location = usePathname(); // e.g., "/en/project-details/employee"
    const { id } = useParams();

    // Remove locale prefix if present
    const normalizedPath = location?.replace(/^\/[a-z]{2}/, "") || "";

    const navItems = [
        {
            title: "Employee Details",
            link: `/employee-details/${id}`,
            permission: "details-employee",
        },
        {
            title: "Project Activity",
            link: `/employee-details/${id}/project-activity`,
            permission: "view-project-activity",
        },
        {
            title: "Financial Information",
            link: `/employee-details/${id}/financial-information`,
            permission: "view-financial-information",
        },
        {
            title: "Assigned Tools",
            link: `/employee-details/${id}/tool-assignments`,
            permission: "view-assigned-tools",
        },
    ];

    return (
        <Fragment>
            <Breadcrumbs>
                <BreadcrumbItem>
                    <Home className="h-4 w-4" />
                </BreadcrumbItem>
                <BreadcrumbItem>Pages</BreadcrumbItem>
                <BreadcrumbItem>Employee</BreadcrumbItem>
                <BreadcrumbItem>Employee Details</BreadcrumbItem>
            </Breadcrumbs>

            <Card className="mt-6 rounded-t-2xl">
                <CardContent className="p-0">
                    <div className="flex flex-wrap justify-center gap-4 lg:gap-8 pt-7 lg:pt-5 pb-4 px-6">
                        {navItems.map((item, index) => {
                            // active if exact match or if current path starts with the link + "/"

                            const hasPermission = permissionChecker(
                                item.permission
                            );

                            if (!hasPermission) {
                                return null;
                            }
                            const isActive =
                                normalizedPath === item.link ||
                                normalizedPath.startsWith(item.link + "/");

                            return (
                                <Link
                                    key={index}
                                    href={item.link}
                                    className={cn(
                                        "text-sm font-semibold text-default-500 hover:text-primary relative lg:before:absolute before:-bottom-4 before:left-0 before:w-full lg:before:h-[1px] before:bg-transparent",
                                        {
                                            "text-primary lg:before:bg-primary":
                                                isActive,
                                        }
                                    )}
                                >
                                    {item.title}
                                </Link>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </Fragment>
    );
};

export default Header;
