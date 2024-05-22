"use client";
import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Box,
  Rating,
  Paper,
  Stack,
  Button,
} from "@mui/material";
import Container from "@/components/global/Container/Container";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteRight } from "@fortawesome/free-solid-svg-icons";

interface PaginatedReviewResponse extends IReviewsResponse {
  hasMore: boolean;
}

const initialState: PaginatedReviewResponse = {
  reviews: [],
  ratings: [],
  averageRating: 0,
  totalRating: 0,
  hasMore: true,
};

export default function Testimoni() {
  const [reviews, setReviews] = useState<PaginatedReviewResponse>(initialState);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 8;

  useEffect(() => {
    async function getReviews() {
      try {
        setIsLoading(true);
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/v1/order-review?limit=${limit}&page=${page}`,
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        const response = await req.json();
        setIsLoading(false);
        setReviews((prev) => ({
          ...prev,
          reviews: [...prev.reviews, ...response.reviews],
          ratings: response.ratings,
          averageRating: response.averageRating,
          totalRating: response.totalRating,
          hasMore: response.reviews.length === limit,
        }));
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching order:", error);
      }
    }

    getReviews();
  }, [page]);

  return (
    <Box sx={{ backgroundColor: "#fff1f2" }}>
      <Container className="py-20">
        <Box>
          <Typography
            variant="h4"
            color="#b72025"
            textAlign="center"
            sx={{ fontSize: "2rem", fontWeight: 700, marginBottom: 4 }}
          >
            Testimoni Gasskeun Topup
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: "1.1rem",
              textAlign: "center",
              maxWidth: "40rem",
              margin: "auto",
            }}
          >
            Terimakasih kepada para pelanggan yang sudah mempercayakan gasskeun
            topup sebagai tempat topup digital item mereka
          </Typography>

          <Grid container spacing={6} mt={12}>
            {reviews.reviews.map((review, index) => (
              <Grid item xs={12} sm={6} md={4} xl={3} key={index}>
                <Paper
                  elevation={1}
                  sx={{ padding: 6, borderRadius: 2, height: "100%" }}
                >
                  <Box textAlign="center">
                    <FontAwesomeIcon
                      icon={faQuoteRight}
                      color="#b72025"
                      fontSize={"2.5rem"}
                    />
                  </Box>

                  {/* Comment */}
                  <Typography
                    variant="body1"
                    fontSize={{ xs: "0.85rem", lg: "1rem" }}
                    textAlign="center"
                    marginY="1rem"
                  >
                    <i>~{review.message}~</i>
                  </Typography>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    flexWrap="wrap"
                  >
                    <Typography
                      fontSize={{
                        xs: "0.9rem",
                        lg: "0.95rem",
                        color: "#b72025",
                      }}
                    >
                      {review.mobileNumber}
                    </Typography>
                    <Rating
                      value={Number(review.rating)}
                      precision={0.5}
                      readOnly
                      size="small"
                    />
                  </Stack>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    flexWrap="wrap"
                    gap={2}
                  >
                    <Typography
                      fontSize={{ xs: "0.7rem", lg: "0.75rem" }}
                      textAlign="left"
                    >
                      {review.product}
                    </Typography>
                    <Typography fontSize={{ xs: "0.75rem", lg: "0.8rem" }}>
                      {dayjs(review.createdAt).format("YYYY-MM-DD")}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {reviews.hasMore && (
            <Stack direction="row" justifyContent="center" mt={8}>
              <Button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={isLoading}
                sx={{ textTransform: "none" }}
              >
                Muat Lebih Banyak
              </Button>
            </Stack>
          )}
        </Box>
      </Container>
    </Box>
  );
}
