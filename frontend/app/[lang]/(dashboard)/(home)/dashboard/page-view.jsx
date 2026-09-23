"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReportsSnapshot from "./components/reports-snapshot";
import CountryMap from "./components/country-map";
import UserDeviceReport from "./components/user-device-report";
import UserStats from "./components/user-stats-chart";
import UsersStat from "./components/users-stat";
import ReportsArea from "./components/reports-area";
import DashboardSelect from "@/components/dasboard-select";
import TopTen from "./components/top-ten";
import TopPage from "./components/top-page";
import DatePickerWithRange from "@/components/date-picker-with-range";
import { useDashboard } from "@/domains/dashboard/hook/useDashboard";
import { permissionChecker } from "@/utility/helpers";
import { useSelector } from "react-redux";
import { useAppSelector } from "@/hooks/use-redux";
import { translate } from "@/lib/utils";

const DashboardPageView = ({ trans }) => {
    const { dashboardData } = useSelector((state) => state.dashboard);
    const translation_state = useSelector((state) => state.auth.translation);
    const { user } = useAppSelector((state) => state.auth); 
    console.log(user);
    
    const employee = user?.employee ?? null;

    const companyName = user?.company?.name || "—";
    const branchName = employee?.branch?.name || "—";

    const { data } = useDashboard();
    return (
        <div className="space-y-6">
            <div className="flex items-center flex-wrap justify-between gap-4">
                <div className="text-2xl font-medium text-default-800">
                    {/* Company | Branch */}
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-lg font-semibold">
                            {companyName}
                        </span>
                        <span className="text-default-400">|</span>
                        <span className="text-sm text-default-600">
                            {branchName}
                        </span>
                    </div>

                    {/* Analytics Title */}
                    <div>
                        {translate("Analytics", translation_state)}{" "}
                        {trans?.dashboard}
                    </div>
                </div>
            </div>

            {/* Coming soon placeholder */}
            {/* <div className="flex flex-col items-center justify-center py-20 border border-dashed border-default-300 rounded-2xl bg-default-50">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2027/2027710.png"
          alt="Coming Soon"
          className="w-16 h-16 mb-3"
        />
        <h2 className="text-xl font-semibold text-default-800">Coming Soon</h2>
        <p className="text-default-600 mt-2 text-center max-w-md">
          We’re working on bringing you advanced HRM insights and employee reports. 
          Stay tuned for upcoming updates.
        </p>
      </div> */}

            {/* reports area */}
            <div className="grid grid-cols-12  gap-6 ">
                {permissionChecker("workforce-overview") && (
                    <div className="col-span-12 lg:col-span-8">
                        <ReportsSnapshot />
                    </div>
                )}
                {permissionChecker("tool-distribution") && (
                    <div className="col-span-12 lg:col-span-4">
                        <UsersStat />
                    </div>
                )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {permissionChecker("dashboard-stats") && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ReportsArea />
                    </div>
                )}
                {permissionChecker("pie-chart-1") && (
                    <Card>
                        <CardHeader className="border-none p-6 pt-5 mb-0">
                            <CardTitle className="text-lg font-semibold text-default-900 p-0">
                                {translate(
                                    dashboardData?.pieChartOneTitle,
                                    translation_state
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <UserStats />
                        </CardContent>
                    </Card>
                )}
                {permissionChecker("pie-chart-2") && (
                    <Card>
                        <CardHeader className="border-none p-6 pt-5 mb-0">
                            <CardTitle className="text-lg font-semibold text-default-900 p-0">
                                {translate(
                                    dashboardData?.pieChartTwoTitle,
                                    translation_state
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="dashtail-legend">
                                <UserDeviceReport />
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
            {/* <div className="col-span-2">
        <Card>
          <CardHeader className="border-none pb-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex-1 text-xl font-semibold text-default-900 whitespace-nowrap">
                User By Country
              </div>
              <div className="flex-none">
                <DashboardSelect />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-0">
            <CountryMap />
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4">
          <TopTen />
        </div>
        <div className="col-span-12 lg:col-span-8">
          <Card>
            <CardHeader className="border-none pb-0">
              <CardTitle className="pt-2.5">Top Page/Post</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <TopPage />
            </CardContent>
          </Card>
        </div>
      </div> */}
        </div>
    );
};

export default DashboardPageView;
