import { toast } from "react-hot-toast";

const fields = (form) => [
  // ===== Purchase Master Fields =====
  {
    name: "purchase_date",
    type: "input",
    label: "Purchase Date *",
    placeholder: "Select purchase date",
    colSpan: "col-span-12 md:col-span-6",
    rules: { required: "Purchase date is required" },
    inputProps: { type: "date" },
  },
  {
    name: "ref_no",
    type: "text",
    label: "Reference No",
    placeholder: "Enter reference number",
    colSpan: "col-span-12 md:col-span-6",
  },
    {
    name: "warehouse_id",
    type: "async-select",
    label: "Warehouse *",
    loadOptions: ["inventory/warehouses", "warehouses", "warehouseSearchTemplate"],
    placeholder: "Select Warehouse",
    colSpan: "col-span-12 md:col-span-6",
    // rules: { required: "Warehouse is required" },
  },
  // {
  //   name: "purchase_status",
  //   type: "select",
  //   label: "Purchase Status",
  //   options: [
  //     { label: "Pending", value: "pending" },
  //     { label: "Completed", value: "completed" },
  //     { label: "Cancelled", value: "cancelled" },
  //   ],
  //   colSpan: "col-span-12 md:col-span-4",
  //   rules: { required: "Purchase status is required" },
  // },
  // ===== Tool Dropdown =====
  {
    name: "tool_id",
    type: "async-select",
    label: "Add Tool",
    loadOptions: ["inventory/tools", "tools", "toolSearchTemplate"],
    placeholder: "Select tool",
    colSpan: "col-span-12 md:col-span-6",
    handleChange: (e, form, field, allData) => {  
      
      const existingTools = form.getValues("details") || [];
      const exists = existingTools.some((t) => t.tool_id === e.value);

      const rawData = allData.find((item) => item.value === e.value);

      if (exists) {
        toast.error("Tool already added!");
        return;
      }

      // Append new purchase detail
      form.fields.append({
        tool_id: e.value,
        tool_name: e.label,
        unit_price: rawData?.unit_price ?? 0,
        quantity: 0,
        total_price: 0,
        net_total_price: 0,
        warehouse_id: null,
      });

      field.onChange(null); // reset dropdown
    },
  },
  {
    name: "remarks",
    type: "text",
    label: "Remarks",
    placeholder: "Enter remarks (optional)",
    colSpan: "col-span-12 md:col-span-6",
  }, 

  // ===== Dynamic Purchase Details =====
  {
    name: "details",
    type: "group-form",
    label: "Purchase Details",
    placeholder: "Tool details",
    colSpan: "col-span-12",
    addButtonLabel: false, // single dropdown handles adding
    fields: [
      {
        name: "tool_name",
        type: "text",
        label: "Tool Name",
        colSpan: "col-span-12 md:col-span-3",
        disabled: true,
      },
      {
        name: "unit_price",
        type: "number",
        label: "Unit Price *",
        colSpan: "col-span-12 md:col-span-3",
        rules: {
          required: "Unit price is required",
          min: { value: 0, message: "Unit price cannot be negative" },
        },
        handleChange: (value, form, index) => {
          const details = form.getValues("details") || [];
          const unitPrice = Number(value || 0);
          const quantity = Number(form.watch(`details.${index}.quantity`) || 0);

          const totalPrice = unitPrice * quantity;
          form.setValue(`details.${index}.total_price`, totalPrice);
          form.setValue(`details.${index}.net_total_price`, totalPrice);

          // update master totals
          const totalTools = details.reduce(
            (sum, item, i) => sum + (i === index ? quantity : Number(item.quantity) || 0),
            0
          );
          const totalPurchaseAmount = details.reduce(
            (sum, item, i) => sum + (i === index ? totalPrice : Number(item.total_price) || 0),
            0
          );
          form.setValue("total_tool", totalTools);
          form.setValue("total_purchase_amount", totalPurchaseAmount);
          form.setValue("net_purchase_amount", totalPurchaseAmount);
        },
      },
      {
        name: "quantity",
        type: "number",
        label: "Quantity *",
        colSpan: "col-span-12 md:col-span-3",
        rules: {
          required: "Quantity is required",
          min: { value: 1, message: "Quantity must be at least 1" },
        },
        handleChange: (value, form, index) => {
          const details = form.getValues("details") || [];
          const quantity = Number(value || 0);
          const unitPrice = Number(form.watch(`details.${index}.unit_price`) || 0);

          const totalPrice = unitPrice * quantity;
          form.setValue(`details.${index}.total_price`, totalPrice);
          form.setValue(`details.${index}.net_total_price`, totalPrice);

          const totalTools = details.reduce(
            (sum, item, i) => sum + (i === index ? quantity : Number(item.quantity) || 0),
            0
          );
          const totalPurchaseAmount = details.reduce(
            (sum, item, i) => sum + (i === index ? totalPrice : Number(item.total_price) || 0),
            0
          );
          form.setValue("total_tool", totalTools);
          form.setValue("total_purchase_amount", totalPurchaseAmount);
          form.setValue("net_purchase_amount", totalPurchaseAmount);
        },
      },
      {
        name: "total_price",
        type: "number",
        label: "Total Price",
        colSpan: "col-span-12 md:col-span-3",
        disabled: true,
      },
      // {
      //   name: "net_total_price",
      //   type: "number",
      //   label: "Net Total Price",
      //   colSpan: "col-span-12 md:col-span-3",
      //   disabled: true,
      // },
    ],
  },

  // ===== Master Totals Display =====
  {
    name: "total_tool",
    type: "text-display",
    colSpan: "col-span-12",
    getValue: (form) => (
      <div className="flex justify-end gap-4">
        <span className="w-48 text-right font-semibold">Total Tool:</span>
        <span className="w-32 text-right break-all">{form.watch("total_tool") || 0}</span>
      </div>
    ),
  },
  {
    name: "total_purchase_amount",
    type: "text-display",
    colSpan: "col-span-12",
    getValue: (form) => (
      <div className="flex justify-end gap-4">
        <span className="w-48 text-right font-semibold">Total Purchase Amount:</span>
        <span className="w-32 text-right break-all">{form.watch("total_purchase_amount") || 0}</span>
      </div>
    ),
  },
];

export default fields;
