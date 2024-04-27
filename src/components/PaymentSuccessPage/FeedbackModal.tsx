"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Rating,
  Paper,
  TextField,
  Stack,
} from "@mui/material";
import { toast } from "react-toastify";

const templateComments = [
  "Pilihannya denomnya banyak",
  "Harganya Murah Banget",
  "Prosesnya Cepat Banget",
  "Pelayanannya terbaik",
];

export default function FeedbackModal({
  handleClose,
  orderId,
}: {
  handleClose: () => void;
  orderId?: string;
}) {
  const [rating, setRating] = React.useState<number | null>(5);

  // Define state for the input value and read-only status
  const [inputValue, setInputValue] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(false);

  const isReviewValid = !!rating && !!inputValue;

  // Handle template comment selection
  const handleChipClick = (comment: string, readOnly: boolean) => {
    setInputValue(comment);
    setIsReadOnly(readOnly);
  };

  // Handle input value change (only when not read-only)
  const handleInputChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    if (!isReadOnly) {
      setInputValue(event.target.value);
    }
  };

  async function handleReviewSubmit() {
    const data = {
      orderId,
      message: inputValue,
      rating,
    };

    const req = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/v1/order-review",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(data),
      }
    );

    if (req.status === 200) {
      toast.success("Terimakasih sudah memberikan review");
      handleClose();
    } else {
      const response = await req.json();
      toast.error(response.message);
    }
  }

  return (
    <Stack
      width={{ xs: "90vw", sm: "28rem" }}
      margin="auto"
      height="max-content"
      justifyContent="center"
      alignItems="center"
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          padding: { xs: "3rem 2rem", sm: "3rem", md: "3rem" },
          backgroundColor: "white",
          borderRadius: { xs: "0.75rem", md: "1rem" },
        }}
      >
        <Typography variant="h5" color="textPrimary" fontWeight="bold">
          Beri Kami Ulasan
        </Typography>
        <Typography variant="body1" color="textPrimary" mt="0.75rem" mb="1rem">
          Bagaimana pengalaman mu menggunakan layanan gasskeun top up pada
          transaksi ini?
        </Typography>
        <Box
          bgcolor="gray.200"
          display="flex"
          flexDirection="column"
          alignItems="center"
          width="100%"
        >
          {/* Rating */}
          <Box py={6} display="flex" flexDirection="column" alignItems="center">
            <Rating
              value={rating}
              precision={1}
              max={5}
              name="unique-rating"
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              size="large"
            />
          </Box>

          <Box display="flex" flexDirection="column" width="100%">
            <Box width="100%" overflow="auto" paddingBottom={2}>
              {/* Template comments as chips */}
              <Stack
                direction="row"
                flexWrap={{ xs: "nowrap", sm: "wrap" }}
                gap={2}
                justifyContent={{ xs: "flex-start", md: "center" }}
              >
                <Chip
                  label="isi sendiri"
                  clickable
                  onClick={() => handleChipClick("", false)}
                  color={
                    templateComments.includes(inputValue)
                      ? "default"
                      : "primary"
                  }
                />
                {templateComments.map((comment, index) => (
                  <Chip
                    key={index}
                    label={comment}
                    clickable
                    onClick={() => handleChipClick(comment, true)}
                    color={inputValue === comment ? "primary" : "default"}
                    sx={{ fontSize: "0.75rem" }}
                  />
                ))}
              </Stack>
            </Box>

            {/* Input field */}
            <TextField
              id="outlined-multiline-flexible"
              label="Message"
              multiline
              maxRows={3}
              value={inputValue}
              minRows={3}
              onChange={handleInputChange}
              placeholder="Write message"
              inputProps={{ readOnly: isReadOnly }}
              sx={{
                marginTop: "1rem",
                backgroundColor: "#FFE4E5",
                color: "primary.light",
                "& .MuiFormLabel-root": { color: "primary.light" },
                "& .MuiInputBase-input": { color: "primary.light" },
              }}
            />
          </Box>

          {/* Text area */}
          <Box display="flex" flexDirection="column">
            <Stack direction="row" gap={2}>
              <Button
                variant="text"
                color="primary"
                style={{ marginTop: "2rem" }}
                onClick={handleClose}
              >
                Batalkan
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: "2rem" }}
                disabled={!isReviewValid}
                onClick={handleReviewSubmit}
              >
                Kirim
              </Button>
            </Stack>
          </Box>
        </Box>
      </Paper>
    </Stack>
  );
}
