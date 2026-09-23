import { useCallback, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/use-redux";
import {
    useViewAttendanceQuery,
    useGenerateQRCodeMutation,
    useScanQRCodeMutation,
    useLazyGetQRStatusQuery,
    useCheckInMutation,
    useCheckOutMutation,
    useLazyGetTodayAttendanceQuery,
    useSyncOfflineDataMutation,
    useLazyGetLatestBranchLocationQuery,
} from "../services/attendanceApi";
import {
    setTodayAttendance,
    setCurrentQRCode,
    setQRStatus,
    checkIn as checkInAction,
    checkOut as checkOutAction,
    addToOfflineData,
    setSyncStatus,
    setLastAction,
} from "../model/attendanceSlice";
import toast from "react-hot-toast";

const useAttendance = () => {
    const dispatch = useAppDispatch();

    // Get current attendance state
    const {
        todayAttendance,
        currentQRCode,
        qrStatus,
        isCheckedIn,
        lastAction,
        offlineData,
        syncStatus,
    } = useAppSelector((state) => state.attendance);

    // Get current user data for employee_id
    const { user, branch } = useAppSelector((state) => state.auth);

    // RTK Query hooks
    const [generateQRCodeMutation, { isLoading: isGeneratingQR }] =
        useGenerateQRCodeMutation();
    const [scanQRCodeMutation, { isLoading: isScanningQR }] =
        useScanQRCodeMutation();
    const [triggerGetQRStatus] = useLazyGetQRStatusQuery();
    const [checkInMutation, { isLoading: isCheckingIn }] = useCheckInMutation();
    const [checkOutMutation, { isLoading: isCheckingOut }] =
        useCheckOutMutation();
    const [triggerGetTodayAttendance] = useLazyGetTodayAttendanceQuery();
    const [getLatestBranchLocation] = useLazyGetLatestBranchLocationQuery();
    const [syncOfflineDataMutation, { isLoading: isSyncing }] =
        useSyncOfflineDataMutation();

    //  const { data: attendance} = useViewAttendanceQuery();
    const { data, refetch, isFetching } = useViewAttendanceQuery();

    const attendanceState = {
        data: data?.data || [],

        refetch,
        pagination: data?.data?.pagination || {},
        isFetching,
    };

    // State for location configuration
    const [TARGET_LATITUDE, setTargetLatitude] = useState(null);
    const [TARGET_LONGITUDE, setTargetLongitude] = useState(null);
    const [ALLOWED_RANGE_METERS, setAllowedRangeMeters] = useState(100);

    // useEffect to update location configuration when branch data changes
    useEffect(() => {
        if (branch) {
            // Convert to numeric values, ensuring proper float conversion
            const latitude = branch?.latitude
                ? parseFloat(branch.latitude)
                : null;
            const longitude = branch?.longitude
                ? parseFloat(branch.longitude)
                : null;

            setTargetLatitude(latitude);
            setTargetLongitude(longitude);
            setAllowedRangeMeters(branch?.allowed_range_meters || 100);
        } else {
            // Reset to defaults when no branch data
            setTargetLatitude(null);
            setTargetLongitude(null);
            setAllowedRangeMeters(100);
        }
    }, [branch]);

    // utils/distance.js
    const isWithinRange = (
        lat1,
        lon1,
        lat2,
        lon2,
        rangeMeters = ALLOWED_RANGE_METERS
    ) => {
        const R = 6371e3; // Earth radius in meters
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;

        const a =
            Math.sin(Δφ / 2) ** 2 +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c; // in meters
        return {
            isWithin: distance <= rangeMeters,
            distance: Math.round(distance),
        };
    };

    // Get current location helper
    const getCurrentLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(
                    new Error("Geolocation is not supported by this browser")
                );
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                    });
                },
                (error) => {
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000, // 5 minutes
                }
            );
        });
    };

    // QR Code operations
    const generateQRCode = useCallback(
        async (branchId, expiresInMinutes = 30) => {
            try {
                const response = await generateQRCodeMutation({
                    branchId,
                    expiresInMinutes,
                }).unwrap();

                dispatch(setCurrentQRCode(response.data));

                return {
                    success: true,
                    data: response.data,
                    message:
                        response.message || "QR code generated successfully",
                };
            } catch (error) {
                console.error("Generate QR error:", error);
                return {
                    success: false,
                    error: error?.data?.message || "Failed to generate QR code",
                };
            }
        },
        [generateQRCodeMutation, dispatch]
    );

    const getQRStatus = useCallback(
        async (branchId) => {
            try {
                const response = await triggerGetQRStatus(branchId).unwrap();
                dispatch(setQRStatus(response.data));

                return {
                    success: true,
                    data: response.data,
                };
            } catch (error) {
                console.error("Get QR status error:", error);
                return {
                    success: false,
                    error: error?.data?.message || "Failed to get QR status",
                };
            }
        },
        [triggerGetQRStatus, dispatch]
    );

    // QR Attendance operations
    const qrCheckIn = useCallback(
        async (qrData, latitude, longitude, branchData = null) => {
            try {
                // Use provided branch data or fallback to hook's branch
                const useBranch = branchData || branch;
                const currentLocation = await getLatestBranchLocation();
               
                console.log("QR Check-in branch data:", {
                    providedBranch: !!branchData,
                    hookBranch: !!branch,
                    usedBranch: !!useBranch,
                    branchLatitude: currentLocation?.data?.latitude,
                    branchLongitude:  currentLocation?.data?.longitude,
                    branchRange:  currentLocation?.data?.allowed_range_meters,
                });

                // Get current location if not provided
                if (!latitude || !longitude) {
                    try {
                        const location = await getCurrentLocation();
                        latitude = location.latitude;
                        longitude = location.longitude;

                        console.log("QR Check-in: Location retrieved:", {
                            latitude,
                            longitude,
                            accuracy: location.accuracy,
                        });
                    } catch (locationError) {
                        console.error(
                            "QR Check-in: Location error:",
                            locationError
                        );
                        toast.error(
                            "Please enable location access for attendance"
                        );
                        return {
                            success: false,
                            error: "Location access required",
                        };
                    }
                }

                // Convert branch coordinates to numbers for validation
                const targetLat =  currentLocation?.data?.latitude
                    ? parseFloat( currentLocation?.data?.latitude)
                    : null;
                const targetLng =  currentLocation?.data?.longitude
                    ? parseFloat( currentLocation?.data?.longitude)
                    : null;
                const allowedRange =  currentLocation?.data?.allowed_range_meters || 100;

                // Check location validation
                const locationCheck = isWithinRange(
                    targetLat,
                    targetLng,
                    latitude,
                    longitude,
                    allowedRange
                );

                console.log("QR Check-in location validation:", {
                    targetLat: targetLat,
                    targetLng: targetLng,
                    currentLat: latitude,
                    currentLng: longitude,
                    allowedRange: allowedRange,
                    targetLatType: typeof targetLat,
                    targetLngType: typeof targetLng,
                    distance: locationCheck.distance,
                    isWithin: locationCheck.isWithin,
                    branchData:  currentLocation?.data,
                });

                if (!locationCheck.isWithin) {
                    const errorMessage = `You are outside the allowed range for check-in. Distance: ${locationCheck.distance}m (Max: ${allowedRange}m)`;
                    toast.error(errorMessage);
                    return {
                        success: false,
                        error: errorMessage,
                    };
                }

                // Parse QR data to extract token
                let qrToken = qrData;
                try {
                    const parsed = JSON.parse(qrData);
                    qrToken = parsed.qr_token || parsed.token || qrData;
                } catch {
                    // If it's not JSON, use as-is
                    qrToken = qrData;
                }

                const deviceInfo = {
                    user_agent: navigator.userAgent,
                    timestamp: new Date().toISOString(),
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                };

                const response = await scanQRCodeMutation({
                    qrToken,
                    action: "check_in",
                    latitude,
                    longitude,
                    deviceInfo,
                }).unwrap();

                dispatch(checkInAction(response.data));
                dispatch(
                    setLastAction({
                        action: "check_in",
                        success: true,
                        data: response.data,
                    })
                );

                toast.success(response.message || "Check-in successful!");

                return {
                    success: true,
                    data: response.data,
                    message: response.message || "Check-in successful!",
                };
            } catch (error) {
                console.error("QR Check-in error:", error);

                const errorMessage =
                    error?.data?.message ||
                    error?.data?.errors?.qr_token?.[0] ||
                    "Check-in failed. Please try again.";

                dispatch(
                    setLastAction({
                        action: "check_in",
                        success: false,
                        error: errorMessage,
                    })
                );

                // Store for offline sync if network error
                if (!navigator.onLine || error?.status >= 500) {
                    dispatch(
                        addToOfflineData({
                            action: "check_in",
                            qr_token: qrToken,
                            latitude,
                            longitude,
                            device_info: deviceInfo,
                        })
                    );
                    toast.error("Stored offline. Will sync when online.");
                } else {
                    toast.error(errorMessage);
                }

                return {
                    success: false,
                    error: errorMessage,
                };
            }
        },
        [scanQRCodeMutation, dispatch]
    );

    const qrCheckOut = useCallback(
        async (qrData, latitude, longitude) => {
            try {
                // Check location validation
                const locationCheck = isWithinRange(
                    TARGET_LATITUDE,
                    TARGET_LONGITUDE,
                    latitude,
                    longitude
                );

                console.log("Location check:", locationCheck);

                if (!locationCheck.isWithin) {
                    const errorMessage = `You are outside the allowed range for check-out. Distance: ${locationCheck.distance}m (Max: ${ALLOWED_RANGE_METERS}m)`;
                    toast.error(errorMessage);
                    return {
                        success: false,
                        error: errorMessage,
                    };
                }

                // Parse QR data to extract token
                let qrToken = qrData;
                try {
                    const parsed = JSON.parse(qrData);
                    qrToken = parsed.qr_token || parsed.token || qrData;
                } catch {
                    // If it's not JSON, use as-is
                    qrToken = qrData;
                }

                const deviceInfo = {
                    user_agent: navigator.userAgent,
                    timestamp: new Date().toISOString(),
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                };

                const response = await scanQRCodeMutation({
                    qrToken,
                    action: "check_out",
                    latitude,
                    longitude,
                    deviceInfo,
                }).unwrap();

                dispatch(checkOutAction(response.data));
                dispatch(
                    setLastAction({
                        action: "check_out",
                        success: true,
                        data: response.data,
                    })
                );

                toast.success(response.message || "Check-out successful!");

                return {
                    success: true,
                    data: response.data,
                    message: response.message || "Check-out successful!",
                };
            } catch (error) {
                console.error("QR Check-out error:", error);

                const errorMessage =
                    error?.data?.message ||
                    error?.data?.errors?.qr_token?.[0] ||
                    "Check-out failed. Please try again.";

                dispatch(
                    setLastAction({
                        action: "check_out",
                        success: false,
                        error: errorMessage,
                    })
                );

                // Store for offline sync if network error
                if (!navigator.onLine || error?.status >= 500) {
                    dispatch(
                        addToOfflineData({
                            action: "check_out",
                            qr_token: qrToken,
                            latitude,
                            longitude,
                            device_info: deviceInfo,
                        })
                    );
                    toast.error("Stored offline. Will sync when online.");
                } else {
                    toast.error(errorMessage);
                }

                return {
                    success: false,
                    error: errorMessage,
                };
            }
        },
        [scanQRCodeMutation, dispatch]
    );

    // Regular attendance operations
    const checkIn = useCallback(
        async (method = "manual", additionalData = {}) => {
            try {
                // Get current location if not provided
                let { latitude, longitude } = additionalData;

                if (!latitude || !longitude) {
                    try {
                        const location = await getCurrentLocation();
                        latitude = location.latitude;
                        longitude = location.longitude;

                        // Add location to additionalData
                        additionalData.latitude = latitude;
                        additionalData.longitude = longitude;
                    } catch (locationError) {
                        toast.error(
                            "Please enable location access for attendance"
                        );
                        return {
                            success: false,
                            error: "Location access required",
                        };
                    }
                }

                // Check location validation
                const locationCheck = isWithinRange(
                    TARGET_LATITUDE,
                    TARGET_LONGITUDE,
                    latitude,
                    longitude
                );

                console.log("Location check:", locationCheck);

                if (!locationCheck.isWithin) {
                    const errorMessage = `You are outside the allowed range for check-in. Distance: ${locationCheck.distance}m (Max: ${ALLOWED_RANGE_METERS}m)`;
                    toast.error(errorMessage);
                    return {
                        success: false,
                        error: errorMessage,
                    };
                }

                const response = await checkInMutation({
                    method,
                    ...additionalData,
                }).unwrap();

                dispatch(checkInAction(response.data));
                toast.success(response.message || "Check-in successful!");

                return {
                    success: true,
                    data: response.data,
                    message: response.message || "Check-in successful!",
                };
            } catch (error) {
                console.error("Check-in error:", error);
                const errorMessage = error?.data?.message || "Check-in failed";
                toast.error(errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                };
            }
        },
        [checkInMutation, dispatch]
    );

    const checkOut = useCallback(
        async (method = "manual", additionalData = {}) => {
            try {
                // Get current location if not provided
                let { latitude, longitude } = additionalData;

                if (!latitude || !longitude) {
                    try {
                        const location = await getCurrentLocation();
                        latitude = location.latitude;
                        longitude = location.longitude;

                        // Add location to additionalData
                        additionalData.latitude = latitude;
                        additionalData.longitude = longitude;
                    } catch (locationError) {
                        toast.error(
                            "Please enable location access for attendance"
                        );
                        return {
                            success: false,
                            error: "Location access required",
                        };
                    }
                }

                // Check location validation
                const locationCheck = isWithinRange(
                    TARGET_LATITUDE,
                    TARGET_LONGITUDE,
                    latitude,
                    longitude
                );

                console.log("Location check:", locationCheck);

                if (!locationCheck.isWithin) {
                    const errorMessage = `You are outside the allowed range for check-out. Distance: ${locationCheck.distance}m (Max: ${ALLOWED_RANGE_METERS}m)`;
                    toast.error(errorMessage);
                    return {
                        success: false,
                        error: errorMessage,
                    };
                }

                const response = await checkOutMutation({
                    method,
                    ...additionalData,
                }).unwrap();

                dispatch(checkOutAction(response.data));
                toast.success(response.message || "Check-out successful!");

                return {
                    success: true,
                    data: response.data,
                    message: response.message || "Check-out successful!",
                };
            } catch (error) {
                console.error("Check-out error:", error);
                const errorMessage = error?.data?.message || "Check-out failed";
                toast.error(errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                };
            }
        },
        [checkOutMutation, dispatch]
    );

    const getTodayAttendance = useCallback(async () => {
        try {
            const response = await triggerGetTodayAttendance().unwrap();
            dispatch(setTodayAttendance(response.data));
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            console.error("Get attendance error:", error);
            return {
                success: false,
                error: error?.data?.message || "Failed to get attendance data",
            };
        }
    }, [triggerGetTodayAttendance, dispatch]);

    // Offline sync
    const syncOfflineData = useCallback(async () => {
        if (offlineData.length === 0) {
            return { success: true, message: "No offline data to sync" };
        }

        try {
            dispatch(setSyncStatus("syncing"));

            const response = await syncOfflineDataMutation(
                offlineData
            ).unwrap();

            dispatch(clearOfflineData());
            dispatch(setSyncStatus("completed"));

            toast.success(`Synced ${offlineData.length} offline records`);

            return {
                success: true,
                data: response.data,
                message: response.message || "Offline data synced successfully",
            };
        } catch (error) {
            dispatch(setSyncStatus("failed"));
            console.error("Sync error:", error);
            const errorMessage =
                error?.data?.message || "Failed to sync offline data";
            toast.error(errorMessage);
            return {
                success: false,
                error: errorMessage,
            };
        }
    }, [syncOfflineDataMutation, dispatch, offlineData]);

    return {
        // State
        todayAttendance,
        currentQRCode,
        qrStatus,
        isCheckedIn,
        lastAction,
        offlineData,
        syncStatus,
        branch, // Add branch data

        // QR methods
        generateQRCode,
        getQRStatus,
        qrCheckIn,
        qrCheckOut,

        // Regular methods
        checkIn,
        checkOut,
        getTodayAttendance,

        // Offline sync
        syncOfflineData,

        // Loading states
        isGeneratingQR,
        isScanningQR,
        isCheckingIn,
        isCheckingOut,
        isSyncing,
        attendanceState,
    };
};

export default useAttendance;
