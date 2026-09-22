"use client";

import React, { useState, useEffect, use } from "react";
import Card from "@/components/ui/card-snippet";
import PageLayout from "@/components/page-layout";
import { useLanguage } from "@/domains/language/hook/useLanguage"; // your existing hook
import axios from "axios";

const TranslatePage = ({ params }) => {
  const { lang, id: languageId } = use(params); // lang = 'en', languageId = your UUID

  const { languageState } = useLanguage();
  const translations = languageState.values || [];

  const [translationsState, setTranslationsState] = useState(translations);

  // Sync state when language values change
  useEffect(() => {
    setTranslationsState(translations);
  }, [translations]);

  // Handle input changes
  const handleChange = (index, newValue) => {
    const updated = translationsState.map((item, i) =>
      i === index
        ? { ...item, translate: { ...item.translate, value: newValue } }
        : item
    );
    setTranslationsState(updated);
  };

  // Update single translation
  const handleUpdate = async (item) => {
    try {
      await axios.put(
        `/api/languages/${languageId}/translations/${item.translate.id}`,
        {
          value: item.translate.value,
        }
      );
      alert(`Translation for "${item.key}" updated successfully!`);
    } catch (error) {
      console.error("Update failed:", error);
      alert(`Failed to update "${item.key}"`);
    }
  };

  // Bulk update all translations
  const handleSubmitAll = async () => {
    try {
      const payload = translationsState.map((item) => ({
        id: item.translate.id,
        value: item.translate.value,
      }));

      await axios.put(`/api/languages/${languageId}/translations/bulk-update`, payload);

      alert("All translations updated successfully!");
    } catch (error) {
      console.error("Bulk update failed:", error);
      alert("Failed to update translations.");
    }
  };

  return (
    <PageLayout>
      <Card>
        <div className="mb-4 text-right">
          <button
            onClick={handleSubmitAll}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition cursor-pointer"
          >
            Submit All
          </button>
        </div>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Key</th>
              <th className="p-2 border">Value</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {translationsState?.map((item, index) => (
              <tr key={item.id || index}>
                <td className="p-2 border">{item.key}</td>
                <td className="p-2 border">
                  <input
                    type="text"
                    value={item.translate?.value || ""}
                    onChange={(e) => handleChange(index, e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => handleUpdate(item)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition cursor-pointer"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </PageLayout>
  );
};

export default TranslatePage;
