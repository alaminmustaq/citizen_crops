import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";

export const languageApi = createApi({
  reducerPath: "languageApi",
  baseQuery: baseQuery,
  tagTypes: ["Language", "TranslationKeys", "LanguageValues"],
  endpoints: (builder) => ({
    // Fetch all languages
    fetchLanguages: builder.query({
      query: () => ({ url: "languages", method: "GET" }),
      providesTags: ["Language"],
    }),

    // Create a new language
    createLanguage: builder.mutation({
      query: (formData) => ({ url: "languages", method: "POST", body: formData }),
      invalidatesTags: ["Language"],
    }),

    // Update an existing language
    updateLanguage: builder.mutation({
      query: ({ id, credentials }) => ({
        url: `languages/${id}`,
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: ["Language"],
    }),

    // Delete a language
    deleteLanguage: builder.mutation({
      query: ({ id }) => ({ url: `languages/${id}`, method: "DELETE" }),
      invalidatesTags: ["Language"],
    }),

    // Fetch all translation keys
    fetchTranslationKeys: builder.query({
      query: () => ({ url: "translation-keys", method: "GET" }),
      providesTags: ["TranslationKeys"],
    }),

    // Fetch translation values for a language
    fetchLanguageValues: builder.query({
      query: (languageId) => ({ url: `languages/${languageId}/translations`, method: "GET" }),
      providesTags: (result, error, arg) => [{ type: "LanguageValues", id: arg }],
    }),
   
    updateSingleTranslation: builder.mutation({
      query: ( credentials ) => ({
        url: `languages/singletranslation`,
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Language"],
    }),

    // Update translation values for a language
    updateLanguageValues: builder.mutation({
      query: ({ id, values }) => ({
        url: `languages/${id}/translations`,
        method: "PUT",
        body: { values },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "LanguageValues", id: arg.id }],
    }),

    setDefaultLanguage: builder.mutation({
      query: (id) => 
      {
        console.log(id);
        
      return  ({
        url: `languages/${id}/default`,
        method: "POST",
      })
      },
      invalidatesTags: ["Language"],
    }),
  }),
});

export const {
  useFetchLanguagesQuery,
  useCreateLanguageMutation,
  useUpdateLanguageMutation,
  useDeleteLanguageMutation,
  useFetchTranslationKeysQuery,
  useFetchLanguageValuesQuery,
  useUpdateLanguageValuesMutation,
  useUpdateSingleTranslationMutation,
  useSetDefaultLanguageMutation,
} = languageApi;
