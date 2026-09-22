"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useGetActiveBreaksQuery } from "@/domains/attendance/services/attendanceApi";
import { useFetchFeatureSettingsQuery } from "@/domains/settings/services/featureSettingApi";
import { isBreakFeatureEnabled } from "@/lib/menu-features";
import { translate } from "@/lib/utils";
import { useSelector } from "react-redux";

const formatDuration = (minutes) => {
    const safeMinutes = Math.floor(Math.max(0, Number(minutes) || 0));
    const hours = Math.floor(safeMinutes / 60);
    const mins = safeMinutes % 60;

    return `${String(hours).padStart(2, "0")}h ${String(mins).padStart(2, "0")}m`;
};

const formatStartedAt = (value) => {
    if (!value) {
        return "-";
    }

    return new Date(value).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
};

const ActiveBreaksTable = ({ embedded = false }) => {
    const translation_state = useSelector((state) => state.auth.translation);
    const { data: featureSettings } = useFetchFeatureSettingsQuery();
    const breakEnabled = featureSettings
        ? isBreakFeatureEnabled(featureSettings)
        : false;
    const { data, isFetching } = useGetActiveBreaksQuery(undefined, {
        skip: !breakEnabled,
        pollingInterval: 60000,
    });
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        if (!breakEnabled) {
            return undefined;
        }

        const timer = window.setInterval(() => setNow(Date.now()), 60000);
        return () => window.clearInterval(timer);
    }, [breakEnabled]);

    const activeBreaks = useMemo(() => {
        return (data?.data?.active_breaks || []).map((item) => {
            const startedAt = item.started_at
                ? new Date(item.started_at).getTime()
                : null;
            const durationMinutes = startedAt && item.is_active
                ? Math.floor((now - startedAt) / 60000)
                : item.duration_minutes;

            return {
                ...item,
                durationMinutes,
            };
        });
    }, [data, now]);

    if (!breakEnabled) {
        return null;
    }

    const content = (
        <>
            <div className={embedded ? "mb-2" : "px-5 pb-2 pt-5"}>
                <div className="text-base font-semibold text-default-900">
                    {translate("Break Status", translation_state)}
                </div>
            </div>
            <div className={embedded ? "" : "px-5 pb-5 pt-0"}>
                <div className="max-h-72 overflow-y-auto rounded-md border border-default-200 md:max-h-56">
                    <div className="divide-y divide-default-100 md:hidden">
                        {isFetching && activeBreaks.length === 0 ? (
                            <div className="px-3 py-6 text-center text-xs text-default-500">
                                {translate("Loading", translation_state)}
                                ...
                            </div>
                        ) : activeBreaks.length === 0 ? (
                            <div className="px-3 py-6 text-center text-xs text-default-500">
                                {translate(
                                    "No break records for today",
                                    translation_state,
                                )}
                            </div>
                        ) : (
                            activeBreaks.map((item) => (
                                <div key={item.id} className="p-3 text-xs">
                                    <div className="mb-2 flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="truncate font-medium text-default-900">
                                                {item.employee?.name || "-"}
                                            </div>
                                            <div className="truncate text-[11px] text-default-500">
                                                {item.employee?.employee_code ||
                                                    "-"}
                                            </div>
                                        </div>
                                        <div className="shrink-0 font-medium text-default-900">
                                            {formatDuration(
                                                item.durationMinutes,
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[11px]">
                                        <div>
                                            <div className="text-default-500">
                                                {translate(
                                                    "Started",
                                                    translation_state,
                                                )}
                                            </div>
                                            <div className="font-medium text-default-700">
                                                {formatStartedAt(
                                                    item.started_at,
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-default-500">
                                                {translate(
                                                    "Ended",
                                                    translation_state,
                                                )}
                                            </div>
                                            <div className="font-medium text-default-700">
                                                {item.is_active ? (
                                                    <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                                                        {translate(
                                                            "On break",
                                                            translation_state,
                                                        )}
                                                    </span>
                                                ) : (
                                                    formatStartedAt(
                                                        item.ended_at,
                                                    )
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-default-500">
                                                {translate(
                                                    "Reason",
                                                    translation_state,
                                                )}
                                            </div>
                                            <div className="line-clamp-2 break-words font-medium text-default-700">
                                                {item.break_reason || "-"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="hidden md:block">
                    <table className="w-full table-fixed text-left text-xs">
                        <thead className="sticky top-0 bg-default-50 text-default-600">
                            <tr>
                                <th className="w-[30%] px-2 py-2 font-medium">
                                    {translate("Employee", translation_state)}
                                </th>
                                <th className="w-[14%] px-2 py-2 font-medium">
                                    {translate("Started", translation_state)}
                                </th>
                                <th className="w-[16%] px-2 py-2 font-medium">
                                    {translate("Ended", translation_state)}
                                </th>
                                <th className="w-[22%] px-2 py-2 font-medium">
                                    {translate("Reason", translation_state)}
                                </th>
                                <th className="w-[18%] px-2 py-2 text-right font-medium">
                                    {translate("Duration", translation_state)}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-default-100">
                            {isFetching && activeBreaks.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-3 py-6 text-center text-default-500"
                                    >
                                        {translate("Loading", translation_state)}
                                        ...
                                    </td>
                                </tr>
                            ) : activeBreaks.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-3 py-6 text-center text-default-500"
                                    >
                                        {translate(
                                            "No break records for today",
                                            translation_state,
                                        )}
                                    </td>
                                </tr>
                            ) : (
                                activeBreaks.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="text-default-700"
                                    >
                                        <td className="truncate px-2 py-2 align-middle">
                                            <div className="truncate font-medium text-default-900">
                                                {item.employee?.name || "-"}
                                            </div>
                                            <div className="truncate text-[11px] text-default-500">
                                                {item.employee?.employee_code ||
                                                    "-"}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-2 py-2 align-middle">
                                            {formatStartedAt(item.started_at)}
                                        </td>
                                        <td className="whitespace-nowrap px-2 py-2 align-middle">
                                            {item.is_active ? (
                                                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                                                    {translate(
                                                        "On break",
                                                        translation_state,
                                                    )}
                                                </span>
                                            ) : (
                                                formatStartedAt(item.ended_at)
                                            )}
                                        </td>
                                        <td className="truncate px-2 py-2 align-middle">
                                            {item.break_reason || "-"}
                                        </td>
                                        <td className="whitespace-nowrap px-2 py-2 text-right align-middle font-medium">
                                            {formatDuration(
                                                item.durationMinutes,
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        </>
    );

    if (embedded) {
        return (
            <div className="mt-4 border-t border-default-100 pt-4">
                {content}
            </div>
        );
    }

    return (
        <Card>
            <CardContent className="p-0">{content}</CardContent>
        </Card>
    );
};

export default ActiveBreaksTable;
