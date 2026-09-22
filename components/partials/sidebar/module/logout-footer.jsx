"use client"; 
import { Icon } from "@iconify/react";
import { useAppSelector } from "@/hooks/use-redux";
const LogoutFooter = ({ menus }) => {
  const { user } = useAppSelector(
      (state) => state.auth
  );


  return (
    <>
      <div className=" bg-default-50 dark:bg-default-200 items-center flex gap-3  px-4 py-2 mt-5">
        <div className="flex-1">
        <div className="text-default-700 font-semibold text-sm capitalize mb-0.5 truncate">
          {
              user?.user?.name 
              || (user?.employee?.first_name || user?.employee?.last_name 
                      ? `${user.employee.first_name ?? ""} ${user.employee.last_name ?? ""}`.trim()
                      : null)
              || user?.company?.name
              || "Unknown"
          }
        </div>
        <div className="text-xs text-default-600 truncate">
          {user?.user?.email || "Not provided"}
        </div>

        </div>
        <div className=" flex-none">
          <button
            type="button"
            onClick={() => {
              document.cookie = "auth-token=; path=/; max-age=0";
              window.location.assign("/");
            }}
            className="  text-default-500 inline-flex h-9 w-9 rounded items-center  dark:bg-default-300 justify-center dark:text-default-900 cursor-pointer"
          >
            <Icon
              icon="heroicons:arrow-right-start-on-rectangle-20-solid"
              className=" h-5 w-5"
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default LogoutFooter;
