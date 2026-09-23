import Link from "next/link";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { translate } from "@/lib/utils";
import { useSelector } from "react-redux";

// Small helper to prettify slug into readable text
function formatLabel(str) {
    if (!str) return "";
    return str
        .split(/[-_]/) // split by dash/underscore
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

export default function PageLayout({ children }) {
    const pathname = usePathname();
    const params = useParams();
    const id = params.id;
    const segments = pathname?.split("/").filter(Boolean) || [];
    const translation_state = useSelector((state) => state.auth.translation);

    // Build cumulative hrefs
    const crumbs = segments.map((seg, i) => {
        const href = "/" + segments.slice(0, i + 1).join("/");
        const label = formatLabel(seg);
        const isLast = i === segments.length - 1;
        return { href, label, isLast };
    });

    // Title = last segment (or "Dashboard" if no path)
    const pageTitle =
        crumbs.length > 0
            ? crumbs[crumbs.length - (id ? 2 : 1)].label
            : "Dashboard";

    return (
        <>
            <div className="flex flex-wrap mb-7">
                {/* Dynamic title */}
                <div className="text-xl font-medium text-default-900 flex-1">
                    {translate(pageTitle,translation_state)}
                </div>

                {/* Breadcrumbs */}
                <div className="flex-none">
                    <Breadcrumbs>
                        <BreadcrumbItem>
                            <Link href="/">{translate('Dashboard',translation_state)}</Link>
                        </BreadcrumbItem>

                        {crumbs.map(({ href, label, isLast }, i) => (
                            <BreadcrumbItem key={i}>
                                {isLast ? (
                                    <span className="text-muted-foreground">
                                        {translate(label,translation_state)}
                                    </span>
                                ) : (
                                    <Link href={href}>{translate(label,translation_state)}</Link>
                                )}
                            </BreadcrumbItem>
                        ))}
                    </Breadcrumbs>
                </div>
            </div>
            <Card>
                <CardContent className="p-4">{children}</CardContent>
            </Card>
        </>
    );
}
