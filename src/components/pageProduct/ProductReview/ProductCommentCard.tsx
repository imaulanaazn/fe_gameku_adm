import { Box, Typography, Rating, Button, Divider, Stack } from "@mui/material";

function ProductCommentCard() {
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
            088******234
          </Typography>
          <Rating value={4.5} precision={0.5} readOnly size="small" />
        </Stack>

        {/* Comment */}
        <Typography fontSize={{ xs: "0.85rem", lg: "0.9rem" }} textAlign="left">
          Gorgeous design! Even more responsive than the previous version. A
          pleasure to use!
        </Typography>

        {/* Date and Share Button */}
        <Stack
          direction="row"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={2}
        >
          <Typography
            fontSize={{ xs: "0.75rem", lg: "0.8rem" }}
            textAlign="left"
          >
            Pool Coda Bundle By 8 ball pool
          </Typography>
          <Typography fontSize={{ xs: "0.75rem", lg: "0.8rem" }}>
            Feb 13, 2021
          </Typography>
        </Stack>
      </Box>
    </>
  );
}

export default ProductCommentCard;
