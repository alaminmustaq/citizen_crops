"use client";
import { SiteLogo } from "@/components/svg";
import { useSidebar } from "@/store";
import Link from "next/link";
import Image from "next/image";
import { useFetchGeneralSettingsQuery } from "@/domains/settings/services/generalSettingApi";

const SidebarLogo = ({ hovered }) => {
  const { sidebarType, setCollapsed, collapsed } = useSidebar();

  // Load general settings
  const { data } = useFetchGeneralSettingsQuery();
  const logoUrl = data?.data?.setting?.logo_url; 
  // console.log(d);
  return (
    <div className="px-4 py-4">
      <div className="flex items-center">
        <div className="flex-1">
          <Link href="/dashboard" className="flex items-center gap-x-3">

            {/* If company logo exists -> show image, else show static icon */}
            {logoUrl ? (
              <Image
                src={logoUrl}
                width={40}
                height={40}
                alt="Company Logo"
                className="h-8 w-8 object-contain"
                unoptimized
              />
            ) : (
              <SiteLogo className="text-primary h-8 w-8" />
            )}

            {(!collapsed || hovered) && (
              <div className="flex-1 text-xl text-primary font-semibold">
                {data?.data?.setting?.company_name ?? "Matendes"}
              </div>
            )}
          </Link>
        </div>

        {sidebarType === "classic" && (!collapsed || hovered) && (
          <div className="flex-none lg:block hidden">
            <div
              onClick={() => setCollapsed(!collapsed)}
              className={`h-4 w-4 border-[1.5px] border-default-900 dark:border-border rounded-full transition-all duration-150
                ${
                  collapsed
                    ? ""
                    : "ring-2 ring-inset ring-offset-4 ring-default-900 bg-default-900 dark:ring-offset-default-300"
                }
              `}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarLogo;
