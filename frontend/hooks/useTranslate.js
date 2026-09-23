import { useSelector } from "react-redux";

export function useTranslate() {
  const translation = useSelector((state) => state.auth.translation);

  const translate = (title, trans = []) => {
    if (typeof title !== "string") return title;

    const finalTrans = trans.length === 0 ? translation : trans;
    const key = title.toLowerCase();

    const value = finalTrans?.[key];
    if (!value) return title;

    return value;
  };

  return translate;
}
