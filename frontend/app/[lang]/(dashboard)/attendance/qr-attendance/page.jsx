"use client";

import PageLayout from "@/components/page-layout";
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import useAttendance from "@/hooks/useAttendance";
import { useSelector } from "react-redux";
import { translate } from "@/lib/utils";
// load QR reader only on client
const QrReader = dynamic(
    () => import("react-qr-reader").then((m) => m.QrReader),
    {
        ssr: false,
    }
);
export default function QRAttendance() {
    const translation_state = useSelector((state) => state.auth.translation);
    // Use attendance hook for API calls
    const { qrCheckIn, qrCheckOut, isCheckingIn, isCheckingOut, branch } =
        useAttendance();
    // Employee Manual Attendance
    const { user } = useSelector((state) => state.auth);
    const userPermissions = user?.permissions || [];

    // If permissions are array of objects
    const canManualAttendance = userPermissions.some(
        (perm) => perm.name === "attendance-manual-manage"
    );

    // steps: "closed" | "scanner" | "result" | "processing"
    const [step, setStep] = useState("closed");
    const [scannedText, setScannedText] = useState(null);
    const [attendanceResult, setAttendanceResult] = useState(null);
    // camera permission
    const [hasPermission, setHasPermission] = useState(null); // null | true | false
    const [isRequesting, setIsRequesting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [mountScanner, setMountScanner] = useState(false);

    // location permission
    const [locationGranted, setLocationGranted] = useState(false);
    const [isRequestingLocation, setIsRequestingLocation] = useState(false);
    const [coords, setCoords] = useState(null);

    // attendance processing
    const [isProcessingAttendance, setIsProcessingAttendance] = useState(false);

    // for legacy image scan
    const legacyRef = useRef(null);

    // Camera constraints - will be updated dynamically
    const [videoConstraints, setVideoConstraints] = useState({
        facingMode: { ideal: "environment" }, // back camera by default
    });

    // --- Location gating (unchanged behavior) ---
    const allowLocation = () => {
        setErrorMsg("");
        setIsRequestingLocation(true);

        if (!navigator.geolocation) {
            setIsRequestingLocation(false);
            setLocationGranted(false);
            setErrorMsg("Geolocation is not supported by this browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoords({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                });
                setLocationGranted(true);
                setIsRequestingLocation(false);
            },
            (error) => {
                setLocationGranted(false);
                setIsRequestingLocation(false);
                setErrorMsg(
                    typeof error?.message === "string"
                        ? error.message
                        : "Location access denied. Enable in browser settings."
                );
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    // auto-request location on mount
    useEffect(() => {
        allowLocation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- Open camera/scanner (asks for permission first) ---
    const openScanner = async () => {
        setErrorMsg("");
        setIsRequesting(true);
        try {
            let stream = null;
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: { exact: "environment" } },
                    audio: false,
                });
                setVideoConstraints({ facingMode: { exact: "environment" } });
            } catch (backCameraError) {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: { facingMode: { exact: "user" } },
                        audio: false,
                    });
                    setVideoConstraints({ facingMode: { exact: "user" } });
                } catch (frontCameraError) {
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: false,
                    });
                    setVideoConstraints({ video: true });
                }
            }
            if (stream) {
                stream.getTracks().forEach((t) => t.stop());
            }
            setHasPermission(true);
            setStep("scanner");
            setMountScanner(false);
            setTimeout(() => setMountScanner(true), 0);
        } catch (e) {
            setHasPermission(false);
            setStep("closed");
            setErrorMsg(
                typeof e?.message === "string"
                    ? e.message
                    : "Camera access denied or unavailable. Allow access in your browser settings."
            );
        } finally {
            setIsRequesting(false);
        }
    };

    // --- Handle scanning results ---
    const handleScanResult = useCallback(
        async (result, error) => {
            if (!!result) {
                const text =
                    result?.getText?.() ?? result?.text ?? String(result);

                if (text) {
                    setScannedText(text);
                    setStep("processing");

                    // Stop camera immediately after scan
                    setMountScanner(false);

                    toast.success("QR scanned! Processing attendance...");
                    try {
                        navigator.vibrate?.(60);
                    } catch {}

                    // Process attendance with location
                    await processAttendance(text);
                }
            }
            if (!!error) {
                // keep it quiet; QR readers emit frequent decode errors while searching
            }
        },
        [coords]
    ); 

    // Employee Manual Attendance
    const handleManualAttendance = async () => {
        try {
            setStep("processing");
            setScannedText("manual");
            await processAttendance(user?.employee_code || user?.id);
        } catch (error) {
            console.error("Manual attendance failed:", error);
            toast.error("Manual attendance failed");
            setStep("scan");
        }
    };

    // Process attendance after QR scan
    const processAttendance = async (qrData) => {
        if (!coords) {
            setErrorMsg(
                "Location is required for attendance. Please allow location access."
            );
            setStep("result");
            return;
        }

        setIsProcessingAttendance(true);

        try {
            // For now, we'll assume check-in by default
            // You could enhance this to detect check-in/check-out based on QR content or current status
            const result = await qrCheckIn(
                qrData,
                coords.lat,
                coords.lng,
                branch
            );

            if (result.success) {
                setAttendanceResult({
                    success: true,
                    message: result.message,
                    data: result.data,
                });
                toast.success(result.message);
            } else {
                setAttendanceResult({
                    success: false,
                    message: result.error,
                });
                toast.error(result.error);
            }
        } catch (error) {
            console.error("QR Attendance processing error:", error);
            const errorMessage =
                error?.message ||
                "Failed to process attendance. Please try again.";
            setAttendanceResult({
                success: false,
                message: errorMessage,
            });
            toast.error(errorMessage);
        } finally {
            setIsProcessingAttendance(false);
            setStep("result");
        }
    };

    const rescan = () => {
        setScannedText(null);
        setAttendanceResult(null);
        setErrorMsg("");
        setStep("scanner");
        setMountScanner(false);
        setTimeout(() => setMountScanner(true), 0);
    };

    const retryAttendance = async () => {
        if (!scannedText) return;
        setStep("processing");
        await processAttendance(scannedText);
    };

    const closeResult = () => {
        setScannedText(null);
        setAttendanceResult(null);
        setErrorMsg("");
        setStep("closed");
    };

    const copyText = async () => {
        if (!scannedText) return;
        try {
            await navigator.clipboard.writeText(scannedText);
            toast.success("Copied");
        } catch {
            toast.error("Copy failed");
        }
    };

    // Buttons (updated to handle new states)
    const buttonConfig = {
        closed: {
            label: isRequesting
                ? translate("Opening", translation_state) + "…"
                : "📷" + translate("Start Scanning", translation_state),
            action: openScanner,
            disabled: isRequesting || !locationGranted,
        },
        scanner: {
            label: "❌ Close Scanner",
            action: () => setStep("closed"),
            disabled: false,
            title: hasPermission === true ? "" : "Allow camera access first",
        },
        processing: {
            label: "⏳ Processing Attendance...",
            action: () => {},
            disabled: true,
        },
        result: {
            label: attendanceResult?.success ? "✅ Done" : "🔄 Retry",
            action: attendanceResult?.success
                ? closeResult
                : attendanceResult
                ? retryAttendance
                : rescan,
            disabled: isProcessingAttendance,
        },
    };

    const { label, action, disabled, title } = buttonConfig[step];

    return (
        <PageLayout>
            {/* Scanner / Preview area in a rounded frame */}
            <div className="mt-5 flex justify-center">
                <div className="relative w-72 h-72 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100 shadow-sm overflow-hidden">
                    {step === "result" && (scannedText || attendanceResult) ? (
                        <div className="w-full h-full p-4 text-sm grid place-items-center text-center">
                            <div className="space-y-3">
                                {attendanceResult ? (
                                    <>
                                        <div
                                            className={`text-xs ${
                                                attendanceResult.success
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {attendanceResult.success
                                                ? translate(
                                                      "Attendance Success",
                                                      translation_state
                                                  )
                                                : translate(
                                                      "Attendance Failed",
                                                      translation_state
                                                  )}
                                        </div>
                                        <div
                                            className={`text-lg ${
                                                attendanceResult.success
                                                    ? "text-green-700"
                                                    : "text-red-700"
                                            }`}
                                        >
                                            {attendanceResult.success
                                                ? "✅"
                                                : "❌"}
                                        </div>
                                        <div className="max-h-36 overflow-auto rounded-lg bg-white p-3 text-slate-800 text-left break-words">
                                            {attendanceResult.message}
                                        </div>
                                        {attendanceResult.success &&
                                            attendanceResult.data && (
                                                <div className="text-xs text-slate-600">
                                                    <div>
                                                        Status:{" "}
                                                        {
                                                            attendanceResult
                                                                .data.status
                                                        }
                                                    </div>
                                                    {attendanceResult.data
                                                        .check_in_time && (
                                                        <div>
                                                            Time:{" "}
                                                            {new Date(
                                                                attendanceResult.data.check_in_time
                                                            ).toLocaleTimeString()}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={copyText}
                                                className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
                                            >
                                                📋{" "}
                                                {translate(
                                                    "Copy QR",
                                                    translation_state
                                                )}
                                            </button>
                                            {!attendanceResult.success && (
                                                <button
                                                    onClick={retryAttendance}
                                                    disabled={
                                                        isProcessingAttendance
                                                    }
                                                    className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-50"
                                                >
                                                    🔄{" "}
                                                    {translate(
                                                        "Retry",
                                                        translation_state
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-xs text-slate-500">
                                            {translate(
                                                "Scanned QR",
                                                translation_state
                                            )}
                                        </div>
                                        <div className="max-h-36 overflow-auto rounded-lg bg-white p-3 text-slate-800 text-left break-words">
                                            {scannedText}
                                        </div>
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={copyText}
                                                className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
                                            >
                                                📋{" "}
                                                {translate(
                                                    "Copy",
                                                    translation_state
                                                )}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : step === "processing" ? (
                        <div className="w-full h-full grid place-items-center text-center p-4 text-slate-600">
                            <div className="space-y-3">
                                <div className="text-4xl animate-spin">⏳</div>
                                <div className="text-sm font-medium">
                                    {translate(
                                        "Processing Attendance",
                                        translation_state
                                    )}
                                    ...
                                </div>
                                <div className="text-xs text-slate-500">
                                    {translate(
                                        "Submitting QR data with location",
                                        translation_state
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : step === "scanner" &&
                      hasPermission !== false &&
                      mountScanner ? (
                        <QrReader
                            constraints={videoConstraints}
                            onResult={handleScanResult}
                            scanDelay={300}
                            containerStyle={{ width: "100%", height: "100%" }}
                            videoStyle={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    ) : (
                        <div className="w-full h-full grid place-items-center text-center p-4 text-slate-500 text-sm">
                            {isRequesting
                                ? translate(
                                      "Requesting camera permission",
                                      translation_state
                                  ) + "…"
                                : hasPermission === false
                                ? translate(
                                      "Camera blocked. Allow access in browser settings.",
                                      translation_state
                                  )
                                : translate(
                                      "Scanner idle. Click Start Scanning.",
                                      translation_state
                                  )}
                        </div>
                    )}

                    {/* subtle corner markers for scanner look */}
                    <div className="pointer-events-none absolute inset-4">
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-slate-300 rounded-tl-xl" />
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-slate-300 rounded-tr-xl" />
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-slate-300 rounded-bl-xl" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-slate-300 rounded-br-xl" />
                    </div>
                </div>
            </div>

            {/* Status + error */}
            <div className="mt-4 text-center">
                <p className="text-sm text-slate-700">
                    {step === "result" && attendanceResult
                        ? attendanceResult.success
                            ? "Attendance recorded successfully"
                            : "Attendance failed"
                        : step === "result"
                        ? "QR captured"
                        : step === "processing"
                        ? "Processing your attendance..."
                        : step === "scanner" && hasPermission
                        ? "Scanner ready - point camera at QR code"
                        : "No scan yet"}
                </p>
                {step !== "result" && step !== "processing" && (
                    <p className="text-[11px] text-slate-500">
                        {translate(
                            "Hold the QR inside the frame; good lighting helps.",
                            translation_state
                        )}
                    </p>
                )}
                {errorMsg && (
                    <p className="text-[11px] text-rose-600 mt-1">{errorMsg}</p>
                )}
            </div>

            {/* Buttons area */}
            <div className="mt-5 space-y-3">
                {/* Only show if location not granted (auto attempt already ran) */}
                {!locationGranted && (
                    <button
                        onClick={allowLocation}
                        disabled={isRequestingLocation}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-900 text-white px-4 py-2.5 text-sm font-medium shadow-sm hover:bg-slate-800 disabled:opacity-60"
                    >
                        {isRequestingLocation
                            ? translate(
                                  "Requesting location",
                                  translation_state
                              ) + "…"
                            : translate("Allow Location", translation_state)}
                    </button>
                )}

                {/* Main dynamic button */}
                <button
                    onClick={action}
                    disabled={disabled}
                    title={title}
                    className={`w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium shadow-sm active:scale-[.99] disabled:opacity-60 disabled:cursor-not-allowed ${
                        step === "result" && attendanceResult?.success
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : step === "result" &&
                              attendanceResult &&
                              !attendanceResult.success
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                >
                    {label}
                </button>

                {/* Secondary action for result state */}
                {step === "result" && (
                    <button
                        onClick={rescan}
                        disabled={isProcessingAttendance}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white text-slate-700 px-4 py-2 text-sm font-medium shadow-sm hover:bg-slate-50 disabled:opacity-60"
                    >
                        📷 {translate("Scan Another QR", translation_state)}
                    </button>
                )}
            </div>

            {/* Privacy + location note */}
            <div className="mt-4 text-[11px] leading-relaxed text-slate-500 border-t border-slate-100 pt-3">
                {translate(
                    "We only read QR content for attendance. Location confirms presence. On iOS/Safari, camera needs HTTPS and a user gesture.",
                    translation_state
                )}
                {coords && (
                    <span className="block mt-1">
                        Location: {coords.lat?.toFixed(6)},{" "}
                        {coords.lng?.toFixed(6)} (±
                        {Math.round(coords.accuracy || 0)}m)
                    </span>
                )}
            </div>

            {/* Hidden legacy reader for image files only (no live video) */}
            {step === "scanner" && (
                <div className="hidden">
                    <QrReader
                        ref={legacyRef}
                        onResult={(res, err) => {
                            if (res) handleScanResult(res, null);
                        }}
                        scanDelay={500}
                        constraints={{}} // ignored in legacy
                        containerStyle={{ width: 0, height: 0 }}
                        videoStyle={{ width: 0, height: 0 }}
                        // @ts-ignore — legacy method exists at runtime
                        legacyMode={true}
                    />
                </div>
            )}

            {/* Manual Attendance Button — visible only if user has permission */}
            {canManualAttendance && (
                <button
                    onClick={handleManualAttendance}
                    disabled={isProcessingAttendance}
                    className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-[#846CF9] text-white px-4 py-2.5 text-sm font-medium shadow-sm hover:bg-blue-700 disabled:opacity-60"
                >
                    🧍 {translate("Manual Attendance", translation_state)}
                </button>
            )}
        </PageLayout>
    );
}
