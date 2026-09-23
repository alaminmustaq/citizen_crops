"use client";

import PageLayout from "@/components/page-layout";
import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import toast from "react-hot-toast";

export default function FaceAttendance() {
  const webcamRef = useRef(null);

  // step: "closed" | "camera" | "photo"
  const [step, setStep] = useState("closed");
  const [image, setImage] = useState(null);

  // camera permission
  const [hasPermission, setHasPermission] = useState(null); // null | true | false
  const [isRequesting, setIsRequesting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [mountWebcam, setMountWebcam] = useState(false);

  // location permission
  const [locationGranted, setLocationGranted] = useState(false);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [coords, setCoords] = useState(null);

  const videoConstraints = {
    width: 540,
    facingMode: "user",
  };

  // --- Actions ---
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

  // ✅ auto-request location on page load
  useEffect(() => {
    allowLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCamera = async () => {
    setErrorMsg("");
    setIsRequesting(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      stream.getTracks().forEach((t) => t.stop());

      setHasPermission(true);
      setStep("camera");

      setMountWebcam(false);
      setTimeout(() => setMountWebcam(true), 0);
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

  const takePhoto = useCallback(() => {
    if (!webcamRef.current) return;
    const shot = webcamRef.current.getScreenshot();
    if (shot) {
      setImage(shot);
      setStep("photo");
      toast.success("Attendance taken successfully");
    }
  }, []);

  const retake = () => {
    setImage(null);
    setStep("camera");
  };

  const handleUserMedia = () => {
    setHasPermission(true);
    setErrorMsg("");
  };

  const handleUserMediaError = (e) => {
    setHasPermission(false);
    setStep("closed");
    setErrorMsg(
      typeof e?.message === "string"
        ? e.message
        : "Camera access blocked or no camera found."
    );
  };

  // Buttons (unchanged layout)
  const buttonConfig = {
    closed: {
      label: isRequesting ? "Opening…" : "📷 Open Camera",
      action: openCamera,
      // keep camera gated behind location
      disabled: isRequesting || !locationGranted,
    },
    camera: {
      label: "📸 Take Photo",
      action: takePhoto,
      disabled: hasPermission !== true,
      title: hasPermission === true ? "" : "Allow camera access first",
    },
    photo: {
      label: "🔄 Retake",
      action: retake,
      disabled: false,
    },
  };

  const { label, action, disabled, title } = buttonConfig[step];

  return (
    <PageLayout>
      {/* Preview circle */}
      <div className="mt-5 flex justify-center">
        <div className="relative w-60 h-60 rounded-full border border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100 shadow-sm overflow-hidden">
          {step === "photo" && image ? (
            <img
              src={image}
              alt="Captured"
              className="w-full h-full object-cover rounded-full"
            />
          ) : step === "camera" && hasPermission !== false && mountWebcam ? (
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              onUserMedia={handleUserMedia}
              onUserMediaError={handleUserMediaError}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-center p-4 text-slate-500 text-sm">
              {isRequesting
                ? "Requesting camera permission…"
                : hasPermission === false
                ? "Camera blocked. Allow access in browser settings."
                : "Camera closed. Click Open Camera."}
            </div>
          )}
          {/* tiny flash dot */}
          <span className="absolute top-3 right-6 size-1.5 rounded-full bg-rose-400 shadow-[0_0_0_2px_rgba(255,255,255,0.9)]" />
        </div>
      </div>

      {/* Status + error */}
      <div className="mt-4 text-center">
        <p className="text-sm text-slate-700">
          {step === "photo"
            ? "Attendance captured"
            : step === "camera" && hasPermission
            ? "Camera ready"
            : "No attendance yet"}
        </p>
        {step !== "photo" && (
          <p className="text-[11px] text-slate-500">
            Face forward; good lighting recommended.
          </p>
        )}
        {errorMsg && (
          <p className="text-[11px] text-rose-600 mt-1">{errorMsg}</p>
        )}
      </div>

      {/* Buttons area (kept same design) */}
      <div className="mt-5 space-y-3">
        {/* Show this ONLY if location is not granted (auto attempt already ran) */}
        {!locationGranted && (
          <button
            onClick={allowLocation}
            disabled={isRequestingLocation}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-900 text-white px-4 py-2.5 text-sm font-medium shadow-sm hover:bg-slate-800 disabled:opacity-60"
          >
            {isRequestingLocation
              ? "Requesting location…"
              : "📍 Allow Location"}
          </button>
        )}

        {/* Main dynamic button (open camera / take photo / retake) */}
        <button
          onClick={action}
          disabled={disabled}
          title={title}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-900 text-white px-4 py-2.5 text-sm font-medium shadow-sm hover:bg-slate-800 active:scale-[.99] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {label}
        </button>
      </div>

      {/* Privacy + location note */}
      <div className="mt-4 text-[11px] leading-relaxed text-slate-500 border-t border-slate-100 pt-3">
        Photos are used only to verify attendance. Location is required to
        confirm presence. On iOS/Safari, camera needs HTTPS and a user gesture
        to start.
        {coords && (
          <span className="block mt-1">
            Location: {coords.lat?.toFixed(6)}, {coords.lng?.toFixed(6)} (±
            {Math.round(coords.accuracy || 0)}m)
          </span>
        )}
      </div>
    </PageLayout>
  );
}
