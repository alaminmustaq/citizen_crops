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
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link"; 
import shortImage from "@/public/images/all-img/short-image-2.png";
import { useAppSelector } from "@/hooks/use-redux";

import { useNotification } from "@/domains/notification/hook/useNotification";
import { useState } from "react";
import { useSelector } from "react-redux";
import { translate } from "@/lib/utils";
const NotificationMessage = () => {
  const {notificationData} = useAppSelector((state)=> state.auth);
  const translation_state = useSelector((state) => state.auth.translation);
  const count = notificationData?.count;

  const [counts, setCount] = useState(count);
  const notifications = notificationData?.notifications;

  const { actions } = useNotification();

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
          <Bell className="h-5 w-5 " />
          {console.log(notifications)}
          {counts && <Badge className=" w-4 h-4 p-0 text-xs  font-medium  items-center justify-center absolute left-[calc(100%-18px)] bottom-[calc(100%-16px)] ring-2 ring-primary-foreground">
            {counts}
          </Badge>
          }
          
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className=" z-999 mx-4 lg:w-[412px] p-0"
      >
        <DropdownMenuLabel
          style={{ backgroundImage: `url(${shortImage.src})` }}
          className="w-full h-full bg-cover bg-no-repeat p-4 flex items-center"
        >
          <span className="text-base font-semibold text-white flex-1">
               {translate("Notification", translation_state)}
          
          </span>
          <span
            onClick={()=>actions.markAllAsRead(setCount)}
            className="text-xs font-medium text-white cursor-pointer hover:underline hover:decoration-default-100 dark:decoration-default-900"
          >
            Mark all as read
          </span>
        </DropdownMenuLabel>
        <div className="h-[300px] xl:h-[350px]">
          <ScrollArea className="h-full">
            {notifications && notifications.map((item, index) => {
              const isDocument = item.type === "document";
              const expiryDate = isDocument ? item.expiry_date : item.end_date;
              
              return (
                <DropdownMenuItem
                  key={`notification-${index}`}
                  className="flex gap-4 py-2 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-background rounded"
                >
                  <div className="flex-1 flex items-center gap-3">
                    {/* Icon or Avatar */}
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white text-sm font-bold">
                      {isDocument ? "D" : "P"}
                    </div>

                    {/* Notification text */}
                    <div className="flex flex-col">
                      <div className="text-sm font-semibold text-default-900 truncate max-w-[200px]">
                        {item.title}
                      </div>
                      <div className="text-xs text-default-600 truncate max-w-[200px]">
                        {item.message}
                      </div>
                      <div className="text-xs text-default-500 mt-0.5">
                        Expiry Date: {expiryDate} | {item.days_remaining} day(s) remaining
                      </div>
                    </div>
                  </div>

                  {/* Badge for unread */}
                  <div className="flex flex-col items-end justify-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        item.unread ? "bg-primary" : "bg-transparent"
                      }`}
                    ></div>
                  </div>
                </DropdownMenuItem>
              );
            })}
          </ScrollArea>
        </div>

        <DropdownMenuSeparator />
        {/* <div className="m-4 mt-5">
          <Button asChild type="text" className="w-full">
            <Link href="/dashboard">View All</Link>
          </Button>
        </div> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationMessage;
