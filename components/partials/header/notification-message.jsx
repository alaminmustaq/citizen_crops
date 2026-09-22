"use client";
import { Bell } from "@/components/svg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import shortImage from "@/public/images/all-img/short-image-2.png";
import { useAppSelector } from "@/hooks/use-redux";

import { useNotification } from "@/domains/notification/hook/useNotification";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { translate } from "@/lib/utils";
import { useRouter, useParams } from "next/navigation";

const NotificationMessage = () => {
    const router = useRouter();
    const params = useParams();
    const lang = params?.lang || "en";
    
    // Safety check for path changes
    const handleClick = () => {
        router.push(`/${lang}/all-notification`);
    };

    const { notificationData, user } = useAppSelector((state) => state.auth);
    const translation_state = useSelector((state) => state.auth.translation);

    // Safely extract from Object OR Array structures due to backend variations
    const isArray = Array.isArray(notificationData);
    const rawNotifications = isArray ? notificationData : (notificationData?.notifications || []);
    const rawCount = isArray 
                     ? rawNotifications.filter(n => n.unread !== false && n.unread !== 0 && n.read_at === null).length
                     : (notificationData?.count || 0);

    const [counts, setCount] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const { actions } = useNotification();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setCount(rawCount);
        setNotifications(rawNotifications);
    }, [rawCount, rawNotifications]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative md:h-9 md:w-9 h-8 w-8 hover:bg-default-100 dark:hover:bg-default-200 
          data-[state=open]:bg-default-100  dark:data-[state=open]:bg-default-200 
           hover:text-primary text-default-500 dark:text-default-800  rounded-full  "
                >
                    <span className="relative flex items-center justify-center">
                        <Bell className="h-5 w-5 " />
                        {isMounted && counts > 0 && (
                            <Badge className="w-4 h-4 p-0 text-xs font-medium items-center justify-center absolute -top-2 -right-2 ring-2 ring-primary-foreground">
                                {counts}
                            </Badge>
                        )}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="z-[999] mx-4 lg:w-[412px] p-0"
            >
                <DropdownMenuLabel
                    style={{ backgroundImage: `url(${shortImage.src})` }}
                    className="w-full h-full bg-cover bg-no-repeat p-4 flex items-center"
                >
                    <span className="text-base font-semibold text-white flex-1">
                        {translate("Notification", translation_state)}
                    </span>
                    {notifications?.length > 0 && (
                        <span
                            onClick={() => actions.markAllAsRead(setCount)}
                            className="text-xs font-medium text-white cursor-pointer hover:underline hover:decoration-default-100 dark:decoration-default-900"
                        >
                            Mark all as read
                        </span>
                    )}
                </DropdownMenuLabel>
                
                {/* Native Scroll Wrapper instead of Radix ScrollArea to fix React 19 dropdown occlusion bugs */}
                <div className="h-[300px] xl:h-[350px] overflow-y-auto flex flex-col pr-1">
                    {notifications && notifications.length > 0 ? (
                        notifications.map((item, index) => {
                            const isDocument = item.type === "document";
                            const expiryDate = isDocument
                                ? item.expiry_date
                                : item.end_date;

                            return (
                                <DropdownMenuItem
                                    key={`notification-${index}`}
                                    className="flex gap-4 py-3 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-background rounded-none border-b border-default-100 last:border-b-0"
                                >
                                    <div className="flex-1 flex items-center gap-3">
                                        <div className="flex shrink-0 items-center justify-center h-10 w-10 rounded-full bg-primary text-white text-sm font-bold">
                                            {isDocument ? "D" : "P"}
                                        </div>

                                        <div className="flex flex-col">
                                            <div className="text-sm font-semibold text-default-900 truncate max-w-[200px]">
                                                {item.title}
                                            </div>
                                            <div className="text-xs text-default-600 truncate max-w-[200px]">
                                                {item.message}
                                            </div>
                                            <div className="text-xs text-default-500 mt-1 flex items-center gap-1">
                                                <span>Exp: {expiryDate}</span>
                                                <span className="text-[10px] bg-default-100 px-1 rounded text-default-600">{item.days_remaining}d Left</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end justify-center gap-1">
                                        <div
                                            className={`w-2.5 h-2.5 rounded-full ${
                                                item.unread !== false && item.unread !== 0 && item.read_at === null
                                                    ? "bg-primary"
                                                    : "bg-transparent"
                                            }`}
                                        ></div>
                                    </div>
                                </DropdownMenuItem>
                            );
                        })
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-sm text-default-500 min-h-[150px]">
                            {translate("No new notifications", translation_state)}
                        </div>
                    )}
                </div>

                <DropdownMenuSeparator className="m-0" />
                <div className="p-4">
                    <Button
                        type="button"
                        className="w-full font-medium"
                        onClick={handleClick}
                    >
                        View All
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationMessage;
