"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/ui/card-snippet";
import PageLayout from "@/components/page-layout";
import { useLanguage } from "@/domains/language/hook/useLanguage";
import axios from "axios";
import { translate } from "@/lib/utils";
import { useSelector } from "react-redux";

const TranslatePage = ({ params }) => {
  const translation_state = useSelector((state) => state.auth.translation); 
  
  const { lang, id: languageId } = params;
  const { languageState, actions } = useLanguage();
  const translations = languageState.values || [];
  const [translationsState, setTranslationsState] = useState(translations);
 

  useEffect(() => {
    setTranslationsState(translations);
  }, [translations]);

  const handleChange = (index, newValue) => {
    const updated = translationsState.map((item, i) =>
      i === index ? { ...item, translate: { ...item.translate, value: newValue } } : item
    );
    setTranslationsState(updated);
  };

  

  return (
    <PageLayout>
      <Card>
        <div className="mb-4 text-right">
          <button
            onClick={() => actions.onUpdateAllTranslation(translationsState,false)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition cursor-pointer"
          >
            {translate('Submit All',translation_state)}
          </button>
        </div>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">{translate('Key',translation_state)}</th>
              <th className="p-2 border">{translate('Value',translation_state)}</th>
              <th className="p-2 border">{translate('Action',translation_state)}</th>
            </tr>
          </thead>
          <tbody>
            {translationsState?.map((item, index) => (
              <tr key={index}>
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
                    onClick={() => actions.onUpdateSingleTranslation(item)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition cursor-pointer"
                  >
                    {translate('Update',translation_state)}
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
