import React, { useEffect } from "react";
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
    stepperClassName = "",
}) => {
    useEffect(() => {
        form.reset(form.defaultValue);
        setActiveStep(0);
    }, []);
    const translation_state = useSelector((state) => state.auth.translation);
    const [activeStep, setActiveStep] = React.useState(0);
    const [isInternalLoading, setIsInternalLoading] = React.useState(false);

    const stepHasError = (index) => {
        const fieldsInStep = fieldDefs[index]?.fields || [];
        return fieldsInStep.some((f) => {
            const fieldError = form.formState.errors[f.name];
            return !!fieldError;
        });
    };

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
        setIsInternalLoading(true);
        try {
            let valid = false;
            if (isServerValidated) {
                const response = form.watch("id")
                    ? await actions.onUpdate(form.getValues())
                    : await actions.onCreate(form.getValues());

                if (response) {
                    valid = true;
                } else {
                    valid = false;
                }
            } else {
                const currentFields = fieldDefs[activeStep]?.fields.map((f) => f.name) || [];
                valid = currentFields.length > 0 ? await form.trigger(currentFields) : true;
            }

            if (valid) {
                form.setValue("step", activeStep + 1);
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            }
        } finally {
            setIsInternalLoading(false);
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
            <div className={cn(stepperClassName)}>
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
                        <Step
                            key={label}
                            {...stepProps}
                            onClick={() => setActiveStep(index)}
                            style={{ cursor: "pointer" }}
                        >
                            <StepLabel
                                {...labelProps}
                                error={stepHasError(index)}
                            >
                                {translate(label, translation_state)}
                            </StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
        </div>

            <React.Fragment>
                <Form {...form}>
                    <form>
                        <div className="grid grid-cols-12 gap-4">
                            {fieldDefs[activeStep] && (
                                <React.Fragment key={fieldDefs[activeStep].key}>
                                    <div className="col-span-12 mb-4 mt-6">
                                        <h4 className="text-sm font-medium text-default-600">
                                            {fieldDefs[activeStep].label}
                                        </h4>
                                        <p className="text-xs text-default-600 mt-1">
                                            {fieldDefs[activeStep].description}
                                        </p>
                                    </div>

                                    {fieldDefs[activeStep].fields.map((f) => (
                                        <div
                                            key={f.name}
                                            className={cn(
                                                f.colSpan ||
                                                    "col-span-12",
                                            )}
                                        >
                                            <FieldRenderer
                                                fieldConfig={f}
                                                form={form}
                                            />
                                        </div>
                                    ))}
                                </React.Fragment>
                            )}
                        </div>
                    </form>
                </Form>

                <div className="flex pt-2 ">
                    <Button
                        type="button"
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
                                type="button"
                                size="xs"
                                variant="outline"
                                color="success"
                                className="cursor-pointer"
                                isLoading={isInternalLoading}
                                onClick={async () => {
                                    setIsInternalLoading(true);
                                    try {
                                        const isValid = await form.trigger();
                                        if (!isValid) return;

                                        const response = form.watch("id")
                                            ? await actions.onUpdate(
                                                  form.getValues(),
                                              )
                                            : await actions.onCreate(
                                                  form.getValues(),
                                              );

                                        if (
                                            response?.success &&
                                            !form.watch("id")
                                        ) {
                                            form.reset(form.defaultValue);
                                            setActiveStep(0);
                                        }
                                    } finally {
                                        setIsInternalLoading(false);
                                    }
                                }}
                            >
                                Submit
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                size="xs"
                                variant="outline"
                                color="secondary"
                                className="cursor-pointer"
                                isLoading={isInternalLoading}
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
