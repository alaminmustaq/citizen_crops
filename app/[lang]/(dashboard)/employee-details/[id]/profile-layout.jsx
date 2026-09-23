"use client"
import React from "react" 
import Header from "./components/header"; 
import { useEmploy } from "@/domains/employ/hook/useEmploy";
const ProfileLayout = ({ children }) => { 
  const { actions, employState } = useEmploy();
  return (
    <React.Fragment>
      <Header />
      {children}
    </React.Fragment>
  );

};

export default ProfileLayout;