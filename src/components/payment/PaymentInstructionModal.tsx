import {
  faChevronDown,
  faXmark,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Stack, Modal, Typography, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";

interface IPaymentInstructionModalProps {
  setOpen: (bool: boolean) => void;
  open: boolean;
  paymentGuide: string | null;
  paymentName: string;
}

interface IInstruction {
  summary: string;
  content: string;
}

const parseHTMLStringToArray = (htmlString: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const resultArray: IInstruction[] = [];

  const headings = doc.querySelectorAll("h2");
  headings.forEach((heading) => {
    const nextElement = heading.nextElementSibling;
    if (
      nextElement &&
      (nextElement.tagName === "OL" || nextElement.tagName === "UL")
    ) {
      resultArray.push({
        summary: heading.outerHTML,
        content: nextElement.outerHTML,
      });
    }
  });

  return resultArray;
};

export default function PaymentInstructionModal(
  props: IPaymentInstructionModalProps
) {
  const { open, setOpen, paymentGuide, paymentName } = props;
  const [expanded, setExpanded] = React.useState<any | false>(1);
  const [data, setData] = useState<IInstruction[]>([]);

  useEffect(() => {
    const parsedData = parseHTMLStringToArray(paymentGuide || "");
    setData(parsedData);
  }, []);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const handleClose = () => setOpen(false);
  return (
    <Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "80%", md: "60%", lg: "50%", xl: "40%" },
            height: "max-content",
            bgcolor: "background.paper",
            p: { xs: 6, sm: 6, lg: 8 },
            borderRadius: { xs: 2, lg: 3 },
          }}
        >
          <Stack
            direction={"row"}
            gap={4}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              color="#374151"
              sx={{ fontSize: { xs: 18, md: 20 } }}
            >
              Instruksi Pembayaran {paymentName}
            </Typography>
            <Box
              onClick={handleClose}
              sx={{
                width: 30,
                height: 30,
                backgroundColor: "#FFE4E5",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            >
              <FontAwesomeIcon
                icon={faXmark}
                className="text-primary-900 text-xl"
              />
            </Box>
          </Stack>
          <Box mt={6}>
            {data.map((instruction: IInstruction, index: number) => (
              <Accordion
                defaultExpanded={index === 0 ? true : false}
                key={instruction.summary}
                expanded={expanded === instruction.summary}
                onChange={handleChange(instruction.summary)}
              >
                <AccordionSummary
                  aria-controls="panel1d-content"
                  id="panel1d-header"
                  sx={{ backgroundColor: "white" }}
                >
                  <Box
                    sx={{ color: "#374151" }}
                    dangerouslySetInnerHTML={{ __html: instruction.summary }}
                  ></Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    fontSize={14}
                    sx={{
                      paddingTop: 1,
                      "& > ul": {
                        marginTop: 4,
                        listStyleType: "disc",
                        listStylePosition: "inside",
                        "& > li": { color: "#374151" },
                      },
                      "& > ol": {
                        marginTop: 4,
                        listStyleType: "decimal",
                        listStylePosition: "inside",
                        "& > li": { color: "#374151" },
                      },
                    }}
                    dangerouslySetInnerHTML={{ __html: instruction.content }}
                  ></Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
  overflow: "hidden",
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={
      <FontAwesomeIcon icon={faChevronDown} className="text-primary-900" />
    }
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .5)",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: "#FFE4E5",
  boxShadow: "none",
}));
