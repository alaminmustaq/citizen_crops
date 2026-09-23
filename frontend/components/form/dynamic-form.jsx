"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Form } from "@/components/ui/form";
import FieldRenderer from "./field-renderer";
export function DynamicForm({
    form,
    fields,
    onSubmit,
    className,
    submitLabel = "Submit",
    actions,
    gridCols = "grid-cols-12",
}) {
    const fieldDefs =
        typeof fields === "function"
            ? fields()
            : Array.isArray(fields)
            ? fields
            : [];
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("space-y-6", className)}
            >
                <div className={cn("grid gap-6", gridCols)}>
                    {fieldDefs.map((f) => {
                        // Hide the entire column if visibility is false
                        if (f.visibility === false) {
                            return null;
                        }
                        
                        return (
                            <div
                                key={f.name}
                                className={cn(f.colSpan || "col-span-12")}
                            >
                                <FieldRenderer fieldConfig={f} form={form} />
                            </div>
                        );
                    })}
                </div>

                {/* <div className="flex items-center justify-end gap-3">
          {actions}
          <Button type="submit">{submitLabel}</Button>
        </div> */}
            </form>
        </Form>
    );
}
