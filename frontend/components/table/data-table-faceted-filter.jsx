import * as React from "react";
import { Check, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

export function DataTableFacetedFilter({
    index,
    searchKey,
    title,
    options,
    facets,
    multiple = true,
    addServerFilter,
    refetch,
}) {
    const [selectedValues, setSelectedValues] = React.useState(new Set());

    const handleSelect = (value) => {
        setSelectedValues((prev) => {
            let newValues = new Set(prev);

            if (multiple) {
                if (value === "") {
                    // "All" clicked
                    if (newValues.size === options.length) {
                        // Already all selected, deselect all
                        newValues.clear();
                        addServerFilter(searchKey, "");
                    } else {
                        // Select all options
                        options.forEach((o) => newValues.add(o.value));
                        addServerFilter(
                            searchKey,
                            Array.from(newValues).join(",")
                        );
                    }
                    refetch();
                    return newValues;
                }

                // Toggle single option
                if (newValues.has(value)) {
                    newValues.delete(value);
                } else {
                    newValues.add(value);
                }

                newValues.delete(""); // remove "All" placeholder if present
                addServerFilter(searchKey, Array.from(newValues).join(","));
                refetch();
                return newValues;
            } else {
                // Single-select logic
                if (newValues.has(value)) {
                    addServerFilter(searchKey, "");
                    refetch();
                    return new Set();
                } else {
                    addServerFilter(searchKey, value);
                    refetch();
                    return new Set([value]);
                }
            }
        });
    };

    const clearFilters = () => setSelectedValues(new Set());

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                    <PlusCircle className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
                    {title}

                    {selectedValues.size > 0 && (
                        <>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <Badge className="rounded-sm px-1 font-normal lg:hidden">
                                {selectedValues.size}
                            </Badge>

                            <div className="hidden space-x-1 rtl:space-x-reverse lg:flex">
                                {selectedValues.size > 2 ? (
                                    <Badge className="rounded-sm px-1 font-normal">
                                        {selectedValues.size} selected
                                    </Badge>
                                ) : (
                                    options
                                        .filter((o) => selectedValues.has(o.value))
                                        .map((o) => (
                                            <Badge key={o.value} className="rounded-sm px-1 font-normal">
                                                {o.label}
                                            </Badge>
                                        ))
                                )}
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[220px] p-0" align="start">
                <Command>
                    <CommandInput placeholder={`Search ${title}...`} />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {/* Only show "All" if multiple is true */}
                            {multiple && (
                                <CommandItem
                                    onSelect={() => handleSelect("")}
                                    className="flex items-center gap-2"
                                >
                                    <div
                                        className={cn(
                                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                            selectedValues.size === 0 ||
                                            selectedValues.size === options.length
                                                ? "bg-primary text-primary-foreground"
                                                : "opacity-50 [&_svg]:invisible"
                                        )}
                                    >
                                        <Check className="h-4 w-4" />
                                    </div>
                                    <span>All</span>
                                </CommandItem>
                            )}

                            {options.map((option) => {
                                const isSelected = selectedValues.has(option.value);
                                const facetCount = facets?.get(option.value) ?? 0;

                                return (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => handleSelect(option.value)}
                                        className="flex items-center gap-2"
                                    >
                                        <div
                                            className={cn(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                isSelected
                                                    ? "bg-primary text-primary-foreground"
                                                    : "opacity-50 [&_svg]:invisible"
                                            )}
                                        >
                                            <Check className="h-4 w-4" />
                                        </div>
                                        {option.icon && (
                                            <option.icon className="h-4 w-4 text-muted-foreground" />
                                        )}
                                        <span>{option.label}</span>
                                        {facetCount > 0 && (
                                            <span className="ml-auto flex h-4 w-6 items-center justify-center text-xs text-muted-foreground">
                                                {facetCount}
                                            </span>
                                        )}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>

                        {selectedValues.size > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem onSelect={clearFilters} className="justify-center text-center">
                                        Clear filters
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

