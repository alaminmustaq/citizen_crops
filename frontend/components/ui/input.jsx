import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Input variants
export const inputVariants = cva(
  "w-full bg-background border-border px-3 h-9 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium read-only:leading-9 read-only:bg-background disabled:cursor-not-allowed disabled:opacity-50 transition duration-300",
  {
    variants: {
      color: {
        default: "border-border text-default-500 focus:outline-hidden focus:border-primary disabled:bg-default-200 placeholder:text-accent-foreground/50",
        primary: "border-primary text-primary focus:outline-hidden focus:border-primary-700 disabled:bg-primary/30 disabled:placeholder:text-primary/70 placeholder:text-primary/70",
        info: "border-info/50 text-info focus:outline-hidden focus:border-info-700 disabled:bg-info/30 disabled:placeholder:text-info placeholder:text-info/70",
        warning: "border-warning/50 text-warning focus:outline-hidden focus:border-warning-700 disabled:bg-warning/30 disabled:placeholder:text-warning placeholder:text-warning/70",
        success: "border-success/50 text-success focus:outline-hidden focus:border-success-700 disabled:bg-success/30 disabled:placeholder:text-success placeholder:text-success/70",
        destructive: "border-destructive/50 text-destructive focus:outline-hidden focus:border-destructive-700 disabled:bg-destructive/30 disabled:placeholder:text-destructive placeholder:text-destructive/70",
      },
      variant: {
        flat: "bg-default-100 read-only:bg-default-100",
        underline: "border-b",
        bordered: "border",
        faded: "border border-border bg-default-100",
        ghost: "border-0 focus:border",
        "flat-underline": "bg-default-100 border-b",
      },
      shadow: {
        none: "",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
        xl: "shadow-xl",
        "2xl": "shadow-2xl",
      },
      radius: {
        none: "rounded-none",
        sm: "rounded",
        md: "rounded-lg",
        lg: "rounded-xl",
        xl: "rounded-[20px]",
      },
      size: {
        sm: "h-8 text-xs read-only:leading-8",
        md: "h-9 text-xs read-only:leading-9",
        lg: "h-10 text-sm read-only:leading-10",
        xl: "h-12 text-base read-only:leading-[48px]",
      },
    },
    compoundVariants: [
      { variant: "flat", color: "primary", className: "bg-primary/10 read-only:bg-primary/10" },
      { variant: "flat", color: "info", className: "bg-info/10 read-only:bg-info/10" },
      { variant: "flat", color: "warning", className: "bg-warning/10 read-only:bg-warning/10" },
      { variant: "flat", color: "success", className: "bg-success/10 read-only:bg-success/10" },
      { variant: "flat", color: "destructive", className: "bg-destructive/10 read-only:bg-destructive/10" },
      { variant: "faded", color: "primary", className: "bg-primary/10 border-primary/30 read-only:bg-primary/10 border-primary/30" },
      { variant: "faded", color: "info", className: "bg-info/10 border-info/30" },
      { variant: "faded", color: "warning", className: "bg-warning/10 border-warning/30" },
      { variant: "faded", color: "success", className: "bg-success/10 border-success/30" },
      { variant: "faded", color: "destructive", className: "bg-destructive/10 border-destructive/30" },
    ],
    defaultVariants: {
      color: "default",
      size: "md",
      variant: "bordered",
      radius: "md",
    },
  }
);

const Input = React.forwardRef(
  (
    {
      className,
      type = "text",
      size,
      color,
      radius,
      variant,
      shadow,
      removeWrapper = false,
      onChange,
      accept,
      multiple = false,
      ...props
    },
    ref
  ) => {
    const [previews, setPreviews] = React.useState([]);

    const handleFileChange = (e) => {
      const files = Array.from(e.target.files || []);
      const urls = files.map((file) => URL.createObjectURL(file));
      setPreviews(urls);

      if (onChange) onChange(e);
    };

    const renderPreview = () => {
      if (previews.length === 0) return null;

      return (
        <div className="mt-2 flex flex-wrap gap-2">
          {previews.map((url, index) => {
            const ext = url.split(".").pop().toLowerCase();
            if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
              return (
                <img
                  key={index}
                  src={url}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-md border"
                />
              );
            } else if (ext === "pdf") {
              return (
                <iframe
                  key={index}
                  src={url}
                  title={`PDF Preview ${index}`}
                  className="w-48 h-64 border rounded-md"
                ></iframe>
              );
            } else {
              return (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  Preview File {index + 1}
                </a>
              );
            }
          })}
        </div>
      );
    };

    const inputElement = (
      <>
        <input
          type={type}
          ref={ref}
          onChange={type === "file" ? handleFileChange : onChange}
          accept={accept}
          multiple={multiple}
          className={cn(inputVariants({ color, size, radius, variant, shadow }), className)}
          {...props}
        />
        {type === "file" && renderPreview()}
      </>
    );

    return removeWrapper ? inputElement : <div className="flex-1 w-full">{inputElement}</div>;
  }
);

Input.displayName = "Input";

export { Input };
