"use client";

import { whatsappTemplateState } from "@/atom/whatsappTemplateState";
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
    const [template, setTemplate] = useState<{ key: string; value: string }[]>([]);
    const [hoverStates, setHoverStates] = useState<boolean[]>(Array(listTemplate.length).fill(false));

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const addText = (addedText: string) => {
        if (textareaRef.current) {
            const textarea = textareaRef.current;
            const startPos = textarea.selectionStart || 0;
            const endPos = textarea.selectionEnd || 0;

            const currentText = textarea.value;
            const newText = currentText.substring(0, startPos) + addedText + currentText.substring(endPos);
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
        const request = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/whatsapp?withContent=true", {
            cache: "no-cache",
            method: "GET",
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        });

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
                render: res.message || "Ada kesalahan ketika menyimpan data baru, silahkan coba lagi",
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

    useEffect(() => {
        const oldContent = listTemplate.find((data) => data.id === preview);
        setDisabledButtonSave(oldContent?.content.replace(/\\n/g, "\n") === content);
    }, [content, preview]);

    useEffect(() => {
        if (preview) {
            const dataContent = listTemplate.find((data) => data.id === preview);
            if (dataContent && dataContent.content) {
                setContent(dataContent.content.replace(/\\n/g, "\n"));
            }
        }
        const dataTemplate = listTemplate.find((data) => data.id === preview)?.template;
        if (dataTemplate) {
            const newData = JSON.parse(dataTemplate);
            setTemplate(newData);
        }
    }, [preview]);

    return (
        <>
            {preview && (
                <div className="absolute top-0 left-0 right-0 h-screen bg-black bg-opacity-20 flex items-center justify-center z-10">
                    <div className="p-4 bg-white rounded-md w-1/2">
                        <h1 className="text-lg font-semibold pb-4 border-b-2">Template Pesan</h1>
                        <div className="w-full mt-5 flex space-x-3">
                            <textarea
                                disabled={false}
                                name="content"
                                id="content"
                                cols={30}
                                rows={10}
                                className="resize-none h-96 max-h-96 p-4 border w-3/4"
                                onChange={(e) => setContent(e.target.value.replace(/\\n/g, "\n"))}
                                ref={textareaRef}
                                value={content}
                            />
                            <div>
                                <h1 className="mb-2 font-semibold">Template Pesan</h1>
                                <div className="flex flex-col gap-2 h-96 max-h-96 overflow-auto p-2">
                                    <>
                                        {template.map((data) => (
                                            <button
                                                key={data.key}
                                                className="px-5 py-3 rounded-md border shadow"
                                                onClick={() => addText(`[${data.key}]`)}
                                                onDoubleClick={() =>
                                                    clearCommands(new RegExp(`\\[${data.key}\\]`, "g"))
                                                }
                                            >
                                                {data.value}
                                            </button>
                                        ))}
                                    </>
                                    <button
                                        className="mt-5 px-6 py-2 rounded-md border shadow bg-red-600 text-white"
                                        onClick={() => {
                                            const dataContent = listTemplate.find((data) => data.id === preview);
                                            if (dataContent && dataContent.content) {
                                                setContent(dataContent.content.replace(/\\n/g, "\n"));
                                            }
                                        }}
                                    >
                                        Revert
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 flex space-x-3 justify-end">
                            <button
                                className="px-5 py-3 bg-gray-300 hover:bg-gray-100 rounded-md shadow-md"
                                onClick={() => setPreview("")}
                            >
                                Cancel
                            </button>
                            <button
                                disabled={disabledButtonSave}
                                className={`px-5 py-3 rounded-md shadow-md bg-green-600 text-white hover:bg-green-400 ${
                                    disabledButtonSave && "opacity-50 hover:bg-green-600 cursor-not-allowed"
                                }`}
                                onClick={handleSaveNewTemplate}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="mt-5">
                <h1 className="text-xl font-semibold mb-4">Template Pesan Whatsapp</h1>
                <div className="flex w-full gap-2 flex-wrap">
                    {listTemplate.map((data, index) => (
                        <div
                            key={data.id}
                            className="w-1/4 select-none"
                            onMouseEnter={() => handleHover(index, true)}
                            onMouseLeave={() => handleHover(index, false)}
                        >
                            <div className="border-2 rounded-md shadow-md p-4 mb-4 aspect-square overflow-hidden w-full relative">
                                {hoverStates[index] && (
                                    <div className="bg-gray-800 absolute w-full top-0 left-0 h-full bg-opacity-50">
                                        <div className="flex justify-center items-center w-full h-full space-x-3">
                                            <button
                                                onClick={() => setPreview(data.id)}
                                                className="px-4 py-2 bg-green-400 rounded-md hover:bg-green-200 shadow shadow-gray-400"
                                            >
                                                Preview
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-xl font-semibold mb-2 truncate">{data.title}</h2>
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {data.content.replace(/\\n/g, "\n")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default TemplateMessage;
