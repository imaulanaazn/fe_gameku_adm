import React from "react";
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

function ProductReview() {
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
          Ulasan Produk
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
              3.9/5
            </Typography>
          </Stack>
          <Rating value={3.9} precision={0.1} readOnly />
        </Box>
        <Typography variant="body2" sx={{ mt: 1 }}>
          40 ulasan pelanggan
        </Typography>
        <Stack pt={6}>
          <ul style={{ width: "100%", listStyle: "none", padding: 0 }}>
            {[
              { rating: 5, percentage: 40, color: "green" },
              { rating: 4, percentage: 30, color: "green" },
              { rating: 3, percentage: 15, color: "yellow" },
              { rating: 2, percentage: 10, color: "yellow" },
              { rating: 1, percentage: 5, color: "red" },
            ].map((item) => (
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
                      bgcolor: `${item.color}.500`,
                      borderRadius: "4px",
                    }}
                  >
                    <LinearProgress
                      variant="determinate"
                      value={item.percentage}
                    />
                  </Box>
                </Box>
                <Typography variant="body2">{item.percentage}%</Typography>
              </li>
            ))}
          </ul>
        </Stack>

        <ProductCommentCard />
        <ProductCommentCard />
        <ProductCommentCard />
        <ProductCommentCard />
        <ProductCommentCard />
        <ProductCommentCard />

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
      </Box>
    </Container>
  );
}

export default ProductReview;
