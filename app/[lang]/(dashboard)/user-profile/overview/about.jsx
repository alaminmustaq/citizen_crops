"use client";

import { UserSign, Phone, Mail2 } from "@/components/svg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { useAppSelector } from "@/hooks/use-redux";

const About = () => {
  const profile = useAppSelector((state) => state.profileData.profile);

  if (!profile?.user) {
    return <Card><CardContent className="p-4">No profile data found</CardContent></Card>;
  }

  const { user } = profile;
  const { employee, company } = user;
  const role = user.roles?.[0] ?? null;

  const bio = employee?.bio || company?.description || "No bio available.";
  const preferences = employee?.preferences || company?.preferences || "No preferences set.";

  const roleName = role?.display_name || role?.name || "N/A";
  const designation = employee?.job_position?.title || employee?.job_position?.name || company?.name || "N/A";

  const aboutItems = [
    { title: "Designation", position: designation, icon: UserSign },
    { title: "Role", position: roleName, icon: UserSign },
    { title: "Phone", position: employee?.primary_phone || company?.phone || "N/A", icon: Phone },
    { title: "Email", position: employee?.work_email || company?.email || "N/A", icon: Mail2 },
  ];

  return (
    <Card>
      <CardHeader className="flex-row justify-between items-center mb-3 border-none">
        <CardTitle className="text-lg font-medium text-default-800">About</CardTitle>
        <Button size="icon" className="w-6 h-6 bg-default-100 dark:bg-default-50 text-default-500 hover:bg-default-100">
          <Icon icon="heroicons:ellipsis-vertical" className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-default-600 mb-3">{bio}</div>
        <div className="text-sm text-default-600 mb-6"><strong>Preferences:</strong> {preferences}</div>

        <div className="flex flex-wrap items-center gap-6 2xl:gap-16">
          {aboutItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="bg-default-100 dark:bg-default-50 text-primary h-10 w-10 grid place-content-center rounded">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-medium text-default-800">{item.title}</div>
                <div className="text-xs font-medium text-default-600">{item.position}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default About;
