import React, { useRef, useState } from "react";
import Editor from "./Editor";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

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

enum FAQACTIONS {
  edit = "edit",
  tambah = "tambah",
}

export default function GameContentForm(props: IGameContentForm) {
  const { typeForm, newData, setNewData, setGameContent, gameContent } = props;
  const [faqAction, setFaqAction] = useState(FAQACTIONS.tambah);
  const faqEditIndex = useRef(0);
  const [faq, setFaq] = useState({ question: "", answer: "" });

  function handleFAQ() {
    if (faqAction === FAQACTIONS.tambah) {
      setGameContent((prev: IGameContent) => ({
        ...prev,
        faq: [...prev.faq, { question: faq.question, answer: faq.answer }],
      }));
      setFaq({ question: "", answer: "" });
    } else {
      const newFAQ = gameContent.faq;
      newFAQ[faqEditIndex.current] = { ...faq };
      setGameContent((prev: IGameContent) => ({ ...prev, faq: newFAQ }));
      setFaq({ question: "", answer: "" });
      setFaqAction(FAQACTIONS.tambah);
    }
  }

  function handleEditFAQ(accordionIndex: number) {
    faqEditIndex.current = accordionIndex;
    setFaqAction(FAQACTIONS.edit);
    setFaq({
      question: gameContent.faq[accordionIndex].question,
      answer: gameContent.faq[accordionIndex].answer,
    });
  }

  function handleDeleteFAQ(accordionIndex: number) {
    const newFaq = gameContent.faq.slice(0);

    if (accordionIndex > -1 && accordionIndex < newFaq.length) {
      newFaq.splice(accordionIndex, 1);
    }
    setGameContent((prev: IGameContent) => ({
      ...prev,
      faq: newFaq,
    }));
  }

  return (
    <div>
      <div className="w-full mt-5">
        <label
          htmlFor="content-title"
          className="font-medium text-base text-neutral-900 inline-block"
        >
          Content Title
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

      <div className="w-full mt-5">
        <label
          htmlFor="content-description"
          className="font-medium text-base text-neutral-900 inline-block"
        >
          Content Description
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

        <div className="w-full mt-5">
          <p className="font-medium text-base text-neutral-900">FAQ</p>
          {gameContent.faq.length > 0 &&
            gameContent.faq.map((faq, index) => (
              <Accordion
                key={faq.question}
                sx={{
                  boxShadow: "none",
                  marginTop: 2,
                }}
              >
                <AccordionSummary
                  expandIcon={<FontAwesomeIcon icon={faChevronDown} />}
                  aria-controls="panel3-content"
                  id="panel3-header"
                  sx={{
                    backgroundColor:
                      typeForm === "detail" ? "#f3f4f6" : "#FFF3F3",
                    color: typeForm !== "detail" ? "#B72025" : "#4b5563",
                    "& .MuiButtonBase-root": {
                      marginTop: 0,
                    },
                  }}
                >
                  {faq.question}
                </AccordionSummary>
                <AccordionDetails>
                  <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                </AccordionDetails>
                {typeForm !== "detail" && (
                  <AccordionActions>
                    <Button
                      sx={{ color: "#B72025" }}
                      onClick={() => {
                        handleEditFAQ(index);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      sx={{ color: "#B72025" }}
                      onClick={() => {
                        handleDeleteFAQ(index);
                      }}
                    >
                      Hapus
                    </Button>
                  </AccordionActions>
                )}
              </Accordion>
            ))}

          {typeForm !== "detail" && (
            <>
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
                value={faq.question}
                onChange={(e) => {
                  setFaq((prev) => ({ ...prev, question: e.target.value }));
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
              <Editor
                value={faq.answer}
                setValue={(value: string) => {
                  setFaq((prev) => ({ ...prev, answer: value }));
                }}
                typeForm={typeForm}
              />
              <div className="text-right mt-5">
                <button
                  onClick={handleFAQ}
                  type="button"
                  disabled={faq.answer && faq.question ? false : true}
                  className={`${
                    faq.answer && faq.question
                      ? "bg-opacity-100 hover:bg-red-600"
                      : "bg-opacity-50 cursor "
                  } bg-primary-900 text-white font-medium w-max px-4 py-3 rounded-md transition-all text-right`}
                >
                  {faqAction === FAQACTIONS.edit ? "Ubah FAQ" : "Tambahkan FAQ"}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="w-full mt-5">
          <label
            htmlFor="content-fill"
            className="font-medium text-base text-neutral-900 inline-block"
          >
            Content Fill
          </label>
          <Editor
            value={gameContent.fill}
            setValue={function (value: React.SetStateAction<string>): void {
              setGameContent((prev: any) => ({
                ...prev,
                fill: value,
              }));
            }}
            typeForm={typeForm}
          />
        </div>
      </div>
    </div>
  );
}
