"use client";

import { whatsappTemplateState } from "@/atom/whatsappTemplateState";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useRecoilState, useRecoilValue } from "recoil";

interface TemplateMessageProps {
  data: ITemplateMessage[];
}

const TemplateMessage = () => {
  const [listTemplate, setListTemplate] = useRecoilState(whatsappTemplateState);

  const [content, setContent] = useState("");
  const [preview, setPreview] = useState<string>("");
  const [disabledButtonSave, setDisabledButtonSave] = useState(true);
  const [template, setTemplate] = useState<{ key: string; value: string }[]>(
    []
  );
  const [hoverStates, setHoverStates] = useState<boolean[]>(
    Array(listTemplate.length).fill(false)
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const addText = (addedText: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const startPos = textarea.selectionStart || 0;
      const endPos = textarea.selectionEnd || 0;

      const currentText = textarea.value;
      const newText =
        currentText.substring(0, startPos) +
        addedText +
        currentText.substring(endPos);
      setContent(newText);

      const newSelectionPos = startPos + addedText.length;
      textarea.selectionStart = newSelectionPos;
      textarea.selectionEnd = newSelectionPos;
    }
  };

  const clearCommands = (pattern: RegExp) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const currentText = textarea.value;

      const newText = currentText.replace(pattern, "");

      setContent(newText);
    }
  };

  const handleHover = (index: number, isEnter: boolean) => {
    setHoverStates((prev) => {
      const duplicate = [...prev];
      duplicate[index] = isEnter;
      return duplicate;
    });
  };

  const getListTemplate = async () => {
    const request = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/whatsapp?withContent=true",
      {
        cache: "no-cache",
        method: "GET",
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    const res = await request.json();
    if (request.ok) {
      setListTemplate(res);
    }
  };

  const putTemplateWhatsapp = async () => {
    const toastId = toast.loading("Sedang Mengubah Template Whatsapp...");
    const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/whatsapp", {
      cache: "no-cache",
      method: "PUT",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({
        id: preview,
        content,
      }),
    });

    if (req.ok) {
      toast.update(toastId, {
        render: "Berhasil mengubah template whatsapp",
        type: "success",
        isLoading: false,
        position: "top-right",
        autoClose: 3000,
      });

      await getListTemplate();
    } else {
      const res = await req.json();
      toast.update(toastId, {
        render:
          res.message ||
          "Ada kesalahan ketika menyimpan data baru, silahkan coba lagi",
        type: "error",
        isLoading: false,
        position: "top-right",
        autoClose: 3000,
      });
    }

    setPreview("");
  };

  const handleSaveNewTemplate = () => {
    putTemplateWhatsapp();
  };

  function truncate(text: string, maxLength: number, suffix = "...") {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength - suffix.length) + suffix;
  }

  useEffect(() => {
    const oldContent = listTemplate.find((data) => data.id === preview);
    setDisabledButtonSave(
      oldContent?.content.replace(/\\n/g, "\n") === content
    );
  }, [content, preview]);

  useEffect(() => {
    if (preview) {
      const dataContent = listTemplate.find((data) => data.id === preview);
      if (dataContent && dataContent.content) {
        setContent(dataContent.content.replace(/\\n/g, "\n"));
      }
    }
    const dataTemplate = listTemplate.find(
      (data) => data.id === preview
    )?.template;
    if (dataTemplate) {
      const newData = JSON.parse(dataTemplate);
      setTemplate(newData);
    }
  }, [preview]);

  return (
    <>
      {preview && (
        <div className="fixed top-0 left-0 right-0 h-screen bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="p-6 bg-white rounded-xl w-2/3">
            <h1 className="mb-4 font-medium text-xl md:text-2xl text-neutral-800">
              Template Pesan
            </h1>
            <div className="w-full mt-5 flex space-x-3">
              <textarea
                disabled={false}
                name="content"
                id="content"
                cols={30}
                rows={10}
                className="resize-none h-[30rem] max-h-[30rem] p-4 w-3/4 bg-rose-50 border-none rounded-lg text-neutral-800"
                onChange={(e) =>
                  setContent(e.target.value.replace(/\\n/g, "\n"))
                }
                ref={textareaRef}
                value={content}
              />
              <div className="w-1/4">
                <div className="flex flex-col gap-2 h-[30rem] max-h-[30rem] p-2">
                  <div className="flex flex-col gap-2 h-3/4 max-h-3/5 overflow-auto">
                    {template.map((data) => (
                      <>
                        <button
                          key={data.key}
                          className="px-5 py-3 rounded-md border border-primary-900 text-primary-900 hover:bg-primary-100 hover:border-white transition-all flex flex-wrap gap-2 items-center justify-between"
                          onClick={() => addText(`[${data.key}]`)}
                          onDoubleClick={() =>
                            clearCommands(new RegExp(`\\[${data.key}\\]`, "g"))
                          }
                        >
                          {data.value}
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </>
                    ))}
                  </div>
                  <button
                    className="mt-5 py-2 bg-primary-600 px-4 text-center border rounded-md hover:bg-primary-900 text-white font-medium"
                    onClick={() => {
                      const dataContent = listTemplate.find(
                        (data) => data.id === preview
                      );
                      if (dataContent && dataContent.content) {
                        setContent(dataContent.content.replace(/\\n/g, "\n"));
                      }
                    }}
                  >
                    Revert
                  </button>
                  <div className="flex justify-between gap-2">
                    <button
                      className="flex-1 py-2 bg-primary-600 px-4 text-center border rounded-md hover:bg-primary-900 text-white font-medium"
                      onClick={() => setPreview("")}
                    >
                      Cancel
                    </button>
                    <button
                      disabled={disabledButtonSave}
                      className={`flex-1 py-2 bg-emerald-500 text-white px-4 text-center border rounded-md hover:bg-emerald-600 text-white font-medium ${
                        disabledButtonSave &&
                        "opacity-50 hover:bg-green-600 cursor-not-allowed"
                      }`}
                      onClick={handleSaveNewTemplate}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mt-6 lg:mt-8">
        <h1 className="mb-4 font-medium text-xl md:text-2xl text-neutral-800">
          Template Pesan Whatsapp
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-auto w-full gap-6 lg:gap-8 flex-wrap">
          {listTemplate.map((data, index) => (
            <div
              key={data.id}
              className="w-full h-full flex flex-col gap-4 justify-between select-none rounded-xl shadow-md p-4 lg:p-6"
            >
              <div>
                <h2 className="text-lg font-medium mb-2 truncate text-neutral-700">
                  {data.title}
                </h2>
                <p className="text-neutral-500 whitespace-pre-wrap">
                  {truncate(data.content.replace(/\\n/g, "\n"), 300)}
                </p>
              </div>
              <button
                onClick={() => setPreview(data.id)}
                className="w-max bg-primary-900 text-white px-4 py-2 text-center border rounded-md hover:bg-rose-900 text-white font-medium"
              >
                Preview
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TemplateMessage;
