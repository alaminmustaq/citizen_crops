"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Building2, ClipBoard, Calendar, CalenderCheck, ChartBar, Flag } from "@/components/svg"; 
import { useProject } from "@/domains/project/hook/useProject";
import { useAppSelector } from "@/hooks/use-redux";

const ProjectInfo = () => {
  const projectData = useAppSelector((state) => state.project.projectData);
  let project = projectData.project;

  // Optionally, load projects on mount
  // React.useEffect(() => {
  //   actions.getProject();
  // }, []);

  if (!project) {
    return (
      <Card>
        <CardContent className="p-4">No project info found</CardContent>
      </Card>
    );
  }

  const projectInfo = [
    { icon: ClipBoard, label: "Project Name", value: project?.name || "N/A" },
    { icon: Flag, label: "Status", value: project?.status || "N/A" },
    {
      icon: ChartBar,
      label: "Assigned",
      value:
        (project?.assigned_employees && project.assigned_employees.length) ||
        (project?.employees && project.employees.length) ||
        0,
    },
    { icon: ChartBar, label: "Budget", value: project?.budget || "€0.00" },
    { icon: Calendar, label: "Start Date", value: project?.start_date || "N/A" },
    { icon: CalenderCheck, label: "End Date", value: project?.end_date || "N/A" },
    { icon: Building2, label: "Client", value: project?.client?.name || "N/A" },
//  {
//   icon: User,
//   label: "Responsible",
//   value:
//     project?.assigned_employees?.length
//       ? project.assigned_employees.map((e) => e.name).join(", ")
//       : project?.employees?.length
//       ? project.employees
//           .map(
//             (e) =>
//               `${e.first_name || ""} ${e.last_name || ""}`.trim()
//           )
//           .filter(Boolean)
//           .join(", ")
//       : "N/A",
// },

    { icon: ChartBar, label: "Balance", value: project?.balance || "€0.00" },
  ];


  return (
    <Card className="w-full">
      <CardHeader className="border-none mb-0">
        <CardTitle className="text-lg font-semibold text-default-800 tracking-tight">
          Project Details
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <p className="text-sm text-default-600 leading-relaxed mb-6">
          Overview of the project status, client information, financial summary, and schedule.
        </p>

        {/* Two-column grid layout */}
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
          {projectInfo.map((item, index) => (
            <div
              key={`project-info-${index}`}
              className="flex items-start gap-2 border-b border-default-200/40 pb-3"
            >
              <div className="flex items-center gap-2 min-w-[140px]">
                <item.icon className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm font-medium text-default-800">{item.label}:</span>
              </div>
              <div className="text-sm text-default-700">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-base font-semibold text-default-800 mb-4">Notes</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-default-50/60 rounded-xl p-4 border border-default-100">
              <p className="text-sm font-medium text-default-800 mb-1">Description</p>
              <p className="text-sm text-default-700 leading-relaxed">{project?.description || "No description"}</p>
            </div>
            <div className="bg-default-50/60 rounded-xl p-4 border border-default-100">
              <p className="text-sm font-medium text-default-800 mb-1">Observations</p>
              <p className="text-sm text-default-700 leading-relaxed">{project?.observation || "No observations"}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectInfo;
