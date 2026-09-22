"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfile } from "@/domains/profile/hook/useProfile";
import { useAppSelector } from "@/hooks/use-redux";
import avatar from "@/public/images/avatar/avatar-3.jpg";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFormContext  } from "../profile-layout";

const UserMeta = () => {
    const { profile } = useAppSelector((state) => state.profileData);

    const {form} = useFormContext();  
    
    const fileUrl = profile?.user?.file_url;

    const [preview, setPreview] = useState(null);

    // when profile loads, set the preview
    useEffect(() => {
        if (fileUrl) {
            setPreview(fileUrl);
        }
    }, [fileUrl]);

    return (
        <Card>
            <CardContent className="p-6 flex flex-col items-center">
                <div className="w-[124px] h-[124px] relative rounded-full">
                    <Image
                        src={preview || "/images/avatar/placeholder.jpg"}
                        width={128}
                        height={128}
                        alt="avatar"
                        className="w-full h-full object-cover rounded-full"
                        unoptimized
                    />

                    <Button
                        asChild
                        size="icon"
                        className="h-8 w-8 rounded-full cursor-pointer absolute bottom-0 right-0"
                    >
                        <Label htmlFor="avatar">
                            <Icon
                                className="w-5 h-5 text-primary-foreground"
                                icon="heroicons:pencil-square"
                            />
                        </Label>
                    </Button>

                    <Input
                        type="file"
                        className="hidden"
                        id="avatar"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                form.setValue("avatar", file); // 👈 save file in form
                                // form.trigger("avatar");
                                setPreview(URL.createObjectURL(file)); // 👈 image preview
                            }
                        }}
                    />
                    {form?.formState?.errors?.avatar && (
                        <span className="text-red-500">
                            {form?.formState?.errors?.avatar?.message}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default UserMeta;
