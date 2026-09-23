import { NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

let defaultLocale = "en";
let locales = ["bn", "en", "ar","pt"];

// Protected routes that require authentication
const protectedRoutes = [
    "/dashboard",
    "/company",
    "/branch",
    "/department",
    "/employee",
    "/settings",
    "/profile",
    "/users",
    "/roles",
    "/permissions",
    "/attendance", 
    "/attendance/view-attendance",
    "/attendance/manual-attendance",
    "/generate-qr",
    "/attendance/qr-attendance",
    "/salary/generate",
    "/client",
    "/inventory/tool/category",
    "/inventory/tool/unit",
    "/inventory/tool/tool-list",
    "/inventory/purchase",
    "/inventory/tool-distribution",
    "/inventory/damage",
    "/inventory/warehouse",
    "/inventory/stock-transfers",
    "/bank",
    "/finance/payment-type",
    "/finance/financial-records",
    "/project",
    "/document/document-type",
    "/document/documents",
    "/role",
    "/language",
    "/activity"
];
// Public routes that should redirect to dashboard if authenticated
const authRoutes = ["/login", "/register", "/forgot-password"];

// Get the preferred locale, similar to above or using a library
function getLocale(request) {
    const acceptedLanguage =
        request.headers.get("accept-language") ?? undefined;
    let headers = { "accept-language": acceptedLanguage };
    let languages = new Negotiator({ headers }).languages();

    return match(languages, locales, defaultLocale); // -> 'en-US'
}

// Check if user has token in cookies
function hasAuthToken(request) {
    const token = request.cookies.get("auth-token")?.value;
    return !!token;
}

// Get path without locale prefix
function getPathWithoutLocale(pathname) {
    for (const locale of locales) {
        if (pathname.startsWith(`/${locale}/`)) {
            return pathname.slice(`/${locale}`.length);
        }
        if (pathname === `/${locale}`) {
            return "/";
        }
    }
    return pathname;
}

export function middleware(request) {
    const pathname = request.nextUrl.pathname;
    const hasToken = hasAuthToken(request);

    // Check if there is any supported locale in the pathname
    const pathnameIsMissingLocale = locales.every(
        (locale) =>
            !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    // Handle missing locale
    if (pathnameIsMissingLocale) {
        const locale = getLocale(request);
        const pathWithoutLocale = getPathWithoutLocale(pathname);

        // Check if it's a protected route
        const isProtectedRoute = protectedRoutes.some((route) =>
            pathWithoutLocale.startsWith(route)
        );

        // Check if it's an auth route (login, register, etc.)
        const isAuthRoute = authRoutes.some((route) =>
            pathWithoutLocale.startsWith(route)
        );

        // If user has token and tries to access auth routes, redirect to dashboard
        if (hasToken && (isAuthRoute || pathWithoutLocale === "/")) {
            return NextResponse.redirect(
                new URL(`/${locale}/dashboard`, request.url)
            );
        }

        // If user doesn't have token and tries to access protected route, redirect to login
        if (!hasToken && isProtectedRoute) {
            return NextResponse.redirect(new URL(`/${locale}/`, request.url));
        }

        // Normal locale redirection
        return NextResponse.redirect(
            new URL(`/${locale}${pathname}`, request.url)
        );
    }

    // Handle authentication for existing locale paths
    const pathWithoutLocale = getPathWithoutLocale(pathname);
    const locale = pathname.split("/")[1];

    const isProtectedRoute = protectedRoutes.some((route) =>
        pathWithoutLocale.startsWith(route)
    );

    const isAuthRoute = authRoutes.some((route) =>
        pathWithoutLocale.startsWith(route)
    );

    // If user has token and tries to access auth routes, redirect to dashboard
    if (hasToken && (isAuthRoute || pathWithoutLocale === "/")) {
        return NextResponse.redirect(
            new URL(`/${locale}/dashboard`, request.url)
        );
    }

    // If user doesn't have token and tries to access protected route, redirect to login
    if (!hasToken && isProtectedRoute) {
        return NextResponse.redirect(new URL(`/${locale}/`, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Skip all internal paths (_next, assets, api)
        //"/((?!api|assets|.*\\..*|_next).*)",
        "/((?!api|assets|docs|.*\\..*|_next).*)",
        // Optional: only run on root (/) URL
        
    ],
};
