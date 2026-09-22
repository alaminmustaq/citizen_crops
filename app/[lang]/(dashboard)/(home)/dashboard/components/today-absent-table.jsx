"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useGetTodayAbsentQuery } from "@/domains/attendance/services/attendanceApi";
import { translate } from "@/lib/utils";
import { useSelector } from "react-redux";

const TodayAbsentTable = () => {
    const translation_state = useSelector((state) => state.auth.translation);
    const { data, isFetching } = useGetTodayAbsentQuery(undefined, {
        pollingInterval: 60000,
    });
    const absentEmployees = data?.data?.absent_employees || [];

    return (
        <Card>
            <CardContent className="p-0">
                <div className="px-5 pb-2 pt-5">
                    <div className="text-base font-semibold text-default-900">
                        {translate("Today Absent", translation_state)}
                    </div>
                </div>
                <div className="px-5 pb-5 pt-0">
                    <div className="max-h-72 overflow-y-auto rounded-md border border-default-200 md:max-h-56">
                        <div className="divide-y divide-default-100 md:hidden">
                            {isFetching && absentEmployees.length === 0 ? (
                                <div className="px-3 py-6 text-center text-xs text-default-500">
                                    {translate("Loading", translation_state)}
                                    ...
                                </div>
                            ) : absentEmployees.length === 0 ? (
                                <div className="px-3 py-6 text-center text-xs text-default-500">
                                    {translate(
                                        "No absent employees today",
                                        translation_state,
                                    )}
                                </div>
                            ) : (
                                absentEmployees.map((employee) => (
                                    <div key={employee.id} className="p-3 text-xs">
                                        <div className="mb-2 min-w-0">
                                            <div className="truncate font-medium text-default-900">
                                                {employee.name || "-"}
                                            </div>
                                            <div className="truncate text-[11px] text-default-500">
                                                {employee.employee_code || "-"}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[11px]">
                                            <div>
                                                <div className="text-default-500">
                                                    {translate(
                                                        "Department",
                                                        translation_state,
                                                    )}
                                                </div>
                                                <div className="truncate font-medium text-default-700">
                                                    {employee.department || "-"}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-default-500">
                                                    {translate(
                                                        "Branch",
                                                        translation_state,
                                                    )}
                                                </div>
                                                <div className="truncate font-medium text-default-700">
                                                    {employee.branch || "-"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="hidden overflow-x-auto md:block">
                        <table className="min-w-[560px] w-full table-fixed text-left text-xs">
                            <thead className="sticky top-0 bg-default-50 text-default-600">
                                <tr>
                                    <th className="w-[34%] px-3 py-2 font-medium">
                                        {translate(
                                            "Employee",
                                            translation_state,
                                        )}
                                    </th>
                                    <th className="w-[22%] px-3 py-2 font-medium">
                                        {translate("Code", translation_state)}
                                    </th>
                                    <th className="w-[22%] px-3 py-2 font-medium">
                                        {translate(
                                            "Department",
                                            translation_state,
                                        )}
                                    </th>
                                    <th className="w-[22%] px-3 py-2 font-medium">
                                        {translate("Branch", translation_state)}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-default-100">
                                {isFetching && absentEmployees.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-3 py-6 text-center text-default-500"
                                        >
                                            {translate(
                                                "Loading",
                                                translation_state,
                                            )}
                                            ...
                                        </td>
                                    </tr>
                                ) : absentEmployees.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-3 py-6 text-center text-default-500"
                                        >
                                            {translate(
                                                "No absent employees today",
                                                translation_state,
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    absentEmployees.map((employee) => (
                                        <tr
                                            key={employee.id}
                                            className="text-default-700"
                                        >
                                            <td className="truncate px-3 py-2 align-middle font-medium text-default-900">
                                                {employee.name || "-"}
                                            </td>
                                            <td className="truncate px-3 py-2 align-middle">
                                                {employee.employee_code || "-"}
                                            </td>
                                            <td className="truncate px-3 py-2 align-middle">
                                                {employee.department || "-"}
                                            </td>
                                            <td className="truncate px-3 py-2 align-middle">
                                                {employee.branch || "-"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TodayAbsentTable;
