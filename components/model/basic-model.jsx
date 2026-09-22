import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DynamicForm } from "@/components/form/dynamic-form";
import { useWatch } from "react-hook-form";
import { formReset } from "@/utility/helpers";
import { translate } from "@/lib/utils";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function BasicModel({
    form,
    fields,
    actions,
    title,
    submitLabel,
    cancelLabel,
    size = "5xl",
    isLoading = false,
    children,
    alwaysShowChildren = false, // New prop to control children visibility
}) {
    const [isInternalLoading, setIsInternalLoading] = useState(false);
    const translation_state = useSelector((state) => state.auth.translation);

    const handleFormSubmit = async () => {
        setIsInternalLoading(true);
        try {
            if (form.watch("id")) {
                await actions.onUpdate(form.getValues());
            } else {
                await actions.onCreate(form.getValues());
            }
        } finally {
            setIsInternalLoading(false);
        }
    };

    title = translate(title, translation_state);
    submitLabel = translate(submitLabel, translation_state);
    cancelLabel = translate(cancelLabel, translation_state);

    const openModel = useWatch({
        control: form.control,
        name: "openModel",
    });
    console.log(form);

    return (
        <Dialog
            open={openModel}
            onOpenChange={(val) => {
                //  reset form values when closing the model
                formReset(form);
                form.setValue("openModel", val);
            }}
        >
            <DialogContent
                size={size}
                className="p-0 max-h-[85vh] flex flex-col overflow-hidden"
            >
                {/* Header (fixed) */}
                <DialogHeader className="px-6 py-4 ">
                    <DialogTitle className="text-base font-medium text-default-700">
                        {title || "Create New Item"}
                    </DialogTitle>
                </DialogHeader>

                {/* Scrollable form area */}
                <div className="flex-1 overflow-y-auto px-6 py-4 pb-20">
                    <DynamicForm
                        form={form}
                        fields={fields}
                        onSubmit={handleFormSubmit}
                        submitLabel={submitLabel || "Submit"}
                        actions={null} // footer buttons below
                        gridCols="grid-cols-12"
                    />

                    {(alwaysShowChildren || fields.length <= 0) && children}
                </div>

                {/* Footer (fixed) */}
                <DialogFooter className="px-6 py-3 flex">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            {cancelLabel || "Cancel"}
                        </Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        isLoading={isLoading || isInternalLoading}
                        onClick={handleFormSubmit}
                    >
                        {submitLabel || "Submit"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
