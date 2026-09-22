"use client";

import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Card, CardContent } from "@/components/ui/card";
import { useProfile } from "@/domains/profile/hook/useProfile"; // adjust path if needed
import { useFormContext  } from "../profile-layout";

const PersonalDetails = () => {

    const {form,actions,isFetching} = useFormContext();  
    const { register, handleSubmit, reset } = form;
    // Reset form whenever profile is loaded/updated
    useEffect(() => {
        actions.getProfile();
    }, []);

    useEffect(() => {
        if (actions.form) {
            const { profile } = actions; // make sure actions has profile data
            if (profile?.user?.employee) {
                actions.onEditProfile(profile);
            }
        }
    }, [actions, actions.form, actions.profile]); // reset form when profile changes
 

    return (
        <Card className="rounded-t-none pt-6">
            <CardContent>
                <form
                 onSubmit={handleSubmit(actions.onSubmit)}
                    className="grid grid-cols-12 md:gap-x-12 gap-y-5"
                >
                    {/* First Name */}
                    <div className="col-span-12 md:col-span-6">
                        <Label className="mb-2">First Name</Label>
                        <Input {...register("first_name")} />
                    </div>

                    {/* Last Name */}
                    <div className="col-span-12 md:col-span-6">
                        <Label className="mb-2">Last Name</Label>
                        <Input {...register("last_name")} />
                    </div>

                    {/* Phone Number */}
                    <div className="col-span-12 md:col-span-6">
                        <Label className="mb-2">Phone Number</Label>
                        <Input type="text" {...register("phone")} />
                    </div>

                    {/* Email Address */}
                    <div className="col-span-12 md:col-span-6">
                        <Label className="mb-2">Email Address</Label>
                        <Input {...register("email")} />
                    </div>

                    {/* About / Bio */}
                    <div className="col-span-12">
                        <Label className="mb-2">About</Label>
                        <Textarea {...register("bio")} />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 mt-6 col-span-12">
                        <Button type="button" color="secondary" onClick={() => reset()}>
                            Cancel
                        </Button>
                        <Button
                        
                        onClick={()=>{
                           actions.onSubmit();
                        }}
                        
                        type="submit" disabled={isFetching}>
                            <Icon
                                icon="heroicons:document"
                                className="w-5 h-5 text-primary-foreground me-1"
                            />
                            Save
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default PersonalDetails;
