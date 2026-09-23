import React from "react";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/use-redux";
import { translate } from "@/lib/utils";
import { useSelector } from "react-redux";
/**
 * Reusable dropdown actions component for table rows.
 *
 * @param {Object} props
 * @param {Object} props.data - Row data for current row.
 * @param {Array}  props.items - Action list: [{ label, onClick, danger?, passId? }]
 * @param {string} [props.label="Actions"] - Dropdown label.
 * @param {string} [props.alignmentClass="flex justify-center"] - Tailwind alignment class.
 * @param {Function} [props.onLoginAsCompany] - Optional “Login as Company” callback.
 */
export const TableActions = ({
  data,
  items = [],
  label = "Actions",
  alignmentClass = "flex justify-center",
  onLoginAsCompany, 
}) => {
  const translation_state = useSelector((state) => state.auth.translation);
  const showSrOnlySpan = alignmentClass !== "flex justify-center";
  const { user } = useAppSelector((state) => state.auth);

  const permissionNames = user?.permissions?.map(p => p.name) || [];  
  // console.log(exists);
  return (
    <div className={alignmentClass}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            {showSrOnlySpan && <span className="sr-only">{translate("Open menu",translation_state)}</span>}
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {label && <DropdownMenuLabel>{translate("Actions",translation_state)}</DropdownMenuLabel>}
          <DropdownMenuSeparator />

          {/* Optional fixed item */}
          {onLoginAsCompany && (
            <>
              <DropdownMenuItem onClick={() => onLoginAsCompany(data)}>
                {translate("Login as Company",translation_state)}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Dynamic action items */}
          {items.map((item, i) => (
            permissionNames.includes(item.permission) &&
            <DropdownMenuItem
              key={i}
              onClick={() =>
                item.passId ? item.onClick?.(data.id) : item.onClick?.(data)
              }
              className={
                item.danger
                  ? "text-red-500 focus:text-red-500"
                  : ""
              }
            >
              {translate(item?.label,translation_state)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
