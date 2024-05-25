"use client";

import NotFound from "@/app/(user)/[productKey]/not-found";
import Container from "@/components/global/Container/Container";
import {
  Typography,
  Box,
  Stack,
  Button,
  Grid,
  Avatar,
  Modal,
  Chip,
  Paper,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Divider from "@mui/material/Divider";
import { currencyConverter } from "@/@core/utils/currencyConverter";
import dayjs from "dayjs";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { OrderStatuses } from "@/enum";
import FeedbackModal from "@/components/PaymentSuccessPage/FeedbackModal";
import Loading from "./loading";

interface IParams {
  params: {
    invoiceId: string;
  };
}

export default function PaymentSuccess({ params }: IParams) {
  const [invoice, setInvoice] = useState<IInvoice | null>();
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const getInvoice = async () => {
      setIsLoading(true);
      try {
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/v2/order-detail/${params.invoiceId}`,
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
            credentials: "include",
          }
        );

        if (req.status === 404) {
          setInvoice(null);
        } else {
          const res = await req.json();
          setInvoice(res);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching order:", error);
        setIsLoading(false);
      }
    };
    getInvoice();
  }, []);

  if (isLoading) {
    return <Loading />;
  } else if (!isLoading && !invoice) {
    return <NotFound />;
  } else if (!isLoading && invoice?.order.status !== OrderStatuses.SUCCESS) {
    return <NotFound />;
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ display: "flex" }}
      >
        <FeedbackModal
          handleClose={handleClose}
          orderId={invoice?.order.invoiceId}
        />
      </Modal>

      <Box sx={{ backgroundColor: "#38e08b" }}>
        <Container>
          <Stack
            direction={{ xs: "column-reverse", md: "row" }}
            justifyContent="space-between"
            alignItems="center"
            paddingY={{
              xs: "4rem",
              lg: "5rem",
              xl: "8rem",
            }}
            borderRadius="1rem"
            gap={{ xs: 12, md: 6 }}
            sx={{
              backgroundColor: "#38e08b",
            }}
          >
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
                  Top Up {invoice?.game.name}
                </Typography>

                <Box>
                  <Typography variant="body1" fontWeight="500">
                    Item Detail
                  </Typography>
                  {invoice?.order?.userId && (
                    <Stack
                      direction="row"
                      margin="0.25rem 0"
                      justifyContent="space-between"
                    >
                      <Typography variant="body2" sx={{ fontWeight: 400 }}>
                        User ID
                      </Typography>
                      {invoice?.order?.userId && (
                        <Typography variant="body2" sx={{ fontWeight: 400 }}>
                          {invoice?.order?.userId}
                        </Typography>
                      )}
                    </Stack>
                  )}
                  {invoice?.order?.serverId && (
                    <Stack
                      direction="row"
                      margin="0.25rem 0"
                      justifyContent="space-between"
                    >
                      <Typography variant="body2" sx={{ fontWeight: 400 }}>
                        Server ID
                      </Typography>
                      {invoice?.order?.serverId && (
                        <Typography variant="body2" sx={{ fontWeight: 400 }}>
                          {invoice?.order?.serverId}
                        </Typography>
                      )}
                    </Stack>
                  )}
                  {invoice?.order?.username && (
                    <Stack
                      direction="row"
                      margin="0.25rem 0"
                      justifyContent="space-between"
                    >
                      <Typography variant="body2" sx={{ fontWeight: 400 }}>
                        Username
                      </Typography>
                      {invoice?.order?.username && (
                        <Typography variant="body2" sx={{ fontWeight: 400 }}>
                          {invoice?.order?.username}
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
                    <Typography variant="body2">
                      {invoice?.order.invoiceId}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    margin="0.25rem 0"
                  >
                    <Typography variant="body2">Tanggal Order</Typography>
                    <Typography variant="body2">
                      {dayjs(invoice?.order.createdAt).format("DD MMM YYYY")}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    margin="0.25rem 0"
                  >
                    <Typography variant="body2">Product</Typography>
                    <Typography variant="body2">
                      {invoice?.product.name}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    margin="0.25rem 0"
                  >
                    <Typography variant="body2">Kuantitas</Typography>
                    <Typography variant="body2">
                      {invoice?.order.quantity}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    margin="0.25rem 0"
                  >
                    <Typography variant="body2">Sub Total</Typography>
                    <Typography variant="body2">
                      {invoice?.order?.amount && invoice?.order?.quantity
                        ? currencyConverter(
                            invoice?.order.amount * invoice?.order.quantity
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
                      {invoice?.order.feeAmt &&
                        currencyConverter(invoice?.order.feeAmt)}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    margin="0.25rem 0"
                  >
                    <Typography variant="body2">Diskon</Typography>
                    <Typography variant="body2">
                      {invoice?.order.discAmt &&
                        currencyConverter(invoice?.order.discAmt)}
                    </Typography>
                  </Stack>
                </Box>

                <Divider variant="middle" />

                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body1" fontWeight="500">
                    Total
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {invoice?.order.totalAmt &&
                      currencyConverter(invoice?.order.totalAmt)}
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            <Box sx={{ textAlign: "center" }} width={{ xs: "100%", md: "50%" }}>
              <Stack gap={4} justifyContent="center" alignItems="center">
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  fontSize="4rem"
                  className="text-white text-center"
                />
                <Typography variant="h4" fontWeight="600" color="white">
                  Topup Berhasil
                </Typography>
              </Stack>
              <Typography color="white" marginY="1rem">
                Yaaay{" "}
                <Typography component="span" fontWeight={800} color="white">
                  {" "}
                  {invoice?.product.name}{" "}
                </Typography>{" "}
                berhasil dikirim ke akun{" "}
                <Typography component="span" fontWeight={800} color="white">
                  {" "}
                  {invoice?.game.name}{" "}
                </Typography>{" "}
                anda Terimakasih telah menggunakan layanan gasskeun top up. kami
                harap anda puas dengan pelayanan kami
              </Typography>
              <Stack direction="row" gap={4} justifyContent={"center"}>
                <Button
                  onClick={handleOpen}
                  sx={{
                    backgroundColor: "white",
                    color: "#38e08b",
                    "&:hover": {
                      backgroundColor: "aquamarine",
                      color: "white",
                    },
                  }}
                >
                  Beri Ulasan
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>

      <Box sx={{ backgroundColor: "#FFF3F3", paddingY: { xs: 16, md: 20 } }}>
        <Container>
          <>
            <Typography
              variant="h4"
              textAlign="center"
              marginBottom={{ xs: "1rem", md: "2rem" }}
              sx={{ color: "#374151" }}
            >
              Invoice
            </Typography>
            <Grid container spacing={6}>
              {invoice && (
                <>
                  <Grid item xs={12} md={7}>
                    <Stack spacing={6}>
                      <Paper
                        sx={{
                          position: "relative",
                          padding: 6,
                          borderRadius: 2,
                        }}
                        elevation={0}
                      >
                        <Box
                          sx={{
                            marginBottom: 4,
                            backgroundColor: "#FFE4E5",
                            padding: 4,
                            borderRadius: 1,
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 600, color: "#B72025" }}
                          >
                            Informasi Produk
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              gap: 4,
                              alignItems: "center",
                            }}
                          >
                            <Avatar
                              src={invoice.game.logoUrl}
                              variant="rounded"
                              sx={{ width: 50, height: 50 }}
                            />
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  letterSpacing: "0.25px",
                                  fontWeight: 600,
                                  marginTop: 1.5,
                                }}
                              >
                                {invoice.product.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  letterSpacing: "0.25px",
                                  fontWeight: 600,
                                  marginTop: 1.5,
                                }}
                              >
                                {invoice.game.name}
                              </Typography>
                            </Box>
                          </Box>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                color: "gray",
                                marginTop: 1.5,
                              }}
                            >
                              Total
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, marginTop: 1.5 }}
                            >
                              {currencyConverter(invoice.order.totalAmt)}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ marginTop: 4 }}>
                          {(invoice.order?.userId ||
                            invoice.order?.serverId ||
                            invoice.order?.username) && (
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 600, color: "#374151" }}
                            >
                              Data game :
                            </Typography>
                          )}
                        </Box>

                        <Box>
                          {invoice?.order?.userId && (
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 500, marginTop: 2 }}
                              >
                                User ID
                              </Typography>
                              {invoice?.order?.userId && (
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 500, marginTop: 2 }}
                                >
                                  {invoice?.order?.userId}
                                </Typography>
                              )}
                            </Stack>
                          )}
                          {invoice?.order?.serverId && (
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 500, marginTop: 2 }}
                              >
                                Server ID
                              </Typography>
                              {invoice?.order?.serverId && (
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 500, marginTop: 2 }}
                                >
                                  {invoice?.order?.serverId}
                                </Typography>
                              )}
                            </Stack>
                          )}
                          {invoice?.order?.username && (
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 500, marginTop: 2 }}
                              >
                                Username
                              </Typography>
                              {invoice?.order?.username && (
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 500, marginTop: 2 }}
                                >
                                  {invoice?.order?.username}
                                </Typography>
                              )}
                            </Stack>
                          )}
                        </Box>
                      </Paper>

                      <Paper
                        sx={{
                          position: "relative",
                          padding: 6,
                          borderRadius: 2,
                        }}
                        elevation={0}
                      >
                        <Box
                          sx={{
                            marginBottom: 4,
                            backgroundColor: "#FFE4E5",
                            padding: 4,
                            borderRadius: 1,
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 600, color: "#B72025" }}
                          >
                            Informasi Pesanan
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {invoice.product.name}
                          </Typography>
                          <Typography variant="body2">
                            {currencyConverter(
                              invoice.order ? invoice.order.amount : 0
                            )}
                          </Typography>
                        </Box>
                        <Divider />
                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="body2">Kuantitas</Typography>
                          <Typography variant="body2">
                            {invoice.order?.quantity}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: 2,
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 400 }}>
                            Subtotal
                          </Typography>
                          <Typography variant="body2">
                            {invoice.order?.amount && invoice.order?.quantity
                              ? currencyConverter(
                                  invoice.order.amount * invoice.order.quantity
                                )
                              : "N/A"}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: 2,
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 400 }}>
                            Biaya Admin
                          </Typography>
                          <Typography variant="body2">
                            {currencyConverter(invoice.order.feeAmt)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: 2,
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 400 }}>
                            Diskon
                          </Typography>
                          <Typography variant="body2">
                            {currencyConverter(invoice.order.discAmt)}
                          </Typography>
                        </Box>
                        <Divider />
                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: 2,
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 600, color: "#374151" }}
                          >
                            Total
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 600, color: "#374151" }}
                          >
                            {currencyConverter(invoice.order.totalAmt)}
                          </Typography>
                        </Box>
                      </Paper>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <Stack spacing={6}>
                      <Paper
                        sx={{
                          position: "relative",
                          padding: 6,
                          borderRadius: 2,
                        }}
                        elevation={0}
                      >
                        <Box
                          sx={{
                            marginBottom: 4,
                            backgroundColor: "#FFE4E5",
                            padding: 4,
                            borderRadius: 1,
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 600, color: "#B72025" }}
                          >
                            Informasi Pembayaran
                          </Typography>
                        </Box>
                        <Box>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            sx={{ marginBottom: 2 }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              Status
                            </Typography>
                            <Chip
                              label="Berhasil"
                              sx={{
                                backgroundColor: "#38e08b",
                                color: "white",
                                fontWeight: 600,
                              }}
                            />
                          </Stack>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            sx={{ marginBottom: 2 }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              Nomor Invoice
                            </Typography>
                            <Typography
                              noWrap
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              {invoice.order.invoiceId}
                            </Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            sx={{ marginBottom: 2 }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              Tanggal Order
                            </Typography>
                            <Typography
                              noWrap
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              {dayjs(invoice.order.createdAt).format(
                                "DD MMM YYYY HH:mm:ss"
                              )}
                            </Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            sx={{ marginBottom: 2 }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              Metode Pembayaran
                            </Typography>
                            <Typography
                              noWrap
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              {invoice.payment.name}
                            </Typography>
                          </Stack>
                          {invoice.payment.cd === "ID_OVO" && (
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              sx={{ marginBottom: 2 }}
                            >
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 500 }}
                              >
                                Nomor OVO
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 500 }}
                              >
                                {"mobileNumber" in invoice.payment.action &&
                                  invoice.payment.action.mobileNumber.replace(
                                    "+62",
                                    "0"
                                  )}
                              </Typography>
                            </Stack>
                          )}
                          {invoice.payment.cd === "ID_JENIUSPAY" && (
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              sx={{ marginBottom: 2 }}
                            >
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 500 }}
                              >
                                Nomor OVO
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 500 }}
                              >
                                {"cashtag" in invoice.payment.action &&
                                  invoice.payment.action.cashtag}
                              </Typography>
                            </Stack>
                          )}
                        </Box>
                      </Paper>
                    </Stack>
                  </Grid>
                </>
              )}
            </Grid>
          </>
        </Container>
      </Box>
    </>
  );
}
