import React, { useState, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";

interface IEditor {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

function Editor(props: IEditor) {
  const { value, setValue } = props;
  const reactQuillRef = useRef<any>(null);

  const handleChange = (html: React.SetStateAction<string>) => {
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
      {/* <div dangerouslySetInnerHTML={{ __html: editorHtml }} /> */}
      <ReactQuill
        ref={reactQuillRef}
        onChange={handleChange}
        theme="snow"
        style={{
          minHeight: "25vh",
        }}
        modules={modules}
        formats={formats}
        value={value}
      />
    </>
  );
}

export default Editor;
