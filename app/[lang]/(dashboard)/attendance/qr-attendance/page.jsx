"use client";

import PageLayout from "@/components/page-layout";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Webcam from "react-webcam";
import toast from "react-hot-toast";
import useAttendance from "@/hooks/useAttendance";
import { useFetchBreakReasonsQuery } from "@/domains/attendance/break-reasons/services/breakReasonApi";
import { useFetchFeatureSettingsQuery } from "@/domains/settings/services/featureSettingApi";
import { isBreakFeatureEnabled } from "@/lib/menu-features";
import { useSelector } from "react-redux";
import { formatTime, translate } from "@/lib/utils";
// load QR reader only on client
const QrReader = dynamic(
    () => import("react-qr-reader").then((m) => m.QrReader),
    {
        ssr: false,
    },
);

const isUnderOneMinuteAttendanceError = (message = "") => {
    const normalizedMessage = String(message).toLowerCase();
    const hasOneMinuteText =
        normalizedMessage.includes("1 minute") ||
        normalizedMessage.includes("1 min") ||
        normalizedMessage.includes("one minute");
    const hasTimingErrorText =
        normalizedMessage.includes("under") ||
        normalizedMessage.includes("less") ||
        normalizedMessage.includes("within") ||
        normalizedMessage.includes("wait") ||
        normalizedMessage.includes("again");

    return hasOneMinuteText && hasTimingErrorText;
};

