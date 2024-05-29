import {
  faChevronDown,
  faXmark,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Stack, Modal, Typography, Button } from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";

const instructions = [
  {
    id: 1,
    summary: "Collapsible Group Item #1",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.",
  },
  {
    id: 2,
    summary: "Collapsible Group Item #2",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget",
  },
  {
    id: 3,
    summary: "Collapsible Group Item #3",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget",
  },
];

interface IPaymentInstructionModalProps {
  setOpen: (bool: boolean) => void;
  open: boolean;
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
  // borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export default function PaymentInstructionModal(
  props: IPaymentInstructionModalProps
) {
  const [expanded, setExpanded] = React.useState<number | false>(1);

  const handleChange =
    (panel: number) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const { open, setOpen } = props;
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
              Instruksi Pembayaran
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
            {instructions.map((instruction) => (
              <Accordion
                key={instruction.id}
                expanded={expanded === instruction.id}
                onChange={handleChange(instruction.id)}
              >
                <AccordionSummary
                  aria-controls="panel1d-content"
                  id="panel1d-header"
                  sx={{ backgroundColor: "white" }}
                >
                  <Typography sx={{ color: "primary.main" }}>
                    {instruction.summary}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography fontSize={14} color="gray[A400]">
                    {instruction.details}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
