"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useFieldArray } from "react-hook-form";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2 } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import DynamicAsyncSelect from "./dynamic-async-select";
import GroupFormPaginatedField from "./group-form-paginated";
import CustomQuestionsBuilder from "./custom-questions-builder";
import ScreeningQuestionsBuilder from "./screening-questions-builder";
import { translate } from "@/lib/utils";
import Select from "react-select";
import dynamic from "next/dynamic";
const RichTextEditor = dynamic(
    () => import("@/components/ui/RichTextEditor"),
    { ssr: false },
);
import { useSelector } from "react-redux";
/**
 * FieldConfig (JS docs):
 * {
 *   name: string,
 *   type: "input" | "password" | "email" | "number" | "select" | "multi-select" | "async-select" | "multi-async-select" | "textarea" | "checkbox" | "radio" | "date",
 *   label?: string,
 *   placeholder?: string,
 *   description?: string,
 *   colSpan?: string,            // e.g. "col-span-12 md:col-span-6"
 *   disabled?: boolean,
 *   visibility?: boolean,        // defaults to true, if false field won't render
 *   rules?: object,              // RHF rules (required, minLength, etc.)
 *   options?: {label, value}[],  // for select/radio/multi-select
 *   loadOptions?: array,         // for async-select/multi-async-select
 *   inputProps?: object          // extra props for inputs/textarea
 * }
 */

