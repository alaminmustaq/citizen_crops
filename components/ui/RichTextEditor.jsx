"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import "quill/dist/quill.snow.css";

const ReactQuill = dynamic(
    async () => {
        const { useQuill } = await import("react-quilljs");

        const QuillWrapper = ({ value, onChange, placeholder, disabled }) => {
            const { quill, quillRef } = useQuill({
                theme: "snow",
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ["bold", "italic", "underline", "strike"],
                        [{ color: [] }, { background: [] }],
                        [{ list: "ordered" }, { list: "bullet" }],
                        [{ indent: "-1" }, { indent: "+1" }],
                        [{ align: [] }],
                        ["link"],
                        ["clean"],
                    ],
                },
                placeholder: placeholder || "Enter description...",
                readOnly: disabled || false,
            });

            const isInitialized = useRef(false);

            useEffect(() => {
                if (quill && !isInitialized.current && value) {
                    quill.clipboard.dangerouslyPasteHTML(value);
                    isInitialized.current = true;
                }
            }, [quill, value]);

            useEffect(() => {
                if (!quill) return;

                const handler = () => {
                    const html = quill.root.innerHTML?.trim() || "";
                    const isEmpty =
                        html === "<p><br></p>" ||
                        html === "<p></p>" ||
                        html === "";
                    onChange(isEmpty ? "" : html);
                };

                quill.on("text-change", handler);

                return () => {
                    quill.off("text-change", handler);
                };
            }, [quill, onChange]);

            useEffect(() => {
                if (!quill) return;

                const setActiveMessageField = () => {
                    window.dispatchEvent(
                        new CustomEvent("email-template-active-field", {
                            detail: { field: "message" },
                        }),
                    );
                };

                quill.root.addEventListener("focus", setActiveMessageField);
                quill.root.addEventListener("click", setActiveMessageField);

                return () => {
                    quill.root.removeEventListener("focus", setActiveMessageField);
                    quill.root.removeEventListener("click", setActiveMessageField);
                };
            }, [quill]);

            useEffect(() => {
                if (!quill) return;

                const addSmartSpacing = (text, insertAt, tag) => {
                    const beforeChar = text[insertAt - 1] || "";
                    const afterChar = text[insertAt] || "";

                    const needsSpaceBefore =
                        insertAt > 0 &&
                        beforeChar !== " " &&
                        beforeChar !== "\n" &&
                        beforeChar !== "\t" &&
                        beforeChar !== "(";

                    const needsSpaceAfter =
                        afterChar &&
                        afterChar !== " " &&
                        afterChar !== "\n" &&
                        afterChar !== "\t" &&
                        afterChar !== "." &&
                        afterChar !== "," &&
                        afterChar !== "!" &&
                        afterChar !== "?" &&
                        afterChar !== ")" &&
                        afterChar !== ":" &&
                        afterChar !== ";";

                    return `${needsSpaceBefore ? " " : ""}${tag}${needsSpaceAfter ? " " : ""}`;
                };

                const insertHandler = (event) => {
                    const tag = event?.detail?.tag;
                    if (!tag) return;

                    quill.focus();

                    const range = quill.getSelection(true);
                    const index = range ? range.index : quill.getLength() - 1;

                    const plainText = quill.getText() || "";
                    const tagToInsert = addSmartSpacing(plainText, index, tag);

                    quill.insertText(index, tagToInsert, "user");
                    quill.setSelection(index + tagToInsert.length, 0, "user");
                };

                window.addEventListener(
                    "email-template-insert-message-tag",
                    insertHandler,
                );

                return () => {
                    window.removeEventListener(
                        "email-template-insert-message-tag",
                        insertHandler,
                    );
                };
            }, [quill]);

            return <div ref={quillRef} style={{ minHeight: "160px" }} />;
        };

        return QuillWrapper;
    },
    { ssr: false },
);

const RichTextEditor = ({ value, onChange, placeholder, disabled }) => {
    return (
        <div className="rich-text-editor-wrapper">
            <ReactQuill
                value={value || ""}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
            />
        </div>
    );
};

export default RichTextEditor;
