"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Phone, Location, Calender, CalenderCheck, Mail } from "@/components/svg";
import { useAppSelector } from "@/hooks/use-redux";
import { format, parseISO } from "date-fns";

const UserInfo = () => {
  const { profile } = useAppSelector((state) => state.profileData);

  if (!profile?.user) {
    return <Card><CardContent className="p-4">No user info found</CardContent></Card>;
  }

  const { user } = profile;
  const employee = user.employee ?? null;
  const company = user.company ?? null;
  const role = user.roles?.[0] ?? null;

  const isEmployee = Boolean(employee);

  const fullName = isEmployee
    ? `${employee.first_name || ""} ${employee.last_name || ""}`.trim()
    : company?.name || "N/A";

  const workEmail = isEmployee ? employee.work_email || "N/A" : company?.email || "N/A";
  const mobile = isEmployee ? employee.primary_phone || "N/A" : company?.phone || "N/A";

  const branchName = employee?.branch?.name || "N/A";
  const departmentName = employee?.department?.name || "N/A";
  const jobPositionName = employee?.job_position?.title || employee?.job_position?.name || "N/A";
  const roleName = role?.display_name || role?.name || "N/A";

  const employeeCode = employee?.employee_code || "N/A";
  const employmentType = employee?.employment_type || "N/A";
  const workMode = employee?.work_mode || "N/A";
  const salaryType = employee?.salary_type || "N/A";

  const joiningDate = employee?.hire_date
    ? format(parseISO(employee.hire_date), "dd MMM yyyy")
    : "N/A";

  const probationEndDate = employee?.probation_end_date
    ? format(parseISO(employee.probation_end_date), "dd MMM yyyy")
    : "N/A";

  const companyCreatedDate = company?.created_at
    ? format(parseISO(company?.created_at), "dd MMM yyyy")
    : "N/A"; 

  const userInfo = isEmployee ? [
    { icon: User, label: "Full Name", value: fullName },
    { icon: Mail, label: "Work Email", value: workEmail },
    { icon: Phone, label: "Mobile", value: mobile },
    { icon: User, label: "Role", value: roleName },
    { icon: User, label: "Job Position", value: jobPositionName },
    { icon: Location, label: "Department", value: departmentName },
    { icon: Location, label: "Branch", value: branchName },
    { icon: User, label: "Employee Code", value: employeeCode },
    { icon: User, label: "Employment Type", value: employmentType },
    { icon: User, label: "Work Mode", value: workMode },
    { icon: User, label: "Salary Type", value: salaryType },
    { icon: CalenderCheck, label: "Joining Date", value: joiningDate },
    { icon: Calender, label: "Probation End Date", value: probationEndDate },
  ] : [
    { icon: User, label: "Company Name", value: fullName },
    { icon: Mail, label: "Company Email", value: workEmail },
    { icon: Phone, label: "Phone", value: mobile },
    { icon: CalenderCheck, label: "Registered On", value: companyCreatedDate },
  ];

  return (
    <Card>
      <CardHeader className="border-none mb-0">
        <CardTitle className="text-lg font-medium text-default-800">Information</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <ul className="space-y-4">
          {userInfo.map((item, index) => (
            <li key={index} className="flex items-center">
              <div className="flex-none 2xl:w-56 flex items-center gap-1.5">
                <item.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-default-800">{item.label}:</span>
              </div>
              <div className="flex-1 text-sm text-default-700">{item.value}</div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
