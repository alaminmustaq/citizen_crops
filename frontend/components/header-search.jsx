"use client";
import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { menusConfig } from "@/config/menus";
import Link from "next/link";
import { useAppSelector } from "@/hooks/use-redux"; // <-- for user state (permissions)

const HeaderSearch = ({ open, setOpen }) => {
  const { user } = useAppSelector((state) => state.auth);

  // filter menu items based on user permissions
  const filterMenusByPermission = (menus) =>
    menus
      .map((menu) => {
        const allowedChildren = (menu.child || []).filter((child) =>
          user?.permissions?.some((p) => p.name === child.permission)
        );

        if (allowedChildren.length > 0) {
          return { ...menu, child: allowedChildren };
        }
        return null;
      })
      .filter(Boolean);

  const menuGroups = filterMenusByPermission(menusConfig.sidebarNav.modern);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent size="xl" className="p-0 " hiddenCloseIcon>
        <DialogHeader className="hidden">
          <DialogTitle className="hidden"></DialogTitle>
        </DialogHeader>

        <Command>
          {/* Search Input */}
          <div className="flex items-center border-b border-border">
            <CommandInput
              placeholder="Search"
              className="h-14"
              inputWrapper="px-3.5 flex-1 border-none"
            />
            <div className="flex-none flex items-center justify-center gap-1 pr-4">
              <span className="text-sm text-default-500 font-normal select-none">
                [esc]
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-transparent text-xs hover:text-default-800 px-1"
                onClick={() => setOpen(false)}
              >
                <X className="w-5 h-5 text-default-500" />
              </Button>
            </div>
          </div>

          {/* Menu List */}
          <CommandList className="py-5 px-7 max-h-[500px]">
            <CommandEmpty>No results found.</CommandEmpty>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {menuGroups.map((group, groupIndex) => (
                <CommandGroup
                  key={groupIndex}
                  heading={group.title}
                  className="[&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-normal [&_[cmdk-group-heading]]:text-default-400 [&_[cmdk-group-heading]]:mb-2.5 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest"
                >
                  {group.child?.map((item, itemIndex) => (
                    <CommandItem
                      key={itemIndex}
                      className="aria-selected:bg-transparent p-0 mb-2.5"
                    >
                      <Link
                        href={item.href || "#"}
                        className="flex gap-2 items-center px-2 text-default-500 hover:text-primary "
                      >
                        {item.icon && (
                          <item.icon className="w-4 h-4 text-default-500" />
                        )}
                        <span>{item.title}</span>
                      </Link>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </div>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default HeaderSearch;
