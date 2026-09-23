"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpdatePasswordMutation } from "@/domains/profile/services/profileApi"; // adjust path

const ChangePassword = () => {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const [currentPasswordType, setCurrentPasswordType] = useState("password");
  const [newPasswordType, setNewPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");

  const onSubmit = async (data) => {
    try {
      await updatePassword(data).unwrap();
      alert("Password updated successfully!");
      reset();
    } catch (err) {
      alert(err?.data?.message || "Failed to update password.");
    }
  };

  return (
    <Card className="rounded-t-none pt-6">
      <CardContent>
        <form className="grid grid-cols-12 gap-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Current Password */}
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="current_password">Current Password</Label>
            <div className="relative">
              <Input
                id="current_password"
                type={currentPasswordType}
                {...register("current_password", { required: "Current password is required" })}
              />
              <Eye
                className={cn("absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 cursor-pointer", currentPasswordType === "text" && "hidden")}
                onClick={() => setCurrentPasswordType("text")}
              />
              <EyeOff
                className={cn("absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 cursor-pointer", currentPasswordType === "password" && "hidden")}
                onClick={() => setCurrentPasswordType("password")}
              />
            </div>
            {errors.current_password && <p className="text-red-500 text-xs mt-1">{errors.current_password.message}</p>}
          </div>

          {/* New Password */}
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="new_password">New Password</Label>
            <div className="relative">
              <Input
                id="new_password"
                type={newPasswordType}
                {...register("new_password", { required: "New password is required", minLength: { value: 8, message: "Minimum 8 characters" } })}
              />
              <Eye
                className={cn("absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 cursor-pointer", newPasswordType === "text" && "hidden")}
                onClick={() => setNewPasswordType("text")}
              />
              <EyeOff
                className={cn("absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 cursor-pointer", newPasswordType === "password" && "hidden")}
                onClick={() => setNewPasswordType("password")}
              />
            </div>
            {errors.new_password && <p className="text-red-500 text-xs mt-1">{errors.new_password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="new_password_confirmation">Confirm Password</Label>
            <div className="relative">
              <Input
                id="new_password_confirmation"
                type={confirmPasswordType}
                {...register("new_password_confirmation", {
                  required: "Confirm password is required",
                  validate: value => value === watch("new_password") || "Passwords do not match"
                })}
              />
              <Eye
                className={cn("absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 cursor-pointer", confirmPasswordType === "text" && "hidden")}
                onClick={() => setConfirmPasswordType("text")}
              />
              <EyeOff
                className={cn("absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 cursor-pointer", confirmPasswordType === "password" && "hidden")}
                onClick={() => setConfirmPasswordType("password")}
              />
            </div>
            {errors.new_password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.new_password_confirmation.message}</p>}
          </div>

          {/* Buttons */}
          <div className="col-span-12 flex justify-end gap-4 mt-6">
            <Button type="button" color="secondary" onClick={() => reset()}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              <Icon icon="heroicons:lock-closed" className="w-5 h-5 me-1" /> Change Password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangePassword;
