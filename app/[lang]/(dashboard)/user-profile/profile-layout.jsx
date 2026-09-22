"use client";
import React, { createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import Header from "./components/header";
import SettingsHeader from "./components/settings-header";
import { useProfile } from "@/domains/profile/hook/useProfile";

// Create context
export const FormContext = createContext(null);
export const useFormContext = () => useContext(FormContext);

const ProfileLayout = ({ children }) => {
  const { form, actions, isFetching } = useProfile();
  const location = usePathname();

  const providerValue = { form, actions, isFetching }; // ✅ object

  if (location === "/user-profile/settings") {
    return (
      <FormContext.Provider value={providerValue}>
        <SettingsHeader />
        <div className="mt-6">{children}</div>
      </FormContext.Provider>
    );
  }

  return (
    <FormContext.Provider value={providerValue}>
      <Header />
      {children}
    </FormContext.Provider>
  );
};

export default ProfileLayout;
