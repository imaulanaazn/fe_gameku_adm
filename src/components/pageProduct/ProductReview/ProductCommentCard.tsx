import { Box, Typography, Rating, Button, Divider, Stack } from "@mui/material";
import dayjs from "dayjs";

function ProductCommentCard({ review }: { review: IReview }) {
  return (
    <>
      <Divider />
      <Box display="flex" flexDirection="column" gap={2} p={4}>
        {/* Profile and Rating */}
        <Stack direction="row" justifyContent="space-between" flexWrap="wrap">
          <Typography
            fontSize={{ xs: "0.9rem", lg: "0.95rem" }}
            fontWeight="600"
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

        {/* Comment */}
        <Typography fontSize={{ xs: "0.85rem", lg: "0.9rem" }} textAlign="left">
          <i>&quot;{review.message}&quot;</i>
        </Typography>

        {/* Date and Share Button */}
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
      </Box>
    </>
  );
}

export default ProductCommentCard;