export default function QRAttendance() {
    const translation_state = useSelector((state) => state.auth.translation);
    // Use attendance hook for API calls
    const {
        qrCheckIn,
        qrCheckOut,
        requestAttendance,
        isRequestingAttendance,
        isCheckingIn,
        isCheckingOut,
        branch,
        getBreakStatus,
    } = useAttendance();
    // Employee Manual Attendance
    const { user } = useSelector((state) => state.auth);
    const userPermissions = user?.permissions || [];

    // If permissions are array of objects
    const canManualAttendance = userPermissions.some(
        (perm) => perm.name === "attendance-manual-manage",
    );
    const canRequestAttendance = userPermissions.some(
        (perm) => perm.name === "create-attendance-request",
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
    const [deviceId, setDeviceId] = useState(null);

    // attendance processing
    const [isProcessingAttendance, setIsProcessingAttendance] = useState(false);
    const [reasonModalOpen, setReasonModalOpen] = useState(false);
    const [breakEndModalOpen, setBreakEndModalOpen] = useState(false);
    const [pendingAttendanceMode, setPendingAttendanceMode] = useState(null);
    const [pendingReason, setPendingReason] = useState("");
    const [attendanceReason, setAttendanceReason] = useState("");
    const [selectedBreakReason, setSelectedBreakReason] = useState("");
    const [activeBreak, setActiveBreak] = useState(null);
    const { data: breakReasonsData, isFetching: isFetchingBreakReasons } =
        useFetchBreakReasonsQuery({
            status: "active",
            per_page: 100,
        });
    const breakReasons = breakReasonsData?.data?.break_reasons || [];
    const { data: featureSettings } = useFetchFeatureSettingsQuery();
    const breakEnabled = featureSettings
        ? isBreakFeatureEnabled(featureSettings)
        : true;

    // for legacy image scan
    const legacyRef = useRef(null);
    const webcamRef = useRef(null);
    const attendanceActionLockedRef = useRef(false);
    const [scannerKey, setScannerKey] = useState(0);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [requestReason, setRequestReason] = useState("");
    const [requestFormError, setRequestFormError] = useState("");

    // Camera constraints - simpler and more robust for React 18+
    const constraints = useMemo(() => ({
        facingMode: "environment",
    }), []);



    // --- Location gating (unchanged behavior) ---
    const allowLocation = () => {
        setErrorMsg("");
        setIsRequestingLocation(true);

        // Geolocation is tied to secure contexts (HTTPS). If accessed via HTTP (except localhost), it is undefined.
        if (!navigator.geolocation) {
            setIsRequestingLocation(false);
            setLocationGranted(false);
            setErrorMsg(
                "Location access requires a secure connection (HTTPS). Please use a tunneling service like ngrok.",
            );
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
                let specificMessage = "";

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        specificMessage =
                            "Location access denied. Enable in browser settings.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        specificMessage =
                            "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        specificMessage =
                            "The request to get user location timed out.";
                        break;
                    default:
                        specificMessage =
                            "An unknown error occurred while getting location.";
                        break;
                }

                setErrorMsg(specificMessage);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
        );
    };

    // auto-request location on mount
    useEffect(() => {
        allowLocation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // Protect against environments (like iOS HTTP or old browsers) where mediaDevices is undefined
        if (!navigator?.mediaDevices?.enumerateDevices) {
            console.warn(
                "Camera access is not supported in this environment. Ensure you are using HTTPS.",
            );
            return;
        }

        // Get list of cameras
        navigator.mediaDevices
            .enumerateDevices()
            .then((devices) => {
                const videoDevices = devices.filter(
                    (device) => device.kind === "videoinput",
                );

                // Pick the back camera
                const backCamera =
                    videoDevices.find((device) =>
                        device.label.toLowerCase().includes("back"),
                    ) || videoDevices[0]; // fallback to first camera if no "back" found

                setDeviceId(backCamera?.deviceId);
            })
            .catch((err) => {
                console.error("Error enumerating devices:", err);
            });
    }, []);

    // --- Optional reason before attendance ---
    const startAttendanceFlow = async (mode) => {
        setErrorMsg("");
        setPendingAttendanceMode(mode);

        if (!breakEnabled) {
            setPendingReason("");

            if (mode === "manual") {
                setPendingAttendanceMode(null);
                setStep("processing");
                setScannedText("manual");
                await processAttendance(user?.employee_code || user?.id, "");
                return;
            }

            await openScanner();
            return;
        }

        const status = await getBreakStatus();

        if (status.success && status.data?.on_break) {
            setActiveBreak(status.data);
            setAttendanceReason("");
            setSelectedBreakReason("");
            setBreakEndModalOpen(true);
            return;
        }

        if (
            status.success &&
            (!status.data?.has_attendance || status.data?.next_action === "in")
        ) {
            setPendingReason("");

            if (mode === "manual") {
                setPendingAttendanceMode(null);
                setStep("processing");
                setScannedText("manual");
                await processAttendance(user?.employee_code || user?.id, "");
                return;
            }

            await openScanner();
            return;
        }

        openReasonModal(mode);
    };

    const openReasonModal = (mode) => {
        setErrorMsg("");
        setAttendanceReason("");
        setSelectedBreakReason("");
        setPendingReason("");
        setPendingAttendanceMode(mode);
        setReasonModalOpen(true);
    };

    const closeReasonModal = () => {
        setReasonModalOpen(false);
        setPendingAttendanceMode(null);
        setPendingReason("");
        setAttendanceReason("");
        setSelectedBreakReason("");
    };

    const closeBreakEndModal = () => {
        setBreakEndModalOpen(false);
        setPendingAttendanceMode(null);
        setActiveBreak(null);
    };

    const endBreak = async () => {
        const mode = pendingAttendanceMode;

        setBreakEndModalOpen(false);
        setActiveBreak(null);
        setAttendanceReason("");
        setPendingReason("");

        if (mode === "manual") {
            setStep("processing");
            setScannedText("manual");
            await processAttendance(user?.employee_code || user?.id, "");
            return;
        }

        await openScanner();
    };

    const submitReason = async () => {
        const reason =
            selectedBreakReason === "other"
                ? attendanceReason.trim()
                : selectedBreakReason.trim();
        const mode = pendingAttendanceMode;

        setReasonModalOpen(false);
        setPendingAttendanceMode(null);
        setPendingReason(reason);

        if (mode === "manual") {
            setStep("processing");
            setScannedText("manual");
            await processAttendance(user?.employee_code || user?.id, reason);
            return;
        }

        await openScanner();
    };

    // --- Open camera/scanner (asks for permission first) ---
    const openScanner = async () => {
        setErrorMsg("");
        setIsRequesting(true);
        attendanceActionLockedRef.current = false;
        try {
            // Simply transition to scanner step; QrReader will handle the permission prompt automatically
            setHasPermission(true); 
            setStep("scanner");
            setScannerKey(prev => prev + 1);
            setMountScanner(false);
            setTimeout(() => setMountScanner(true), 1000);
        } catch (e) {
            console.error("Scanner transition error:", e);
            setErrorMsg("Failed to start scanner.");
        } finally {
            setIsRequesting(false);
        }
    };

    // --- Handle scanning results ---
    const handleScanResult = useCallback(
        async (result, error) => {
            if (
                step !== "scanner" ||
                attendanceResult ||
                attendanceActionLockedRef.current
            ) {
                return;
            }

            if (!!result) {
                const text =
                    result?.getText?.() ?? result?.text ?? String(result);

                if (text) {
                    attendanceActionLockedRef.current = true;
                    setScannedText(text);
                    setStep("processing");

                    // Stop camera immediately after scan
                    setMountScanner(false);

                    // toast.success("QR scanned! Processing attendance...");
                    try {
                        navigator.vibrate?.(60);
                    } catch {}

                    // Process attendance with location
                    await processAttendance(text, pendingReason);
                }
            }
            if (!!error) {
                // Diagnose common camera errors
                const msg = error?.message || String(error);
                if (msg.includes("NotAllowedError") || msg.includes("Permission denied")) {
                    setErrorMsg("Camera access denied. Please check your browser settings.");
                    setHasPermission(false);
                    setStep("closed");
                } else if (msg.includes("invalid state")) {
                    // Try to recover from invalid track state by re-mounting
                    console.warn("Invalid track state detected, attempting recovery...");
                    setMountScanner(false);
                    setTimeout(() => setMountScanner(true), 500);
                }
            }
        },
        [attendanceResult, pendingReason, step],
    );

    // --- Native QR Scanning Loop (for maximum stability on Next 16) ---
    useEffect(() => {
        let active = true;
        let interval;

        const scan = async () => {
            if (!active || !webcamRef.current?.video) return;
            const video = webcamRef.current.video;

            // Only scan if video is playing and has frames
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                try {
                    // Try native BarcodeDetector API (fastest, no extra library needed)
                    // @ts-ignore
                    if (window.BarcodeDetector) {
                        // @ts-ignore
                        const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
                        const barcodes = await detector.detect(video);
                        if (barcodes.length > 0 && barcodes[0].rawValue) {
                            handleScanResult(barcodes[0].rawValue);
                            return;
                        }
                    }
                } catch (e) {
                    // console.error("Native scan error:", e);
                }
            }
        };

        if (step === "scanner" && mountScanner) {
            interval = setInterval(scan, 500); // scan twice per second
        }

        return () => {
            active = false;
            clearInterval(interval);
        };
    }, [step, mountScanner, handleScanResult]);

    // Employee Manual Attendance
    const handleManualAttendance = async () => {
        try {
            startAttendanceFlow("manual");
        } catch (error) {
            console.error("Manual attendance failed:", error);
            toast.error("Manual attendance failed");
            setStep("scan");
        }
    };

    // Process attendance after QR scan
    const processAttendance = async (qrData, reason = attendanceReason) => {
        if (!coords) {
            setErrorMsg(
                "Location is required for attendance. Please allow location access.",
            );
            setStep("result");
            return;
        }

        // Prevent multiple submissions
        if (isProcessingAttendance) return;
        setIsProcessingAttendance(true);
        let shouldShowResultModal = true;

        try {
            // For now, we'll assume check-in by default
            // You could enhance this to detect check-in/check-out based on QR content or current status
            const result = await qrCheckIn(
                qrData,
                coords.lat,
                coords.lng,
                branch,
                reason?.trim() || null,
            );
            const resultMessage =
                result?.message ||
                result?.error ||
                "Attendance processed";

            if (!result?.success) {
                shouldShowResultModal = false;
                setAttendanceResult(null);
                setStep("closed");

                if (!isUnderOneMinuteAttendanceError(resultMessage)) {
                    toast.error(resultMessage);
                }

                return;
            }

            setAttendanceResult({
                success: result?.success,
                message: resultMessage,
                data: result?.data,
            });
        } catch (error) {
            console.error("QR Attendance processing error:", error);
            const errorMessage =
                error?.message ||
                "Failed to process attendance. Please try again.";

            shouldShowResultModal = false;
            setAttendanceResult(null);
            setStep("closed");
            toast.error(errorMessage);
            return;
        } finally {
            setIsProcessingAttendance(false);
            if (shouldShowResultModal) {
                setStep("result");
            }
        }
    };

    const rescan = () => {
        attendanceActionLockedRef.current = false;
        setScannedText(null);
        setAttendanceResult(null);
        setErrorMsg("");
        startAttendanceFlow("scan");
    };

    const retryAttendance = async () => {
        if (!scannedText) return;
        attendanceActionLockedRef.current = false;
        setStep("processing");
        await processAttendance(scannedText);
    };

    const closeResult = () => {
        attendanceActionLockedRef.current = false;
        setScannedText(null);
        setAttendanceResult(null);
        setErrorMsg("");
        setStep("closed");
    };

    const openRequestModal = () => {
        setRequestFormError("");
        setRequestReason("");
        setIsRequestModalOpen(true);
    };

    const closeRequestModal = () => {
        setIsRequestModalOpen(false);
        setRequestFormError("");
    };

    const submitAttendanceRequest = async () => {
        if (!coords) {
            setRequestFormError(
                "Location is required to submit an attendance request.",
            );
            return;
        }

        if (!requestReason.trim()) {
            setRequestFormError("Please provide a reason for the request.");
            return;
        }

        const currentTime = new Date();
        const formattedTime = `${String(currentTime.getHours()).padStart(2, "0")}:${String(currentTime.getMinutes()).padStart(2, "0")}:${String(currentTime.getSeconds()).padStart(2, "0")}`;
        const requestDate = currentTime.toISOString().slice(0, 10);

        const result = await requestAttendance({
            date: requestDate,
            requested_check_in_time: formattedTime,
            reason: requestReason,
            latitude: coords.lat,
            longitude: coords.lng,
        });

        if (result.success) {
            setIsRequestModalOpen(false);
        } else {
            setRequestFormError(result.error || "Failed to submit attendance request.");
        }
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
            action: () => startAttendanceFlow("scan"),
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
    const resultMessage = attendanceResult?.message || "";
    const resultMessageLower = resultMessage.toLowerCase();
    const resultTone = !attendanceResult?.success
        ? {
              title: "Attendance Failed",
              panel: "border-red-200 bg-red-50",
              heading: "text-red-800",
              body: "text-red-700",
              button: "bg-red-600 hover:bg-red-700",
          }
        : resultMessageLower.includes("break started")
          ? {
                title: "Break Started",
                panel: "border-amber-200 bg-amber-50",
                heading: "text-amber-900",
                body: "text-amber-800",
                button: "bg-amber-600 hover:bg-amber-700",
            }
          : resultMessageLower.includes("break ended")
            ? {
                  title: "Break Ended",
                  panel: "border-blue-200 bg-blue-50",
                  heading: "text-blue-900",
                  body: "text-blue-800",
                  button: "bg-blue-600 hover:bg-blue-700",
              }
            : resultMessageLower.includes("out")
              ? {
                    title: "Exit Recorded",
                    panel: "border-slate-200 bg-slate-50",
                    heading: "text-slate-900",
                    body: "text-slate-700",
                    button: "bg-slate-900 hover:bg-slate-800",
                }
              : {
                    title: "Arrival Recorded",
                    panel: "border-green-200 bg-green-50",
                    heading: "text-green-900",
                    body: "text-green-800",
                    button: "bg-green-600 hover:bg-green-700",
                };

    return (
        <PageLayout>
            {step === "result" && attendanceResult && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
                    <div
                        className={`w-full max-w-md rounded-xl border p-5 shadow-xl ${resultTone.panel}`}
                    >
                        <div className="space-y-2">
                            <h2
                                className={`text-base font-semibold ${resultTone.heading}`}
                            >
                                {translate(resultTone.title, translation_state)}
                            </h2>
                            <p className={`text-sm ${resultTone.body}`}>
                                {resultMessage}
                            </p>
                        </div>

                        <div className="mt-5 flex justify-end gap-2">
                            {!attendanceResult.success && (
                                <button
                                    type="button"
                                    onClick={retryAttendance}
                                    disabled={isProcessingAttendance}
                                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                >
                                    {translate("Retry", translation_state)}
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={closeResult}
                                className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${resultTone.button}`}
                            >
                                {translate("Done", translation_state)}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {breakEnabled && reasonModalOpen && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
                        <div className="space-y-1">
                            <h2 className="text-base font-semibold text-slate-900">
                                {translate("Break or Exit", translation_state)}
                            </h2>
                            <p className="text-xs text-slate-500">
                                {translate(
                                    "Choose a break reason to start a break. Select No break if you are going out without a break reason.",
                                    translation_state,
                                )}
                            </p>
                        </div>

                        <div className="mt-4 max-h-56 space-y-2 overflow-y-auto pr-1">
                            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                                <input
                                    type="radio"
                                    name="break_reason"
                                    value=""
                                    checked={selectedBreakReason === ""}
                                    onChange={() => {
                                        setSelectedBreakReason("");
                                        setAttendanceReason("");
                                    }}
                                    className="h-4 w-4"
                                />
                                {translate("No break", translation_state)}
                            </label>

                            {isFetchingBreakReasons ? (
                                <div className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500">
                                    {translate("Loading", translation_state)}...
                                </div>
                            ) : (
                                breakReasons.map((reason) => (
                                    <label
                                        key={reason.id}
                                        className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                    >
                                        <input
                                            type="radio"
                                            name="break_reason"
                                            value={reason.name}
                                            checked={
                                                selectedBreakReason ===
                                                reason.name
                                            }
                                            onChange={() => {
                                                setSelectedBreakReason(
                                                    reason.name,
                                                );
                                                setAttendanceReason("");
                                            }}
                                            className="h-4 w-4"
                                        />
                                        {reason.name}
                                    </label>
                                ))
                            )}

                            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                                <input
                                    type="radio"
                                    name="break_reason"
                                    value="other"
                                    checked={selectedBreakReason === "other"}
                                    onChange={() =>
                                        setSelectedBreakReason("other")
                                    }
                                    className="h-4 w-4"
                                />
                                {translate("Other", translation_state)}
                            </label>
                        </div>

                        {selectedBreakReason === "other" && (
                            <textarea
                                value={attendanceReason}
                                onChange={(event) =>
                                    setAttendanceReason(event.target.value)
                                }
                                rows={4}
                                maxLength={1000}
                                placeholder={translate(
                                    "Enter reason",
                                    translation_state,
                                )}
                                className="mt-3 w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900"
                            />
                        )}

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={closeReasonModal}
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                {translate("Cancel", translation_state)}
                            </button>
                            <button
                                type="button"
                                onClick={submitReason}
                                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                            >
                                {translate("Submit", translation_state)}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {breakEnabled && breakEndModalOpen && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
                        <div className="space-y-2">
                            <h2 className="text-base font-semibold text-slate-900">
                                {translate("End Break", translation_state)}
                            </h2>
                            <p className="text-sm text-slate-600">
                                {translate(
                                    "You are currently on break. Submit now to end your break and record your return attendance.",
                                    translation_state,
                                )}
                            </p>
                            {activeBreak?.break_reason && (
                                <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-700">
                                    <span className="font-medium">
                                        {translate("Reason", translation_state)}:
                                    </span>{" "}
                                    {activeBreak.break_reason}
                                </div>
                            )}
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={closeBreakEndModal}
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                {translate("Cancel", translation_state)}
                            </button>
                            <button
                                type="button"
                                onClick={endBreak}
                                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                            >
                                {translate("End Break", translation_state)}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                                                      translation_state,
                                                  )
                                                : translate(
                                                      "Attendance Failed",
                                                      translation_state,
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
                                                            {formatTime(
                                                                attendanceResult
                                                                    .data
                                                                    .check_in_time,
                                                            )}
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
                                                    translation_state,
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
                                                        translation_state,
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
                                                translation_state,
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
                                                    translation_state,
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
                                        translation_state,
                                    )}
                                    ...
                                </div>
                                <div className="text-xs text-slate-500">
                                    {translate(
                                        "Submitting QR data with location",
                                        translation_state,
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : step === "scanner" &&
                      hasPermission !== false &&
                      mountScanner ? (
                        <Webcam
                            audio={false}
                            key={`webcam-${scannerKey}`}
                            ref={webcamRef}
                            videoConstraints={{ 
                                facingMode: "environment",
                                width: { ideal: 1280 },
                                height: { ideal: 720 }
                            }}
                            style={{
                                width: "100%",
                                height: "100%",
                                minHeight: "288px",
                                objectFit: "cover",
                                backgroundColor: "black",
                            }}
                        />
                    ) : (
                        <div className="w-full h-full grid place-items-center text-center p-4 text-slate-500 text-sm">
                            {isRequesting
                                ? translate(
                                      "Requesting camera permission",
                                      translation_state,
                                  ) + "…"
                                : hasPermission === false
                                  ? translate(
                                        "Camera blocked. Allow access in browser settings.",
                                        translation_state,
                                    )
                                  : translate(
                                        "Scanner idle. Click Start Scanning.",
                                        translation_state,
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
                            translation_state,
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
                                  translation_state,
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
                    translation_state,
                )}
                {coords && (
                    <span className="block mt-1">
                        Location: {coords.lat?.toFixed(6)},{" "}
                        {coords.lng?.toFixed(6)} (±
                        {Math.round(coords.accuracy || 0)}m)
                    </span>
                )}
            </div>



            {canRequestAttendance && (
                <button
                    onClick={openRequestModal}
                    disabled={!locationGranted || isRequestingAttendance}
                    className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-orange-600 text-white px-4 py-2.5 text-sm font-medium shadow-sm hover:bg-orange-700 disabled:opacity-60"
                >
                    📝 {translate("Request Attendance", translation_state)}
                </button>
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

            {isRequestModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900">
                                {translate("Attendance Request", translation_state)}
                            </h2>
                            <button
                                onClick={closeRequestModal}
                                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                                aria-label={translate("Close", translation_state)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mt-4 space-y-4 text-sm text-slate-700">
                            <div>
                                <label className="mb-1 block font-medium">
                                    {translate("Reason", translation_state)}
                                </label>
                                <textarea
                                    rows={4}
                                    value={requestReason}
                                    onChange={(e) => setRequestReason(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-slate-400"
                                    placeholder={translate(
                                        "Explain why you need this attendance request",
                                        translation_state,
                                    )}
                                />
                            </div>

                            {requestFormError && (
                                <div className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700">
                                    {requestFormError}
                                </div>
                            )}
                        </div>

                        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <button
                                onClick={closeRequestModal}
                                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                            >
                                {translate("Cancel", translation_state)}
                            </button>
                            <button
                                onClick={submitAttendanceRequest}
                                disabled={isRequestingAttendance}
                                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
                            >
                                {isRequestingAttendance
                                    ? translate("Submitting", translation_state) + "…"
                                    : translate("Submit Request", translation_state)}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PageLayout>
    );
}
