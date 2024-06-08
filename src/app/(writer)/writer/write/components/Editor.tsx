"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import EditorToolbar from "./EditorToolbar";
import ReactQuill, { Quill } from "react-quill";

const Size = Quill.import("formats/size");
Size.whitelist = ["extra-small", "small", "medium", "large"];
Quill.register(Size, true);

// Undo and redo functions for Custom Toolbar
function undoChange(this: { quill: any; undo: () => void; redo: () => void }) {
  this.quill.history.undo();
}
function redoChange(this: { quill: any; undo: () => void; redo: () => void }) {
  this.quill.history.redo();
}

export const formats = [
  "header",
  "size",
  "bold",
  "italic",
  "underline",
  "align",
  "strike",
  "script",
  "blockquote",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "color",
];

interface IEditorProps {
  setValue: (val: string) => void;
  value: string;
}

const Editor: React.FC<IEditorProps> = (props: IEditorProps) => {
  const { setValue, value } = props;
  const reactQuillRef = useRef<ReactQuill>(null);
  const [isClient, setIsClient] = useState(false);

  const handleChange = useCallback((value: string) => {
    setValue(value);
  }, []);

  useEffect(() => {
    setIsClient(true); // Set to true when the component is mounted on the client side
  }, []);

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        const file = input.files[0];
        const url = await uploadToCloudinary(file);
        const quill = reactQuillRef.current;
        if (quill) {
          const range = quill.getEditorSelection();
          range && quill.getEditor().insertEmbed(range.index, "image", url);
        }
      }
    };
  }, []);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(
      "https://api.imgbb.com/1/upload?key=901e7a98389326cac9ca985a414dc583",
      {
        method: "POST",
        body: formData,
      }
    );
    const result = await res.json();
    const url = result.data.url || "";

    return url;
  };

  const modules = {
    toolbar: {
      container: "#toolbar",
      handlers: {
        undo: undoChange,
        redo: redoChange,
        image: imageHandler,
      },
    },
    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true,
    },
  };

  if (!isClient) {
    return null; // Render nothing on the server
  }

  return (
    <div>
      <EditorToolbar />
      <ReactQuill
        ref={reactQuillRef}
        value={value}
        onChange={handleChange}
        placeholder={"Write content"}
        modules={modules}
        formats={formats}
        className="h-[85vh]"
      />
    </div>
  );
};

Editor.displayName = "Editor";
export default Editor;
