"use client"
import React from "react" 
import Header from "./components/header"; 
import { useProject } from "@/domains/project/hook/useProject";
const ProfileLayout = ({ children }) => { 
  const { actions, projectState } = useProject();
  return (
    <React.Fragment>
      <Header />
      {children}
    </React.Fragment>
  );

};

export default ProfileLayout;