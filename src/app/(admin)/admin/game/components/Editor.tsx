import React, { useState, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";

interface IEditor {
  value: string;
  setValue: (val: string) => void;
  typeForm: string;
}

function Editor(props: IEditor) {
  const { value, setValue, typeForm } = props;
  const reactQuillRef = useRef<any>(null);

  const handleChange = (html: string) => {
    setValue(html);
  };

  // const handleSubmit = () => {
  //   const editor = reactQuillRef?.current?.getEditor();
  //   setEditorHtml(editor);
  // };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
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
    <>
      <ReactQuill
        ref={reactQuillRef}
        onChange={handleChange}
        theme="snow"
        readOnly={typeForm === "detail"}
        className={`${
          typeForm === "detail"
            ? "cursor-not-allowed bg-gray-100"
            : "edit bg-primary-50 bg-opacity-100"
        } focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md mt-2 w-full`}
        modules={modules}
        formats={formats}
        value={value}
      />
    </>
  );
}

export default Editor;
