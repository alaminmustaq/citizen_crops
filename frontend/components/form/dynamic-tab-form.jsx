import React from "react";
import { Stepper, Step, StepLabel } from "@/components/ui/steps";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import FieldRenderer from "./field-renderer";
import { Form } from "@/components/ui/form";
import { translate } from "@/lib/utils";
import { useSelector } from "react-redux";

const DynamicTabForm = ({
    fields,
    form,
    actions,
    isServerValidated = false,
}) => { 
    const translation_state = useSelector((state) => state.auth.translation);
    const [activeStep, setActiveStep] = React.useState(0);
    
    
    const fieldDefs =
        typeof fields === "function"
            ? fields()
            : Array.isArray(fields)
            ? fields
            : []; 
    const steps = fieldDefs.map((field) => field.tab); 
    const isStepOptional = (step) => {
        return step === 1;
    };

    const handleNext = async () => {
        let valid = false;
        if (isServerValidated) {
            const response = form.watch("id")
                ? await actions.onUpdate(form.getValues())
                : await actions.onCreate(form.getValues());

            if (response?.success) {
                valid = true;
            } else {
                valid = false;
            }
        } else {
            valid = await form.trigger();
        }

        if (valid) {
            form.setValue("step", activeStep + 1);
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        form.setValue("step", activeStep - 1);
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const onSubmit = () => {
        form.watch("id")
            ? actions.onUpdate(form.getValues())
            : actions.onCreate(form.getValues());
    };

    const isTablet = useMediaQuery("(max-width: 1024px)");
    return (
        <>
            <Stepper current={activeStep} direction={isTablet && "vertical"}>
                {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    if (isStepOptional(index)) {
                        labelProps.optional = (
                            <StepLabel variant="caption">Optional</StepLabel>
                        );
                    }
                    // if (isStepSkipped(index)) {
                    //   stepProps.completed = false;
                    // }
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{translate(label,translation_state)}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>

            <React.Fragment>
                <Form {...form}>
                    <form>
                        <div className="grid grid-cols-12 gap-4">
                            {fieldDefs.map((item, index) => {
                                return (
                                    <>
                                        {activeStep === index && (
                                            <>
                                                <div className="col-span-12 mb-4 mt-6">
                                                    <h4 className="text-sm font-medium text-default-600">
                                                        {item.label}
                                                    </h4>
                                                    <p className="text-xs text-default-600 mt-1">
                                                        {item.description}
                                                    </p>
                                                </div>

                                                {item.fields.map((f) => (
                                                    <div
                                                        key={f.name}
                                                        className={cn(
                                                            f.colSpan ||
                                                                "col-span-12"
                                                        )}
                                                    >
                                                        <FieldRenderer
                                                            fieldConfig={f}
                                                            form={form}
                                                        />
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </>
                                );
                            })}
                        </div>
                    </form>
                </Form>

                <div className="flex pt-2 ">
                    <Button
                        size="xs"
                        variant="outline"
                        color="secondary"
                        className={cn("cursor-pointer", {
                            hidden: activeStep === 0,
                        })}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                    >
                        Back
                    </Button>
                    <div className="flex-1	gap-4 " />
                    <div className="flex	gap-2 ">
                        {activeStep === steps.length - 1 ||
                        activeStep === steps.length ? (
                            <Button
                                size="xs"
                                variant="outline"
                                color="success"
                                className="cursor-pointer"
                                onClick={() => {
                                    // if (onSubmit) onSubmit();
                                    if (activeStep != steps.length) {
                                        handleNext();
                                         if(!form.watch("id")){
                                             handleReset();
                                         }
                                     

                                    }
                                }}
                            >
                                Submit
                            </Button>
                        ) : (
                            <Button
                                size="xs"
                                variant="outline"
                                color="secondary"
                                className="cursor-pointer"
                                onClick={handleNext}
                            >
                                Next
                            </Button>
                        )}
                    </div>
                </div>
            </React.Fragment>
        </>
    );
};

export default DynamicTabForm;
