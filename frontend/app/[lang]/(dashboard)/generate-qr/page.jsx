"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import PageLayout from "@/components/page-layout";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
export default function FaceAttendance() {
    const qrRef = useRef(null);

  const handlePrint = useReactToPrint({
      contentRef: qrRef,
      pageStyle: `
      @page {
        margin: 40mm; /* adds page margin (top, right, bottom, left) */
      }
      @media print {
        body {
          padding: 40px; /* adds padding inside printable area */
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    `,
  });


    return (
        <PageLayout>
            <div className="w-full max-w-[30%] mx-auto h-auto">
                {/* QR Code */}
                <div ref={qrRef} className="w-full h-auto max-w-full">
                    <QRCode
                        size={256}
                        className="w-full h-auto max-w-full"
                        value="1"
                        viewBox="0 0 256 256"
                    />
                </div>

                {/* Print Button */}
                <div className="flex justify-center mt-4">
                    
                    <Button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                    >
                        Print QR Code
                    </Button>
                </div>
            </div>
        </PageLayout>
    );
}
