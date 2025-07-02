import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Rating,
  CircularProgress,
  Button,
  CardContent,
  LinearProgress,
  Card,
  Stack,
} from "@mui/material";
import { faArrowRight, faPercentage } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProductCommentCard from "./ProductCommentCard";

const initialState: IReviewsResponse = {
  reviews: [],
  ratings: [],
  averageRating: 0,
  totalRating: 0,
};

type IRatingForm = {
  [key: number]: number;
};

function convertRatings(ratings: IRatingSummary[]) {
  const ratingsMap: IRatingForm = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  ratings.forEach((item) => {
    const rating = Math.floor(parseFloat(item.rating));
    ratingsMap[rating] += item.totalRating;
  });

  return Object.entries(ratingsMap)
    .map(([rating, totalRating]) => ({
      rating,
      totalRating,
    }))
    .reverse();
}

function ProductReview({ gameId }: { gameId: string }) {
  const [reviews, setReviews] = useState<IReviewsResponse>(initialState);
  const allReviews = convertRatings(reviews.ratings);

  useEffect(() => {
    async function getReviews() {
      try {
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/v1/order-review?gameId=${gameId}`,
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        const response = await req.json();
        setReviews(response);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    }

    getReviews();
  }, [gameId]);

  return (
    <Card
      sx={{
        bgcolor: "#161721",
        borderRadius: "0.75rem",
        px: 2,
        py: 4,
        textAlign: "center",
      }}
      elevation={1}
    >
      <CardContent>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "500",
              mb: 2,
              color: "#ffffff",
            }}
          >
            Ulasan Pengguna
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Stack
              alignItems="center"
              paddingX={3}
              paddingY={2}
              sx={{
                bgcolor: "#FFE4E5",
                borderRadius: "0.5rem",
                width: "max-content",
                margin: "0.5rem auto",
              }}
            >
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", ml: 2, fontSize: "2rem" }}
                color="#fb923ce6"
              >
                {reviews.averageRating?.toFixed(1) || 0}/5
              </Typography>
            </Stack>
            <Rating value={reviews.averageRating} precision={0.1} readOnly />
          </Box>
          {reviews.reviews.length > 0 ? (
            <Typography variant="body2" sx={{ mt: 1, color: "#fcfcfda8" }}>
              {reviews.totalRating} Ulasan
            </Typography>
          ) : (
            <Typography variant="body1" sx={{ mt: 1, color: "#fcfcfda8" }}>
              Belum ada ulasan
            </Typography>
          )}
          <Stack pt={6}>
            <ul style={{ width: "100%", listStyle: "none", padding: 0 }}>
              {allReviews.map(
                (item: { rating: string; totalRating: number }) => (
                  <li
                    key={item.rating}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "8px",
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Typography
                        variant="body2"
                        sx={{ flexGrow: 0, mr: 1, color: "#fcfcfda8" }}
                      >
                        {item.rating}
                      </Typography>
                      <Rating
                        value={1}
                        precision={1}
                        readOnly
                        max={1}
                        size="small"
                      />
                    </Stack>
                    <Box sx={{ width: { xs: "70%", sm: "80%", md: "60%" } }}>
                      <Box
                        sx={{
                          height: "8px",
                          borderRadius: "4px",
                        }}
                      >
                        <LinearProgress
                          variant="determinate"
                          value={(item.totalRating / reviews.totalRating) * 100}
                        />
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ color: "#fcfcfda8" }}>
                      {item.totalRating}
                    </Typography>
                  </li>
                )
              )}
            </ul>
          </Stack>

          {/* {reviews.reviews.length > 0 &&
            reviews.reviews.map((review: IReview) => (
              <ProductCommentCard review={review} key={review.createdAt} />
            ))}

          {reviews.reviews.length > 0 && (
            <Link href="/testimoni">
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                gap={4}
                width="max-content"
                margin="auto"
                color="#B72025"
                flexWrap="wrap"
                sx={{ mt: 3 }}
              >
                <Typography>Lihat semua</Typography>
                <FontAwesomeIcon icon={faArrowRight} />
              </Stack>
            </Link>
          )} */}
        </Box>
      </CardContent>
    </Card>
  );
}

export default ProductReview;
