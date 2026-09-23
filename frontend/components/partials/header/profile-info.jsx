"use client";
// import { useSession, signOut } from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/hooks/use-redux";
import { useProfile } from "@/domains/profile/hook/useProfile";
import { useSelector } from "react-redux";
import { translate } from "@/lib/utils";

const ProfileInfo = () => {
    const { actions: profileActions } = useProfile();
    const translation_state = useSelector((state) => state.auth.translation);
    const router = useRouter();
    const { user } = useAppSelector((state) => state.auth); 
    
    const session = [];
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className=" cursor-pointer">
                <div className=" flex items-center  ">
                    <img
                        src="https://static.vecteezy.com/system/resources/previews/045/944/199/non_2x/male-default-placeholder-avatar-profile-gray-picture-isolated-on-background-man-silhouette-picture-for-user-profile-in-social-media-forum-chat-greyscale-illustration-vector.jpg"
                        alt="Profile"
                        width={36}
                        height={36}
                        className="rounded-full"
                    />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-0" align="end">
                <DropdownMenuLabel className="flex gap-2 items-center mb-1 p-3">
                    <img
                        src="https://static.vecteezy.com/system/resources/previews/045/944/199/non_2x/male-default-placeholder-avatar-profile-gray-picture-isolated-on-background-man-silhouette-picture-for-user-profile-in-social-media-forum-chat-greyscale-illustration-vector.jpg"
                        alt="Profile"
                        width={36}
                        height={36}
                        className="rounded-full"
                    />
                    {console.log(user)}
                    <div>
                        <div className="text-sm font-medium text-default-800 capitalize ">
                            {
                                user?.user?.name 
                                || (user?.employee?.first_name || user?.employee?.last_name 
                                        ? `${user.employee.first_name ?? ""} ${user.employee.last_name ?? ""}`.trim()
                                        : null)
                                || user?.company?.name
                                || "Unknown"
                            }
                        </div>
                        <Link
                            href="/dashboard"
                            className="text-xs text-default-600 hover:text-primary"
                        >
                            {user?.user?.email || "Not provided"}
                        </Link>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="mb-0 dark:bg-background" />
                <DropdownMenuItem
                    asChild
                    className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize my-1 px-3 dark:hover:bg-background cursor-pointer"
                >
                    <div
                        className="flex items-center w-full gap-2 cursor-pointer"
                        onClick={() => {
                            profileActions.getProfile(); // fetch + store in Redux
                            router.push("/user-profile"); // navigate programmatically
                        }}
                    >
                        <Icon icon="heroicons:user" className="w-4 h-4" />
                        {translate("Profile", translation_state)}
                    </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => {
                        document.cookie = "auth-token=; path=/; max-age=0";
                        window.location.assign("/");
                    }}
                    className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize my-1 px-3 dark:hover:bg-background cursor-pointer"
                >
                    <Icon icon="heroicons:power" className="w-4 h-4" />
                    {translate("Log out", translation_state)}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
export default ProfileInfo;
