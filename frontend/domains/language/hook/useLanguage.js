import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { formReset, handleServerValidationErrors } from "@/utility/helpers";
import {
    useCreateLanguageMutation,
    useUpdateLanguageMutation,
    useDeleteLanguageMutation,
    useFetchLanguagesQuery,
    useFetchTranslationKeysQuery,
    useFetchLanguageValuesQuery,
    useUpdateLanguageValuesMutation,
    useUpdateSingleTranslationMutation,
    useSetDefaultLanguageMutation,
} from "../services/languageApi";
import { useParams } from "next/navigation";
export const useLanguage = () => {
    // Language CRUD
    const [createLanguage] = useCreateLanguageMutation();
    const [updateLanguage] = useUpdateLanguageMutation();
    const [deleteLanguage] = useDeleteLanguageMutation();
    const [updateLanguageValues] = useUpdateLanguageValuesMutation();
    const [updateSingleTranslation] = useUpdateSingleTranslationMutation();
    const [setDefaultLanguage] = useSetDefaultLanguageMutation();
    const languageId = useParams();

    const {
        data: languagesData,
        refetch: refetchLanguages,
        isFetching,
    } = useFetchLanguagesQuery();

    // Translation keys & values
    const { data: keysData } = useFetchTranslationKeysQuery();

    // Fetch values for a specific language
    const {
        data: languageValues,
        refetch: refetchValues,
        isFetching: isFetchingValues,
    } = useFetchLanguageValuesQuery(languageId?.id, { skip: !languageId?.id });

    const form = useForm({ mode: "onBlur", reValidateMode: "onSubmit" });

    const languageState = {
        data: languagesData?.data?.languages || [],
        form,
        refetch: refetchLanguages,
        isFetching,
        values: languageValues?.data || [],
        refetchValues,
        isFetchingValues,
        languageValues,
    };

    const actions = {
        // --- LANGUAGE CRUD ---
        onCreate: async (data) => {
            try {
                const formData = new FormData();
                Object.keys(data).forEach((key) => {
                    let value = data[key];
                    if (key === "is_active" || key === "is_default")
                        value = value ? 1 : 0;
                    formData.append(key, value);
                });
                await createLanguage(formData).unwrap();
                toast.success("Language created successfully");
                refetchLanguages();
                formReset(form);
            } catch (error) {
                handleServerValidationErrors(error, form.setError);
            }
        },

        onEdit: (data) => {
            form.reset({ ...data, flag_image: null });
            form.setValue("openModel", true);
        },

        onUpdate: async (data) => {
            try {
                const { id, ...other } = data;
                if (other.is_active === undefined) other.is_active = false;
                if (other.is_default === undefined) other.is_default = false;
                await updateLanguage({ id, credentials: other }).unwrap();
                toast.success("Language updated successfully");
                refetchLanguages();
                formReset(form);
                form.setValue("openModel", false);
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
            }
        },

        onDelete: async (id) => {
            if (!confirm("Are you sure you want to delete this language?"))
                return;
            try {
                await deleteLanguage({ id }).unwrap();
                toast.success("Language deleted successfully");
                refetchLanguages();
            } catch (error) {
                toast.error("Failed to delete language");
            }
        },

        // --- TRANSLATIONS ---
        onManageValues: (language) => {
            form.setValue("languageId", language.id);
            form.setValue(
                "selectedKeys",
                language.translations?.map((t) => ({
                    key_id: t.translation_key_id,
                    value: t.value,
                })) || []
            );
        },

        onUpdateValues: async (values) => {
            try {
                const languageId = form.getValues("languageId");
                await updateLanguageValues({ id: languageId, values }).unwrap();
                toast.success("Translations updated successfully");
                refetchLanguages();
                formReset(form);
                form.setValue("openValueMode", false);
            } catch (error) {
                handleServerValidationErrors(error, form.setError);
            }
        },
        onUpdateSingleTranslation: async (values) => {
            try {
                const value = values.translate.value;
                const id = values.translate.id;
                const language_id = values.translate.language_id;
                const isSingle = true;
                const data = {
                    value: value,
                    id: id,
                    language_id: language_id,
                    isSingle,
                };
 

                await updateSingleTranslation({ data }).unwrap();
                toast.success("Translations updated successfully");
            } catch (error) {
                handleServerValidationErrors(error, form.setError);
            }
        },
        onUpdateAllTranslation: async (values, isSingle) => {
            try { 

                const data = { value: values, isSingle };

                await updateSingleTranslation({ data }).unwrap();
                toast.success("Translations updated successfully");
            } catch (error) {
                handleServerValidationErrors(error, form.setError);
            }
        },
        onSetDefaultLanguage: async (values) => {
            try {   
                const data = values;

                await setDefaultLanguage(data).unwrap();
                toast.success("Default language set successfully");
 
            } catch (error) {
                handleServerValidationErrors(error, form.setError);
            }
        },

        
    };

    return { form, actions, languageState };
};
