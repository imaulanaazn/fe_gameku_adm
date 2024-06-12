import React, { useState, useRef, useCallback } from "react";
import "quill/dist/quill.snow.css";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(import("react-quill"), { ssr: false });

interface IEditor {
  value?: string;
  setValue: (val: string) => void;
  typeForm: string;
}

const Editor = React.memo((props: IEditor) => {
  const { value, setValue, typeForm } = props;

  const handleChange = useCallback(
    (html: string) => {
      setValue(html);
    },
    [setValue]
  );

  const modules = {
    toolbar: [
      [{ header: [2] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "imageBlot",
  ];

  return (
    <ReactQuill
      onChange={handleChange}
      theme="snow"
      readOnly={typeForm === "detail"}
      placeholder=""
      className={`${
        typeForm === "detail" ? "cursor-not-allowed bg-gray-100" : "edit"
      } focus:ring-gray-600 focus:outline-none rounded-md mt-2 w-full`}
      modules={modules}
      formats={formats}
      value={value}
    />
  );
});

Editor.displayName = "Editor";
export default Editor;
