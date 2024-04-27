import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Rating,
  CircularProgress,
  Button,
  LinearProgress,
  Stack,
} from "@mui/material";
import { faArrowRight, faPercentage } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProductCommentCard from "./ProductCommentCard";

export interface IReview {
  message: string;
  rating: string;
  mobileNumber: string;
  product: string;
  createdAt: string;
}

export interface IRatingSummary {
  rating: string;
  totalRating: number;
}

export interface IReviewsResponse {
  reviews: IReview[];
  ratings: IRatingSummary[];
  averageRating: number;
  totalRating: number;
}

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
  const totalRatings = convertRatings(reviews.ratings);

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
    <Container
      maxWidth="sm"
      sx={{
        textAlign: "center",
        bgcolor: "white",
        boxShadow: 3,
        borderRadius: 2,
        px: 4,
        py: 6,
        marginTop: { xs: 15, sm: 6, md: 8 },
      }}
    >
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "500",
            mb: 2,
            color: "#1F2937",
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
              color="#B72025"
            >
              {reviews.averageRating || 0}/5
            </Typography>
          </Stack>
          <Rating value={reviews.averageRating} precision={0.1} readOnly />
        </Box>
        {reviews.reviews.length > 0 ? (
          <Typography variant="body2" sx={{ mt: 1 }}>
            {reviews.reviews.length} Ulasan
          </Typography>
        ) : (
          <Typography variant="body1" sx={{ mt: 1 }}>
            Belum ada ulasan
          </Typography>
        )}
        <Stack pt={6}>
          <ul style={{ width: "100%", listStyle: "none", padding: 0 }}>
            {totalRatings.map(
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
                    <Typography variant="body2" sx={{ flexGrow: 0, mr: 1 }}>
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
                  <Typography variant="body2">{item.totalRating}</Typography>
                </li>
              )
            )}
          </ul>
        </Stack>

        {reviews.reviews.length > 0 &&
          reviews.reviews.map((review: IReview) => (
            <ProductCommentCard review={review} key={review.createdAt} />
          ))}

        {reviews.reviews.length > 0 && (
          <Link href="/reviews">
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
        )}
      </Box>
    </Container>
  );
}

export default ProductReview;
