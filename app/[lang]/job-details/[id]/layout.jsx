/**
 * layout.jsx — Server component wrapper for /[lang]/job-details/[id]
 *
 * This exists solely so Next.js can call generateMetadata (server-side)
 * even though the page.jsx itself is a "use client" component.
 * Next.js requires metadata exports to live in Server Components.
 */

export async function generateMetadata({ params }) {
    const { id, lang } = await params;

    let job = null;

    try {
        const apiBase = (
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
        ).replace(/\/$/, "");
        const origin = apiBase.split("/api")[0];
        const url = `${origin}/api/v1/public-recruitment/job-details/${id}`;

        const res = await fetch(url, { cache: "no-store" });
        if (res.ok) {
            const json = await res.json();
            job = json?.data?.job_list ?? json?.data ?? json;
        }
    } catch {
        // fall through to defaults
    }

    const jobTitle = job?.job_title ?? "Open Position";
    const company = job?.company_name ?? "Matendes HRM";
    const jobType = job?.job_type ?? "";
    const location = job?.location ?? "";
    const description =
        job?.short_description ??
        `${jobType ? jobType + " · " : ""}${location ? location + " · " : ""}Join our team! Apply now.`;

    const langCode = lang || "en";
    const appUrl =
        process.env.NEXT_PUBLIC_APP_URL || "https://matendes-hrm.vercel.app";
    const ogImageUrl = `${appUrl}/${langCode}/job-details/${id}/opengraph-image`;

    return {
        title: company ? `${jobTitle} | ${company}` : jobTitle,
        description,
        openGraph: {
            title: company ? `${jobTitle} — ${company}` : jobTitle,
            description,
            type: "website",
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: jobTitle,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: company ? `${jobTitle} — ${company}` : jobTitle,
            description,
            images: [ogImageUrl],
        },
    };
}

export default function JobDetailsLayout({ children }) {
    return children;
}
