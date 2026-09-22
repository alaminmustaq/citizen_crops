"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase,
    Calendar,
    MapPin,
    ArrowLeft,
    Send,
    CheckCircle2,
    Loader2,
    Info,
} from "lucide-react";

/**
 * PublicJobDetailsPage
 *
 * A premium job details view for public candidates.
 * Features:
 * - Stunning Glassmorphic design
 * - Smooth entrance animations
 * - Responsive layout
 * - Support for rich-text job descriptions
 */
const PublicJobDetailsPage = () => {
    const params = useParams();
    const router = useRouter();
    const [jobData, setJobData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    // Dynamic routing path for application
    const lang = params?.lang || "en";
    const jobId = params?.id;
    const applyUrl = `/${lang}/job-details/${jobId}/apply`;

    useEffect(() => {
        const fetchJob = async () => {
            if (!jobId) return;

            setIsLoading(true);
            try {
                const origin = (
                    process.env.NEXT_PUBLIC_API_URL ||
                    "http://localhost:8000/api/v1"
                ).split("/api")[0];
                const publicFetchUrl = `${origin}/api/v1/public-recruitment/job-details/${jobId}`;

                const res = await fetch(publicFetchUrl, {
                    headers: {
                        Accept: "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                    },
                });

                if (!res.ok) {
                    const errorJson = await res.json().catch(() => ({}));
                    setErrorMsg(errorJson.message || `Failed to load job details: ${res.status}`);
                } else {
                    const json = await res.json();
                    // Handle wrapped data from Laravel controller
                    setJobData(json?.data?.job_list || json?.job_list || json);
                }
            } catch (err) {
                setErrorMsg(
                    "Internet connection or API issue. Please try again.",
                );
                console.error("Fetch error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJob();
    }, [jobId]);

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };

    if (isLoading) {
        return (
            <div className="job-details-loading">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="loader-content"
                >
                    <Loader2 className="spinner" />
                    <p>Fetching amazing opportunities...</p>
                </motion.div>
                <style jsx>{`
                    .job-details-loading {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: radial-gradient(
                            circle at top right,
                            #f8fafc,
                            #e2e8f0
                        );
                        font-family: "Inter", sans-serif;
                    }
                    .loader-content {
                        text-align: center;
                        color: #64748b;
                    }
                    .spinner {
                        width: 48px;
                        height: 48px;
                        margin-bottom: 16px;
                        animation: spin 1.5s linear infinite;
                        color: #3b82f6;
                    }
                    @keyframes spin {
                        to {
                            transform: rotate(360deg);
                        }
                    }
                `}</style>
            </div>
        );
    }

    if (errorMsg || !jobData) {
        return (
            <div className="error-container">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="error-card"
                >
                    <Info className="error-icon" />
                    <h2>{errorMsg?.toLowerCase().includes('unavailable') ? 'Job Unavailable' : 'Something went wrong'}</h2>
                    <p>{errorMsg || "Job details not found."}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="retry-btn"
                    >
                        Try Again
                    </button>
                </motion.div>
                <style jsx>{`
                    .error-container {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #f1f5f9;
                        padding: 20px;
                        font-family: "Inter", sans-serif;
                    }
                    .error-card {
                        background: white;
                        padding: 40px;
                        border-radius: 24px;
                        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
                        text-align: center;
                        max-width: 400px;
                        width: 100%;
                    }
                    .error-icon {
                        color: #f43f5e;
                        width: 48px;
                        height: 48px;
                        margin-bottom: 20px;
                    }
                    .retry-btn {
                        margin-top: 24px;
                        padding: 12px 24px;
                        background: #0f172a;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="job-page-wrapper">
            <div className="background-glow top-right" />
            <div className="background-glow bottom-left" />

            <div className="main-container">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="job-card"
                >
                    {/* Simplified Header: Just Title */}
                    <motion.h1
                        variants={itemVariants}
                        className="xl:text-4xl lg:text-3xl text-2xl font-bold mb-4"
                    >
                        {jobData.job_title}
                    </motion.h1>

                    {/* Job Body Section */}
                    <motion.div variants={itemVariants} className="job-body">
                        <div
                            className="rich-content"
                            dangerouslySetInnerHTML={{
                                __html: jobData.job_description,
                            }}
                        />
                    </motion.div>

                    {/* Simplified Footer: Just Apply Button */}
                    <motion.div
                        variants={itemVariants}
                        className="job-footer-simple"
                    >
                        <button
                            onClick={() => router.push(applyUrl)}
                            className="apply-btn-large"
                        >
                            <span>Apply for this Position</span>
                            <Send size={20} />
                        </button>
                    </motion.div>
                </motion.div>

                <footer className="footer-copyright">
                    &copy; {new Date().getFullYear()}{" "}
                    {jobData.company_name || "Matendes HRM"}
                </footer>
            </div>

            <style jsx>{`
                .job-page-wrapper {
                    min-height: 100vh;
                    background: #ffffff;
                    font-family:
                        "Inter",
                        -apple-system,
                        sans-serif;
                    position: relative;
                    padding-bottom: 60px;
                }

                .background-glow {
                    position: fixed;
                    width: 60vw;
                    height: 60vw;
                    border-radius: 50%;
                    filter: blur(100px);
                    opacity: 0.08;
                    z-index: 0;
                    pointer-events: none;
                }
                .top-right {
                    top: -10%;
                    right: -10%;
                    background: #3b82f6;
                }
                .bottom-left {
                    bottom: -10%;
                    left: -20%;
                    background: #6366f1;
                }

                .main-container {
                    position: relative;
                    z-index: 1;
                    max-width: 850px;
                    margin: 0 auto;
                    padding: 80px 20px;
                }

                .job-card {
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid #f1f5f9;
                    border-radius: 40px;
                    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.03);
                    padding: 60px;
                }

                .job-title-large {
                    font-size: 52px;
                    font-weight: 850;
                    color: #0f172a;
                    line-height: 1.05;
                    margin-bottom: 40px;
                    letter-spacing: -1.5px;
                }

                .job-body {
                    margin-bottom: 50px;
                }

                .rich-content {
                    color: #334155;
                    line-height: 1.8;
                    font-size: 18px;
                }

                .rich-content :global(p) {
                    margin-bottom: 24px;
                }
                .rich-content :global(ul) {
                    padding-left: 24px;
                    margin-bottom: 24px;
                }
                .rich-content :global(li) {
                    margin-bottom: 12px;
                }

                .job-footer-simple {
                    margin-top: 60px;
                    display: flex;
                    justify-content: flex-start;
                }

                .apply-btn-large {
                    background: #0f172a;
                    color: white;
                    border: none;
                    padding: 18px 48px;
                    border-radius: 16px;
                    font-size: 18px;
                    font-weight: 700;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transition: all 0.3s ease;
                }

                .apply-btn-large:hover {
                    box-shadow: 0 20px 40px rgba(15, 23, 42, 0.15);
                    transform: translateY(-2px);
                    background: #1e293b;
                }

                .apply-btn-large:active {
                    transform: translateY(0);
                }

                .footer-copyright {
                    margin-top: 40px;
                    text-align: center;
                    color: #cbd5e1;
                    font-size: 14px;
                }

                @media (max-width: 768px) {
                    .job-card {
                        padding: 40px 24px;
                        border-radius: 32px;
                    }
                    .job-title-large {
                        font-size: 38px;
                    }
                    .main-container {
                        padding: 40px 16px;
                    }
                    .apply-btn-large {
                        width: 100%;
                        justify-content: center;
                    }
                }
            `}</style>
        </div>
    );
};

export default PublicJobDetailsPage;
