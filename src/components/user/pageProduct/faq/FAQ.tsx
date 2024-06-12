import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Typography,
  CardHeader,
} from "@mui/material";
import React, { useState } from "react";

const initialFaqs = [
  {
    summary: "Accordion 1",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.",
  },
  {
    summary: "Accordion 2",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.",
  },
  {
    summary: "Accordion 3",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.",
  },
];

export default function FAQ() {
  const [faqs, setFaqs] = useState(initialFaqs);

  return (
    <Card
      sx={{
        bgcolor: "white",
        borderRadius: "0.75rem",
        px: 2,
        py: 4,
      }}
      elevation={1}
    >
      <CardHeader
        title="Paling Sering Ditanyakan"
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            textAlign: "center",
            lineHeight: "2rem !important",
            letterSpacing: "0.15px !important",
            color: "#1F2937",
          },
        }}
      />
      <CardContent>
        <Box>
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              sx={{ "&.MuiPaper-root": { boxShadow: "none" } }}
            >
              <AccordionSummary
                expandIcon={<FontAwesomeIcon icon={faChevronDown} />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Typography>{faq.summary}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: "#FFE4E5" }}>
                <Typography
                  paddingTop={4}
                  sx={{ color: "#4B5563", fontSize: 15 }}
                >
                  {faq.details}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
