"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Mail,
  Building2,
  Phone,
  Calendar,
  ChartBar,
  Flag,
  ClipBoard,
  Location,
  Note,
} from "@/components/svg";
import { useAppSelector } from "@/hooks/use-redux";

const EmployeeInfo = () => {
  //  Get employee
  const employData = useAppSelector((state) => state.employ.employData);
  let employee = employData.employee;

  if (!employee) {
    return (
      <Card>
        <CardContent className="p-4">No employee info found</CardContent>
      </Card>
    );
  }

  const {
    personal_info,
    contact_info,
    employment_info,
    emergency_contact,
    education,
    professional_info,
    branch,
    department,
    job_position,
    company,
  } = employee;

  const employeeInfo = [
    {
      icon: User,
      label: "Employee Name",
      value:
        personal_info?.display_name ||
        `${personal_info?.first_name ?? ""} ${personal_info?.last_name ?? ""}`,
    },
    { icon: Mail, label: "Email", value: contact_info?.work_email ?? "N/A" },
    { icon: ClipBoard, label: "Employee Code", value: employee?.employee_code ?? "N/A" },
    { icon: Building2, label: "Branch", value: branch?.name ?? "N/A" },
    { icon: Flag, label: "Department", value: department?.name ?? "N/A" },
    { icon: Flag, label: "Job Position", value: job_position?.title ?? "N/A" },
    { icon: Building2, label: "Company", value: company?.name ?? "N/A" },
    { icon: Calendar, label: "Hire Date", value: employment_info?.hire_date ?? "N/A" },
    { icon: Calendar, label: "Start Date", value: employment_info?.start_date ?? "N/A" },
    { icon: ChartBar, label: "Employment Status", value: employment_info?.employment_status ?? "N/A" },
    { icon: ChartBar, label: "Employment Type", value: employment_info?.employment_type ?? "N/A" },
    { icon: ChartBar, label: "Work Mode", value: employment_info?.work_mode ?? "N/A" },
    { icon: ChartBar, label: "Basic Salary", value: employment_info?.basic_salary ?? "N/A" },
    { icon: Phone, label: "Primary Phone", value: contact_info?.primary_phone ?? "N/A" },
    { icon: Phone, label: "Secondary Phone", value: contact_info?.secondary_phone ?? "N/A" },
    {
      icon: Phone,
      label: "Emergency Contact",
      value: emergency_contact?.name ?? "N/A",
    },
    {
      icon: Phone,
      label: "Emergency Phone",
      value: emergency_contact?.phone ?? "N/A",
    },
    { icon: Location, label: "Nationality", value: personal_info?.nationality ?? "N/A" },
    { icon: ChartBar, label: "Years of Experience", value: professional_info?.years_of_experience ?? "N/A" },
    { icon: Note, label: "Highest Education", value: education?.highest_education ?? "N/A" },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="border-none mb-0">
        <CardTitle className="text-lg font-semibold text-default-800 tracking-tight">
          Employee Details
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <p className="text-sm text-default-600 leading-relaxed mb-6">
          Complete overview of employee information, salary details, and project association.
        </p>

        {/* Two-column grid layout */}
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
          {employeeInfo.map((item, index) => (
            <div
              key={`employee-info-${index}`}
              className="flex items-start gap-2 border-b border-default-200/40 pb-3"
            >
              <div className="flex items-center gap-2 sm:min-w-[220px]">
                <item.icon className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm font-medium text-default-800">
                  {item.label}:
                </span>
              </div>
              <div className="text-sm text-default-700">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-base font-semibold text-default-800 mb-4">
            Notes
          </h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-default-50/60 rounded-xl p-4 border border-default-100">
              <p className="text-sm font-medium text-default-800 mb-1">
                Bio
              </p>
              <p className="text-sm text-default-700 leading-relaxed">
                {employee.system_info?.bio ||
                  "No biography provided for this employee."}
              </p>
            </div>
            <div className="bg-default-50/60 rounded-xl p-4 border border-default-100">
              <p className="text-sm font-medium text-default-800 mb-1">
                Observations
              </p>
              <p className="text-sm text-default-700 leading-relaxed">
                {employee.statistics?.has_onboarding_in_progress
                  ? "Onboarding in progress."
                  : "No current onboarding process."}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeInfo;
