"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAppSelector } from "@/hooks/use-redux";

const Skills = () => {
  // Get professional_info.skills from Redux
  const skills = useAppSelector(
    (state) => state.profileData.profile?.professional_info?.skills
  );

  return (
    <Card>
      <CardHeader className="flex-row items-center border-none mb-2">
        <CardTitle className="flex-1">Skills</CardTitle>
        {/* <Button
          size="icon"
          className="flex-none bg-default-100 dark:bg-default-50 text-default-500 hover:bg-default-100 rounded h-6 w-6 -mt-1"
        >
          <Plus className="w-4 h-4" />
        </Button> */}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-default-700">
          {skills || "No skills available"}
        </p>
      </CardContent>
    </Card>
  );
};

export default Skills;
