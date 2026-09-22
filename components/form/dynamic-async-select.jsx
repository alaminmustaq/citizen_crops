import AsyncSelect from "react-select/async";
import { useDynamicSelect } from "@/domains/dynamic-select/hook/useDynamicSelect";

export default function DynamicAsyncSelect({
    loadOptions = [],
    field,
    form,
    handleChange = false,
    isMulti = false,
    placeholder,
    isDisabled = false,
    firstChildren = [],
    lastChildren = [],
}) {
    const {
        actions: { onSearch, onLoadData },
        isLoading,
        transformed,
    } = useDynamicSelect("commonSearchTemplate", 500, loadOptions, form);

    const child = loadOptions[4] ? loadOptions[4] : null;

    return (
        <AsyncSelect
            isMulti={isMulti}
            isDisabled={isDisabled}
            styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                menu: (base) => ({ ...base, zIndex: 9999 }),
            }}
            value={field.value}
            defaultOptions={[...firstChildren, ...transformed, ...lastChildren]}
            loadOptions={(inputValue, callback) => {
                onSearch(inputValue, (options) => {
                    const merged = [
                        ...firstChildren,
                        ...options,
                        ...lastChildren,
                    ];
                    callback(merged);
                });
            }}
            onMenuOpen={onLoadData}
            placeholder={
                placeholder
                    ? placeholder
                    : isMulti
                      ? "Select multiple options..."
                      : "Select option..."
            }
            onChange={(val) => {
                if (Array.isArray(child)) {
                    child.forEach((item) => {
                        form.setValue(item, null);
                    });
                }

                handleChange
                    ? handleChange(val, form, field, transformed)
                    : field.onChange(val);

                form.trigger(field.name);
            }}
            isLoading={isLoading}
        />
    );
}
