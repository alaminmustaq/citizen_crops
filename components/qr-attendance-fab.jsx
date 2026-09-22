"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ScanLine } from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/hooks/use-redux";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { translate } from "@/lib/utils";

const QRAttendanceFAB = ({ trans }) => {
  const { user } = useAppSelector((state) => state.auth);
  const isEmployee = !!user?.employee;

  if (!isEmployee) return null;

  return (
    <div className="fixed ltr:right-4 rtl:left-4 bottom-28 z-50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/attendance/qr-attendance">
              <Button
                size="icon"
                className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <ScanLine className="h-6 w-6" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="left" className="whitespace-nowrap">
            <TooltipArrow className="fill-primary" />
            <p>{translate("QR Attendance", trans)}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default QRAttendanceFAB;
