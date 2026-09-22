"use client";

import React, { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import {
    ArrowLeft,
    Send,
    Upload,
    FileText,
    X,
    CheckCircle2,
    Loader2,
    Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

/**
 * JobApplyPage
 *
 * A simplified, premium application form.
 */
const JobApplyPage = () => {
    const params = useParams();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            full_name: "",
            email: "",
            phone: "",
            address: "",
            message: "",
            cv_file: null,
        },
    });

    const cvFile = watch("cv_file");

    const onDrop = useCallback(
        (acceptedFiles) => {
            if (acceptedFiles?.length > 0) {
                setValue("cv_file", acceptedFiles[0]);
            }
        },
        [setValue],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
            "application/msword": [".doc"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                [".docx"],
        },
        maxFiles: 1,
        multiple: false,
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("full_name", data.full_name);
            formData.append("email", data.email);
            formData.append("phone", data.phone);
            formData.append("address", data.address || "");
            formData.append("message", data.message || "");
            if (data.cv_file) {
                formData.append("cv_file", data.cv_file);
            }

            const rawBaseUrl =
                process.env.NEXT_PUBLIC_API_URL ||
                "http://localhost:8000/api/v1";
            const baseUrl = rawBaseUrl.endsWith("/")
                ? rawBaseUrl.slice(0, -1)
                : rawBaseUrl;

            const response = await fetch(
                `${baseUrl}/public-recruitment/apply/${params.id}`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Accept: "application/json",
                    },
                },
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || "Failed to submit");
            }

            setIsSuccess(true);
        } catch (error) {
            console.error("Submission error:", error);
            toast.error(
                error.message ||
                    "Failed to submit application. Please try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="status-container">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="status-card"
                >
                    <CheckCircle2 size={48} className="success-icon" />
                    <h2>Application Sent</h2>
                    <p>Thank you for your interest. We'll be in touch soon.</p>
                    <button onClick={() => router.back()} className="done-btn">
                        Done
                    </button>
                </motion.div>
                <style jsx>{`
                    .status-container {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #fff;
                        font-family: "Inter", sans-serif;
                    }
                    .status-card {
                        text-align: center;
                        max-width: 400px;
                        padding: 40px;
                    }
                    .success-icon {
                        color: #10b981;
                        margin-bottom: 24px;
                    }
                    h2 {
                        font-size: 28px;
                        font-weight: 700;
                        color: #1e293b;
                        margin-bottom: 12px;
                    }
                    p {
                        color: #64748b;
                        font-size: 16px;
                        margin-bottom: 32px;
                    }
                    .done-btn {
                        width: 100%;
                        padding: 14px;
                        background: #0f172a;
                        color: #fff;
                        border: none;
                        border-radius: 12px;
                        font-weight: 600;
                        cursor: pointer;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="apply-wrapper">
            <div className="main-content space-y-4">
                <motion.header
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="header"
                >
                    <button onClick={() => router.back()} className="back-link">
                        <ArrowLeft size={18} /> Back
                    </button>
                    <h1 className="title">Apply for this Position</h1>
                </motion.header>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="form-section"
                >
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="form-inner"
                    >
                        <div className="field-group">
                            <label>
                                Full Name{" "}
                                <span className="text-rose-500 ml-0.5">*</span>
                            </label>
                            <input
                                {...register("full_name", {
                                    required: "Required",
                                })}
                                className={cn("input", {
                                    "error-border": errors.full_name,
                                })}
                                placeholder="Enter your name"
                            />
                            {errors.full_name && (
                                <span className="error-text">
                                    {errors.full_name.message}
                                </span>
                            )}
                        </div>

                        <div className="field-row">
                            <div className="field-group">
                                <label>
                                    Email Address{" "}
                                    <span className="text-rose-500 ml-0.5">
                                        *
                                    </span>
                                </label>
                                <input
                                    {...register("email", {
                                        required: "Required",
                                        pattern: {
                                            value: /^\S+@\S+$/i,
                                            message: "Invalid email",
                                        },
                                    })}
                                    type="email"
                                    className={cn("input", {
                                        "error-border": errors.email,
                                    })}
                                    placeholder="your@email.com"
                                />
                                {errors.email && (
                                    <span className="error-text">
                                        {errors.email.message}
                                    </span>
                                )}
                            </div>
                            <div className="field-group">
                                <label>
                                    Phone{" "}
                                    <span className="text-rose-500 ml-0.5">
                                        *
                                    </span>
                                </label>
                                <input
                                    {...register("phone", {
                                        required: "Required",
                                    })}
                                    className={cn("input", {
                                        "error-border": errors.phone,
                                    })}
                                    placeholder="+1 (555) 000-0000"
                                />
                                {errors.phone && (
                                    <span className="error-text">
                                        {errors.phone.message}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="field-group">
                            <label>Address</label>
                            <textarea
                                {...register("address")}
                                className="input"
                                placeholder="Your current location"
                            />
                        </div>

                        {/* <div className="field-group">
                            <label>Cover Letter</label>
                            <textarea
                                {...register("message")}
                                className="input textarea"
                                rows="4"
                                minLength={1000}
                                placeholder="Brief summary of why you're applying..."
                            />
                        </div> */}

                        <div className="field-group">
                            <label>
                                CV / Resume{" "}
                                <span className="text-rose-500 ml-0.5">*</span>
                            </label>
                            <div
                                {...getRootProps()}
                                className={cn("dropzone", {
                                    active: isDragActive,
                                    filled: !!cvFile,
                                    error: !!errors.cv_file,
                                })}
                            >
                                <input {...getInputProps()} />
                                <AnimatePresence mode="wait">
                                    {!cvFile ? (
                                        <motion.div
                                            key="empty"
                                            className="drop-hint flex items-center gap-2 justify-center"
                                        >
                                            <Upload
                                                size={20}
                                                className="hint-icon"
                                            />
                                            <span>
                                                Drop your CV here or{" "}
                                                <strong>browse</strong>
                                            </span>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="file"
                                            className="file-box"
                                        >
                                            <FileText
                                                size={24}
                                                className="file-icon"
                                            />
                                            <div className="file-meta">
                                                <span className="name">
                                                    {cvFile.name}
                                                </span>
                                                <span className="size">
                                                    {(
                                                        cvFile.size /
                                                        1024 /
                                                        1024
                                                    ).toFixed(2)}{" "}
                                                    MB
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setValue("cv_file", null);
                                                }}
                                                className="remove-btn"
                                            >
                                                <X size={16} />
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <div className="cv-helper-text flex items-center gap-1.5 mt-2 text-[11px] text-slate-500 font-medium">
                                <Info size={14} className="text-slate-400" />
                                <span>
                                    Max size 10MB. Accepted formats: PDF, DOC,
                                    DOCX.
                                </span>
                            </div>
                            <Controller
                                name="cv_file"
                                control={control}
                                rules={{ required: "CV is required" }}
                                render={() =>
                                    errors.cv_file && (
                                        <span className="error-text">
                                            {errors.cv_file.message}
                                        </span>
                                    )
                                }
                            />
                        </div>

                        <div className="footer-actions">
                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className="submit-button"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />{" "}
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Submit Application <Send size={16} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>

            <style jsx>{`
                .apply-wrapper {
                    min-height: 100vh;
                    background: #fff;
                    font-family:
                        "Inter",
                        -apple-system,
                        sans-serif;
                    display: flex;
                    justify-content: center;
                    padding: 80px 20px;
                }
                .main-content {
                    max-width: 640px;
                    width: 100%;
                }

                .header {
                    margin-bottom: 48px;
                }
                .back-link {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: none;
                    border: none;
                    color: #64748b;
                    font-size: 14px;
                    cursor: pointer;
                    padding: 0;
                    margin-bottom: 16px;
                    transition: color 0.2s;
                }
                .back-link:hover {
                    color: #0f172a;
                }
                .title {
                    font-size: 32px;
                    font-weight: 700;
                    color: #0f172a;
                    letter-spacing: -0.5px;
                }

                .form-inner {
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }
                .field-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 24px;
                }

                .field-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    position: relative;
                }
                .field-group label {
                    font-size: 13px;
                    font-weight: 600;
                    color: #475569;
                }

                .input {
                    padding: 12px 16px;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    font-size: 15px;
                    color: #1e293b;
                    transition: all 0.2s;
                    outline: none;
                }
                .input:focus {
                    border-color: #0f172a;
                    background: #f8fafc;
                }
                .input::placeholder {
                    color: #cbd5e1;
                }
                .input.error-border {
                    border-color: #ef4444;
                }
                .textarea {
                    resize: none;
                    min-height: 120px;
                    line-height: 1.5;
                }

                .error-text {
                    font-size: 11px;
                    font-weight: 600;
                    color: #ef4444;
                    margin-top: 4px;
                }

                .dropzone {
                    border: 2px dashed #e2e8f0;
                    border-radius: 12px;
                    padding: 32px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s;
                    background: #fff;
                    position: relative;
                }
                .dropzone:hover {
                    border-color: #94a3b8;
                    background: #f8fafc;
                }
                .dropzone.active {
                    border-color: #0f172a;
                    background: #f1f5f9;
                }
                .dropzone.filled {
                    border-style: solid;
                    border-color: #e2e8f0;
                    padding: 20px;
                    text-align: left;
                }
                .dropzone.error {
                    border-color: #ef4444;
                }

                .drop-hint {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    color: #64748b;
                    font-size: 14px;
                }
                .hint-icon {
                    color: #94a3b8;
                }
                .drop-hint strong {
                    color: #0f172a;
                    text-decoration: underline;
                }

                .file-box {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    width: 100%;
                }
                .file-icon {
                    color: #0f172a;
                }
                .file-meta {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }
                .file-meta .name {
                    font-weight: 600;
                    color: #1e293b;
                    font-size: 14px;
                }
                .file-meta .size {
                    font-size: 12px;
                    color: #94a3b8;
                }
                .remove-btn {
                    background: #fee2e2;
                    color: #ef4444;
                    border: none;
                    padding: 6px;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .submit-button {
                    width: 100%;
                    padding: 16px;
                    background: #0f172a;
                    color: #fff;
                    border: none;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 16px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition:
                        transform 0.2s,
                        background 0.2s;
                }
                .submit-button:hover {
                    background: #1e293b;
                    transform: translateY(-1px);
                }
                .submit-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                @media (max-width: 600px) {
                    .field-row {
                        grid-template-columns: 1fr;
                        gap: 32px;
                    }
                }
            `}</style>
        </div>
    );
};

export default JobApplyPage;
