import React, { useState } from "react";
import Editor from "./Editor";

interface INewFormData {
  desc: string;
  keywords: [] | string[];
  categoryId: string;
  name: string;
  isPopular: boolean;
  slug: string;
  needServerId: boolean;
  typeServerId: string;
  type: string;
  voucherType: string;
  logoUrl: string;
  logoDenom: string;
  fileImageLogoUrl: any;
  fileImageLogoDenom: any;
}

interface IGameContent {
  title: string;
  description: string;
  faq: {
    question: string;
    answer: string;
  }[];
  fill: string;
}

interface IGameContentForm {
  typeForm: string;
  newData: INewFormData;
  setNewData: (args: any) => void;
  setGameContent: (args: any) => void;
  gameContent: IGameContent;
}

export default function GameContentForm(props: IGameContentForm) {
  const { typeForm, newData, setNewData, setGameContent, gameContent } = props;
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  function handleAddFAQ() {
    setGameContent((prev: IGameContent) => ({
      ...prev,
      faq: [...prev.faq, { question, answer }],
    }));
    setQuestion("");
    setAnswer("");
  }

  console.log(gameContent);

  return (
    <div>
      <div className="w-full mt-4">
        <label
          htmlFor="content-title"
          className="font-medium text-base text-neutral-900 inline-block"
        >
          Content Title
          {typeForm !== "detail" && (
            <span className="text-red-800 font-bold">*</span>
          )}
        </label>
        <div className="w-full mt-2">
          <input
            disabled={typeForm === "detail"}
            required
            type="text"
            name="name"
            id="content-title"
            placeholder="Content Title"
            autoComplete="off"
            value={gameContent.title}
            onChange={(e) => {
              setGameContent((prev: any) => ({
                ...prev,
                title: e.target.value,
              }));
            }}
            className={`${
              typeForm === "detail"
                ? "cursor-not-allowed bg-gray-100 border-none text-neutral-600"
                : "bg-primary-50 text-primary-900 bg-opacity-100 border border-solid border-primary-900 focus:bg-white focus:ring-0 focus:border-primary-900"
            } w-full py-3 px-4 rounded-md text-sm placeholder:text-sm overflow-hidden`}
          />
        </div>
      </div>

      <div className="w-full mt-4">
        <label
          htmlFor="content-description"
          className="font-medium text-base text-neutral-900 inline-block"
        >
          Content Description
          {typeForm !== "detail" && (
            <span className="text-red-800 font-bold">*</span>
          )}
        </label>
        <div className="w-full mt-2">
          <textarea
            disabled={typeForm === "detail"}
            required
            name="name"
            id="content-description"
            placeholder="Content Title"
            autoComplete="off"
            rows={5}
            value={gameContent.description}
            onChange={(e) => {
              setGameContent((prev: any) => ({
                ...prev,
                description: e.target.value,
              }));
            }}
            className={`${
              typeForm === "detail"
                ? "cursor-not-allowed bg-gray-100 border-none text-neutral-600"
                : "bg-primary-50 text-primary-900 bg-opacity-100 border border-solid border-primary-900 focus:bg-white focus:ring-0 focus:border-primary-900"
            } w-full py-3 px-4 rounded-md text-sm placeholder:text-sm overflow-hidden`}
          />
        </div>

        <div className="w-full mt-4">
          <p className="font-medium text-base text-neutral-900">
            FAQ
            {typeForm !== "detail" && (
              <span className="text-red-800 font-bold">*</span>
            )}
          </p>
          <label
            htmlFor="faq-question"
            className="text-sm text-neutral-800 inline-block mt-3 mb-1"
          >
            Question
          </label>
          <input
            disabled={typeForm === "detail"}
            required
            type="text"
            name="name"
            id="faq-question"
            placeholder="Type Question"
            autoComplete="off"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
            }}
            className={`${
              typeForm === "detail"
                ? "cursor-not-allowed bg-gray-100 border-none text-neutral-600"
                : "bg-primary-50 text-primary-900 bg-opacity-100 border border-solid border-primary-900 focus:bg-white focus:ring-0 focus:border-primary-900"
            } w-full py-3 px-4 rounded-md text-sm placeholder:text-sm overflow-hidden`}
          />

          <label
            htmlFor="faq-answer"
            className="text-sm text-neutral-800 inline-block mt-3"
          >
            Answer
          </label>
          <Editor value={answer} setValue={setAnswer} />
          <div className="text-right mt-4">
            <button
              onClick={handleAddFAQ}
              type="button"
              // disabled={disableButtonSubmit}
              className={`${
                // disableButtonSubmit
                false
                  ? "bg-opacity-50 cursor"
                  : "bg-opacity-100 hover:bg-red-600"
              } bg-primary-900 text-white font-medium w-max px-4 py-3 rounded-md transition-all text-right`}
            >
              Tambahkan Pertanyaan
            </button>
          </div>
        </div>

        <div className="w-full mt-4">
          <label
            htmlFor="content-fill"
            className="font-medium text-base text-neutral-900 inline-block"
          >
            Content FIll
            {typeForm !== "detail" && (
              <span className="text-red-800 font-bold">*</span>
            )}
          </label>
          <Editor
            value={gameContent.fill}
            setValue={function (value: React.SetStateAction<string>): void {
              setGameContent((prev: any) => ({
                ...prev,
                fill: value,
              }));
            }}
          />
        </div>
      </div>
    </div>
  );
}