const FieldRenderer = ({ fieldConfig, form }) => {
    let {
        name,
        label,
        placeholder,
        description,
        type,
        options,
        loadOptions,
        disabled,
        rules,
        inputProps,
        getOptLabel = (opt) => opt.label,
        getOptValue = (opt) => opt.value,
        menuPlacement = "auto",
        handleChange,
        optionValue,
        note,
        refLink,
        visibility = true,
        addButtonLabel = "Add More",
        index = false,
        getValue,
        defaultValue,
        rows,
        firstChildren,
        lastChildren,
    } = fieldConfig;

    const translation_state = useSelector((state) => state.auth.translation);
    label = translate(label, translation_state);
    placeholder = translate(placeholder, translation_state);

    const styles = {
        option: (provided, state) => ({
            ...provided,
            fontSize: "14px",
        }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        menu: (base) => ({ ...base, zIndex: 9999 }),
    };

    // If visibility is false, don't render the field
    const isVisible =
        typeof visibility === "function" ? visibility(index) : visibility;

    if (!isVisible) return null;

    // Support disabled as function (form, index, name) for per-row logic
    const resolvedDisabled =
        typeof disabled === "function"
            ? disabled(form, index, name)
            : !!disabled;

    return (
        <FormField
            control={form.control}
            name={name}
            rules={rules}
            render={({ field }) => {
                const showError = !!form.formState.errors?.[name];
                const baseInputClass = cn("", {
                    "border-destructive focus:border-destructive": showError,
                });

                // number coercion for RHF – use "" when empty so field stays cleared (undefined can trigger reset)
                const numberOnChange =
                    type === "number"
                        ? (e) => {
                              const raw = e?.target?.value ?? "";
                              const isEmpty = raw === "";
                              const parsed = isEmpty ? null : Number(raw);
                              const finalValue =
                                  !isEmpty && !Number.isNaN(parsed)
                                      ? parsed
                                      : isEmpty
                                        ? ""
                                        : field.value;
                              field.onChange(finalValue);
                              if (handleChange) {
                                  handleChange(
                                      finalValue === ""
                                          ? undefined
                                          : finalValue,
                                      form,
                                      index,
                                  );
                              }
                          }
                        : undefined;

                return (
                    <FormItem>
                        {label ? (
                            <FormLabel className="mb-2">{label}</FormLabel>
                        ) : null}
                        <FormControl>
                            {type === "textarea" ? (
                                <Textarea
                                    placeholder={placeholder}
                                    disabled={resolvedDisabled}
                                    rows={rows}
                                    {...field}
                                    {...(inputProps || {})}
                                    className={cn(
                                        baseInputClass,
                                        inputProps?.className,
                                    )}
                                />
                            ) : type === "select" ? (
                                <Select
                                    className="react-select"
                                    classNamePrefix="select"
                                    value={options.find(
                                        (opt) =>
                                            opt[optionValue ?? "value"] ===
                                            field.value,
                                    )}
                                    styles={styles}
                                    name="clear"
                                    menuPlacement={menuPlacement}
                                    defaultValue={
                                        defaultValue ? defaultValue : []
                                    }
                                    options={options || []}
                                    isDisabled={!!resolvedDisabled}
                                    getOptionLabel={getOptLabel}
                                    getOptionValue={getOptValue}
                                    id={name}
                                    isClearable
                                    onChange={(selectedOption) => {
                                        const value = handleChange
                                            ? handleChange(
                                                  selectedOption,
                                                  index,
                                              )
                                            : selectedOption?.[
                                                  optionValue ?? "value"
                                              ];
                                        field.onChange(value);

                                        // If handleChange exists, also call it with form
                                        if (handleChange) {
                                            handleChange(
                                                selectedOption,
                                                form,
                                                index,
                                            );
                                        }
                                    }}
                                />
                            ) : type === "multi-select" ? (
                                <Select
                                    className="react-select"
                                    classNamePrefix="select"
                                    isMulti
                                    value={
                                        Array.isArray(field.value)
                                            ? options.filter((opt) =>
                                                  field.value.includes(
                                                      opt[
                                                          optionValue ?? "value"
                                                      ],
                                                  ),
                                              )
                                            : []
                                    }
                                    styles={styles}
                                    name="clear"
                                    menuPlacement={menuPlacement}
                                    options={options || []}
                                    isDisabled={!!resolvedDisabled}
                                    getOptionLabel={getOptLabel}
                                    getOptionValue={getOptValue}
                                    isClearable
                                    placeholder={
                                        placeholder ||
                                        "Select multiple options..."
                                    }
                                    onChange={(selectedOptions) => {
                                        const values = selectedOptions
                                            ? selectedOptions.map(
                                                  (opt) =>
                                                      opt[
                                                          optionValue ?? "value"
                                                      ],
                                              )
                                            : [];
                                        const finalValue = handleChange
                                            ? handleChange(selectedOptions)
                                            : values;
                                        field.onChange(finalValue);

                                        // If handleChange exists, also call it with form
                                        if (handleChange) {
                                            handleChange(selectedOptions, form);
                                        }
                                    }}
                                />
                            ) : type === "checkbox" ? (
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={!!field.value}
                                        onCheckedChange={(checked) => {
                                            field.onChange(checked);
                                            if (handleChange) {
                                                handleChange(checked, form);
                                            }
                                        }}
                                        disabled={resolvedDisabled}
                                        id={`${name}-checkbox`}
                                    />
                                    {placeholder ? (
                                        <label
                                            htmlFor={`${name}-checkbox`}
                                            className="text-sm text-muted-foreground cursor-pointer"
                                        >
                                            {placeholder}
                                        </label>
                                    ) : null}
                                </div>
                            ) : type === "switch" ? (
                                <div className="flex items-center space-x-2 mt-2">
                                    <Switch
                                        checked={!!field.value}
                                        onCheckedChange={(checked) => {
                                            field.onChange(checked);
                                            if (handleChange) {
                                                handleChange(checked, form);
                                            }
                                        }}
                                        disabled={resolvedDisabled}
                                        id={`${name}-switch`}
                                    />
                                    {label || placeholder ? (
                                        <label
                                            htmlFor={`${name}-switch`}
                                            className="text-sm font-medium leading-none cursor-pointer"
                                        >
                                            {label || placeholder}
                                        </label>
                                    ) : null}
                                </div>
                            ) : type === "card" ? (
                                <Card>
                                    {(label || placeholder) && (
                                        <CardHeader className="pb-3 border-b mb-3">
                                            <CardTitle className="text-base font-semibold">{label || placeholder}</CardTitle>
                                        </CardHeader>
                                    )}
                                    <CardContent className={label || placeholder ? "pt-0" : "pt-4"}>
                                        <div className="grid grid-cols-12 gap-x-4 gap-y-4">
                                            {(fieldConfig.childFields || []).map((childField) => (
                                                <div
                                                    key={childField.name || childField.label}
                                                    className={cn(childField.colSpan || "col-span-12")}
                                                >
                                                    <FieldRenderer
                                                        fieldConfig={{ ...childField, index }}
                                                        form={form}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : type === "custom-questions" ? (
                                <CustomQuestionsBuilder field={field} />
                            ) : type === "screening-questions" ? (
                                <ScreeningQuestionsBuilder field={field} />
                            ) : type === "file" ? (
                                <div>
                                    <Input
                                        type="file"
                                        disabled={resolvedDisabled}
                                        {...(inputProps || {})}
                                        onChange={(e) => {
                                            const file =
                                                e.target.files?.[0] || null;
                                            field.onChange(file);
                                            if (handleChange) {
                                                handleChange(file, form);
                                            }
                                        }}
                                    />

                                    {/* Simple preview text */}
                                    {field.value && (
                                        <p className="mt-2 text-sm text-gray-600">
                                            {typeof field.value === "string" ? (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (
                                                            inputProps?.onViewFile
                                                        ) {
                                                            inputProps.onViewFile(
                                                                field.value,
                                                            );
                                                            return;
                                                        }

                                                        const href =
                                                            field.value.startsWith(
                                                                "http",
                                                            )
                                                                ? field.value
                                                                : `${window.location.origin}${field.value}`;
                                                        window.open(
                                                            href,
                                                            "_blank",
                                                            "noopener,noreferrer",
                                                        );
                                                    }}
                                                    className="text-blue-600 underline"
                                                >
                                                    {inputProps?.viewFileLabel ||
                                                        "View current file"}
                                                </button>
                                            ) : (
                                                ``
                                            )}
                                        </p>
                                    )}
                                </div>
                            ) : // console.log(field.value)

                            type === "radio" ? (
                                <RadioGroup
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        if (handleChange) {
                                            handleChange(value, form);
                                        }
                                    }}
                                    value={field.value ?? ""}
                                    className="flex flex-wrap gap-4"
                                >
                                    {(options || []).map((opt) => (
                                        <div
                                            key={opt.value}
                                            className="flex items-center space-x-2"
                                        >
                                            <RadioGroupItem
                                                id={`${name}-${opt.value}`}
                                                value={opt.value}
                                            />
                                            <label
                                                htmlFor={`${name}-${opt.value}`}
                                                className="text-sm cursor-pointer"
                                            >
                                                {opt.label}
                                            </label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            ) : type == "async-select" ? (
                                <DynamicAsyncSelect
                                    placeholder={placeholder}
                                    loadOptions={loadOptions}
                                    field={field}
                                    form={form}
                                    firstChildren={firstChildren}
                                    lastChildren={lastChildren}
                                    handleChange={handleChange}
                                    isDisabled={!!resolvedDisabled}
                                />
                            ) : type === "multi-async-select" ? (
                                <DynamicAsyncSelect
                                    placeholder={placeholder}
                                    loadOptions={loadOptions}
                                    field={field}
                                    form={form}
                                    handleChange={handleChange}
                                    isMulti={true}
                                    isDisabled={!!resolvedDisabled}
                                />
                            ) : type === "group-form" ? (
                                <GroupFormField
                                    fieldConfig={fieldConfig}
                                    form={form}
                                    addButtonLabel={addButtonLabel}
                                />
                            ) : type === "group-form-paginated" ? (
                                <GroupFormPaginatedField
                                    fieldConfig={fieldConfig}
                                    form={form}
                                    addButtonLabel={addButtonLabel}
                                />
                            ) : type === "rich-text" ? (
                                <RichTextEditor
                                    value={field.value || ""}
                                    onChange={(html) => field.onChange(html)}
                                    placeholder={placeholder}
                                    disabled={resolvedDisabled}
                                />
                            ) : type === "text-display" ? (
                                <div>
                                    {getValue ? getValue(form) : field.value}
                                </div>
                            ) : type === "button" ? (
                                <Button
                                    type="button"
                                    disabled={resolvedDisabled}
                                    onClick={(e) => {
                                        handleChange(e, form);
                                    }}
                                >
                                    {placeholder || label || "Button"}
                                </Button>
                            ) : (
                                <div className="space-y-2">
                                    <Input
                                        type={
                                            type === "password"
                                                ? "password"
                                                : type === "email"
                                                  ? "email"
                                                  : type === "date"
                                                    ? "date"
                                                    : type === "number"
                                                      ? "text" // text so backspace can clear; we coerce to number
                                                      : "text"
                                        }
                                        placeholder={placeholder}
                                        disabled={resolvedDisabled}
                                        ref={field.ref}
                                        onBlur={field.onBlur}
                                        name={field.name}
                                        {...(inputProps || {})}
                                        value={
                                            type === "number"
                                                ? field.value === "" ||
                                                  field.value == null
                                                    ? ""
                                                    : String(field.value)
                                                : (field.value ?? "")
                                        }
                                        onChange={
                                            numberOnChange ||
                                            ((e) => {
                                                const val =
                                                    e?.target?.value ?? "";
                                                field.onChange(val);
                                                if (handleChange) {
                                                    handleChange(
                                                        val,
                                                        form,
                                                        index,
                                                    );
                                                }
                                            })
                                        }
                                        className={cn(
                                            baseInputClass,
                                            inputProps?.className,
                                        )}
                                        inputMode={
                                            type === "number"
                                                ? "numeric"
                                                : inputProps?.inputMode
                                        }
                                    />

                                    {(note || refLink) && (
                                        <p className="text-[10px] text-muted-foreground">
                                            {note && <>{note} </>}
                                            {refLink && (
                                                <a
                                                    href={refLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="underline text-blue-500"
                                                >
                                                    here
                                                </a>
                                            )}
                                        </p>
                                    )}
                                </div>
                            )}
                        </FormControl>
                        {description ? (
                            <FormDescription>{description}</FormDescription>
                        ) : null}
                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    );
};

const GroupFormField = ({ fieldConfig, form, addButtonLabel }) => {
    const { name, fields: childFields, label, isDelete = true } = fieldConfig;

    // Use the fieldArray methods from the form (passed from useDocument)
    const { fields, append, remove } = form.fields;

    const addNewItem = () => {
        const defaultItem = {};
        childFields.forEach((field) => {
            defaultItem[field.name] = field.type === "checkbox" ? false : "";
        });
        append(defaultItem);
    };

    return (
        <div className="space-y-4">
            {/* {label && (
                <FormLabel className="text-base font-semibold">
                    {label}
                </FormLabel>
            )} */}

            {fields.map((item, index) => (
                <div
                    key={item.id}
                    className="grid grid-cols-12 gap-4 items-center"
                >
                    {childFields.map((childField) => {
                        const fieldName = `${name}.${index}.${childField.name}`;
                        if (
                            typeof childField.visibility === "function" &&
                            childField.visibility() === false
                        ) {
                            return null;
                        }
                        if (childField.visibility === false) {
                            return null;
                        }

                        return (
                            <div
                                key={childField.name}
                                className={cn(
                                    childField.colSpan || "col-span-12",
                                )}
                            >
                                <FieldRenderer
                                    fieldConfig={{
                                        ...childField,
                                        name: fieldName,
                                        index,
                                    }}
                                    form={form}
                                />
                            </div>
                        );
                    })}
                    {isDelete && (
                        <div className="col-span-2 md:col-span-1 flex justify-end items-center">
                            <Button
                                type="button"
                                size="sm"
                                onClick={() => remove(index)}
                                className="bg-red-500 hover:bg-red-600 text-white"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </div>
            ))}

            {/* Footer Add Button */}
            {addButtonLabel && (
                <div className="flex justify-start pt-2">
                    <Button
                        type="button"
                        size="sm"
                        onClick={addNewItem}
                        className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white"
                    >
                        <Plus className="w-4 h-4" />
                        {addButtonLabel}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default FieldRenderer;
