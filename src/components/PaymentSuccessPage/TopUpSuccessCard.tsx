import { Box, Stack } from "@mui/system";
import React from "react";
import Container from "../global/Container/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { Typography, Divider, Button } from "@mui/material";
import dayjs from "dayjs";
import { currencyConverter } from "@/@core/utils/currencyConverter";
import Link from "next/link";

export default function TopUpSuccessCard(invoice: any) {
  return (
    <Container className="lg:my-20 bg-[#38e08b] lg:bg-white">
      <>
        <Stack
          sx={{
            width: "100%",
            textAlign: "center",
            marginBottom: "2rem",
            borderRadius: { xs: 0, md: "1rem" },
            padding: "1.5rem",
            display: { xs: "none", md: "flex" },
          }}
          gap={{ xs: 6, md: 8 }}
        >
          <FontAwesomeIcon
            icon={faCircleCheck}
            fontSize="6rem"
            className="text-[#38e08b] text-center"
          />
          <Typography variant="h4" color="#38e08b" fontWeight="600">
            TOP UP BERHASIL
          </Typography>
        </Stack>

        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          padding={{ xs: "4rem 0", sm: "8rem 4rem", md: "4rem" }}
          borderRadius="1rem"
          gap={{ xs: 12, md: 6 }}
          sx={{
            backgroundColor: "#38e08b",
          }}
        >
          <Stack
            sx={{
              textAlign: "center",
              display: { xs: "flex", md: "none" },
            }}
            gap={4}
          >
            <FontAwesomeIcon
              icon={faCircleCheck}
              fontSize="4rem"
              className="text-white text-center"
            />
            <Typography variant="h3" color="white" fontWeight="800">
              TOPUP BERHASIL
            </Typography>
          </Stack>
          <Box width={{ xs: "100%", md: "50%" }}>
            <Stack
              width="100%"
              maxWidth="28rem"
              marginX="auto"
              padding={{ xs: "2rem 1.25rem", md: "2rem" }}
              sx={{
                backgroundColor: "white",
                borderRadius: "0.75rem",
              }}
            >
              <Typography
                variant="h6"
                sx={{ marginBottom: "2rem", textAlign: "center" }}
              >
                Top Up {invoice.game}
              </Typography>

              <Box>
                <Typography variant="body1" fontWeight="500">
                  Item Detail
                </Typography>
                {invoice.detail?.userId && (
                  <Stack
                    direction="row"
                    margin="0.25rem 0"
                    justifyContent="space-between"
                  >
                    <Typography variant="body2" sx={{ fontWeight: 400 }}>
                      User ID
                    </Typography>
                    {invoice.detail?.userId && (
                      <Typography variant="body2" sx={{ fontWeight: 400 }}>
                        {invoice.detail?.userId}
                      </Typography>
                    )}
                  </Stack>
                )}
                {invoice.detail?.serverId && (
                  <Stack
                    direction="row"
                    margin="0.25rem 0"
                    justifyContent="space-between"
                  >
                    <Typography variant="body2" sx={{ fontWeight: 400 }}>
                      Server ID
                    </Typography>
                    {invoice.detail?.serverId && (
                      <Typography variant="body2" sx={{ fontWeight: 400 }}>
                        {invoice.detail?.serverId}
                      </Typography>
                    )}
                  </Stack>
                )}
                {invoice.detail?.username && (
                  <Stack
                    direction="row"
                    margin="0.25rem 0"
                    justifyContent="space-between"
                  >
                    <Typography variant="body2" sx={{ fontWeight: 400 }}>
                      Username
                    </Typography>
                    {invoice.detail?.username && (
                      <Typography variant="body2" sx={{ fontWeight: 400 }}>
                        {invoice.detail?.username}
                      </Typography>
                    )}
                  </Stack>
                )}
              </Box>

              <Box sx={{ marginTop: "0.5rem" }}>
                <Typography variant="body1" fontWeight="500">
                  Transaction Detail
                </Typography>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  margin="0.25rem 0"
                >
                  <Typography variant="body2">Nomor Invoice</Typography>
                  <Typography variant="body2">{invoice.invoiceId}</Typography>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  margin="0.25rem 0"
                >
                  <Typography variant="body2">Tanggal Order</Typography>
                  <Typography variant="body2">
                    {dayjs(invoice.createdAt).format("DD MMM YYYY")}
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  margin="0.25rem 0"
                >
                  <Typography variant="body2">Product</Typography>
                  <Typography variant="body2">{invoice.productName}</Typography>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  margin="0.25rem 0"
                >
                  <Typography variant="body2">Kuantitas</Typography>
                  <Typography variant="body2">{invoice.quantity}</Typography>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  margin="0.25rem 0"
                >
                  <Typography variant="body2">Sub Total</Typography>
                  <Typography variant="body2">
                    {invoice.detail?.amount && invoice.detail?.quantity
                      ? currencyConverter(
                          invoice.detail.amount * invoice.detail.quantity
                        )
                      : "N/A"}
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  margin="0.25rem 0"
                >
                  <Typography variant="body2">Biaya Admin</Typography>
                  <Typography variant="body2">
                    {currencyConverter(invoice.feeAmt)}
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  margin="0.25rem 0"
                >
                  <Typography variant="body2">Diskon</Typography>
                  <Typography variant="body2">
                    {currencyConverter(invoice.discAmt)}
                  </Typography>
                </Stack>
              </Box>

              <Divider variant="middle" />

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body1" fontWeight="500">
                  Total
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {currencyConverter(invoice.totalAmt)}
                </Typography>
              </Stack>
            </Stack>
          </Box>

          <Box sx={{ textAlign: "center" }} width={{ xs: "100%", md: "50%" }}>
            <Typography variant="h4" color="white">
              Terimakasih
            </Typography>
            <Typography color="white" marginY="1rem">
              Yaaay{" "}
              <Typography component="span" fontWeight={800} color="white">
                {" "}
                {invoice.productName}{" "}
              </Typography>{" "}
              berhasil dikirim ke akun{" "}
              <Typography component="span" fontWeight={800} color="white">
                {" "}
                {invoice.game}{" "}
              </Typography>{" "}
              anda Terimakasih telah menggunakan layanan gasskeun top up. kami
              harap anda puas dengan pelayanan kami
            </Typography>
            <Link href="/layanan">
              <Button
                sx={{
                  backgroundColor: "white",
                  color: "#38e08b",
                  "&:hover": {
                    backgroundColor: "aquamarine",
                    color: "white",
                  },
                }}
              >
                Topup Lagi
              </Button>
            </Link>
          </Box>
        </Stack>
      </>
    </Container>
  );
}
