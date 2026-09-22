"use client";

import { Button } from "@/components/ui/button";

const ReportActions = ({
  form,
  onAction,
  onReset,
  showFilter = true,
  showClear = true,
  showPdf = true,
  showExcel = true,
  showPrint = true,
  extraActions = null,
}) => {
  return (
    <div className="flex flex-wrap gap-3 mt-4 items-center">
      {/* Filter & Clear */}
      {(showFilter || showClear) && (
        <div className="flex gap-2">
          {showFilter && (
            <Button
              onClick={form.handleSubmit(() => onAction("filter"))}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Filter
            </Button>
          )}

          {showClear && (
            <Button variant="outline" onClick={onReset}>
              Clear
            </Button>
          )}
        </div>
      )}

      {/* Export & Print */}
      {(showPdf || showExcel || showPrint || extraActions) && (
        <div className="flex gap-2 ml-auto">
          {showPdf && (
            <Button
              onClick={() => onAction("pdf")}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              PDF
            </Button>
          )}

          {showExcel && (
            <Button
              onClick={() => onAction("excel")}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Excel
            </Button>
          )}

          {/* {showPrint && (
            <Button variant="outline" onClick={() => onAction("print")}>
              Print
            </Button>
          )} */}

          {extraActions}
        </div>
      )}
    </div>
  );
};

export default ReportActions;
