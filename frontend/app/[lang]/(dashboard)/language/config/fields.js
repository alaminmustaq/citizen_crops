const fields = () => [
    {
      name: "code",
      type: "input",
      label: "Language Code *",
      placeholder: "e.g., en, fr, pt or en-US",
      colSpan: "col-span-12 md:col-span-4",
      rules: {
        required: "Language code is required",
        maxLength: { value: 5, message: "Max 5 characters" },
      },
    },
    {
      name: "name",
      type: "input",
      label: "Language Name *",
      placeholder: "English, French, Portuguese...",
      colSpan: "col-span-12 md:col-span-4",
      rules: { required: "Language name is required" },
    },
    {
      name: "native_name",
      type: "input",
      label: "Native Name *",
      placeholder: "Français, Português...",
      colSpan: "col-span-12 md:col-span-4",
      rules: { required: "Native name is required" },
    },
    {
      name: "flag_icon",
      type: "input",
      label: "Flag Icon",
      placeholder: "e.g., 🇺🇸, 🇫🇷, 🇵🇹",
      colSpan: "col-span-12 md:col-span-4",
      note: "Enter an Alt-codes Flag Symbol",
      refLink: 'https://www.alt-codes.net/flags',
    },
    {
      name: "sort_order",
      type: "number",
      label: "Sort Order *",
      placeholder: "0",
      colSpan: "col-span-12 md:col-span-4",
      rules: { min: { value: 0, message: "Sort order cannot be negative" } },
      inputProps: { min: 0 },
    },
    {
      name: "is_active",
      type: "checkbox",
      label: "Active",
      colSpan: "col-span-12 md:col-span-4",
      valuePropName: "checked", // ensures boolean is sent
    },
    {
      name: "is_default",
      type: "checkbox",
      label: "Default",
      colSpan: "col-span-12 md:col-span-4",
      valuePropName: "checked", // ensures boolean is sent
    },
    {
      name: "direction",
      type: "select",
      label: "Text Direction *",
      colSpan: "col-span-12 md:col-span-4",
      options: [
        { label: "Left-to-Right (LTR)", value: "ltr" },
        { label: "Right-to-Left (RTL)", value: "rtl" },
      ],
    },
  ];
  
  export default fields;
  