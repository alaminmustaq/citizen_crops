"use client"
import React from "react" 
import Header from "./components/header"; 
const ProfileLayout = ({ children }) => { 

  return (
    <React.Fragment>
      <Header />
      {children}
    </React.Fragment>
  );

};

export default ProfileLayout;