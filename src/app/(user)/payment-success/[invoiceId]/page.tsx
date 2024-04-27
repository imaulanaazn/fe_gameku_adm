"use client";

import NotFound from "@/app/(user)/[productKey]/not-found";
import Container from "@/components/global/Container/Container";
import sendRequest from "@/lib/baseApi";
import {
  Typography,
  Box,
  Stack,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Modal,
  Chip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Divider from "@mui/material/Divider";
import Link from "next/link";
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
          `${process.env.NEXT_PUBLIC_BASE_URL}/v1/order-detail/${params.invoiceId}`,
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
  } else if (!isLoading && invoice?.status !== OrderStatuses.SUCCESS) {
    return <NotFound />;
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <FeedbackModal handleClose={handleClose} orderId={invoice?.id} />
      </Modal>

      <Container className="lg:my-20 bg-[#38e08b] lg:bg-white">
        <Stack
          direction={{ xs: "column-reverse", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          padding={{ xs: "4rem 0", sm: "8rem 4rem", md: "4rem" }}
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
                Top Up {invoice?.game}
              </Typography>

              <Box>
                <Typography variant="body1" fontWeight="500">
                  Item Detail
                </Typography>
                {invoice?.detail?.userId && (
                  <Stack
                    direction="row"
                    margin="0.25rem 0"
                    justifyContent="space-between"
                  >
                    <Typography variant="body2" sx={{ fontWeight: 400 }}>
                      User ID
                    </Typography>
                    {invoice?.detail?.userId && (
                      <Typography variant="body2" sx={{ fontWeight: 400 }}>
                        {invoice?.detail?.userId}
                      </Typography>
                    )}
                  </Stack>
                )}
                {invoice?.detail?.serverId && (
                  <Stack
                    direction="row"
                    margin="0.25rem 0"
                    justifyContent="space-between"
                  >
                    <Typography variant="body2" sx={{ fontWeight: 400 }}>
                      Server ID
                    </Typography>
                    {invoice?.detail?.serverId && (
                      <Typography variant="body2" sx={{ fontWeight: 400 }}>
                        {invoice?.detail?.serverId}
                      </Typography>
                    )}
                  </Stack>
                )}
                {invoice?.detail?.username && (
                  <Stack
                    direction="row"
                    margin="0.25rem 0"
                    justifyContent="space-between"
                  >
                    <Typography variant="body2" sx={{ fontWeight: 400 }}>
                      Username
                    </Typography>
                    {invoice?.detail?.username && (
                      <Typography variant="body2" sx={{ fontWeight: 400 }}>
                        {invoice?.detail?.username}
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
                  <Typography variant="body2">{invoice?.invoiceId}</Typography>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  margin="0.25rem 0"
                >
                  <Typography variant="body2">Tanggal Order</Typography>
                  <Typography variant="body2">
                    {dayjs(invoice?.createdAt).format("DD MMM YYYY")}
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  margin="0.25rem 0"
                >
                  <Typography variant="body2">Product</Typography>
                  <Typography variant="body2">
                    {invoice?.productName}
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  margin="0.25rem 0"
                >
                  <Typography variant="body2">Kuantitas</Typography>
                  <Typography variant="body2">{invoice?.quantity}</Typography>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  margin="0.25rem 0"
                >
                  <Typography variant="body2">Sub Total</Typography>
                  <Typography variant="body2">
                    {invoice?.detail?.amount && invoice?.detail?.quantity
                      ? currencyConverter(
                          invoice?.detail.amount * invoice?.detail.quantity
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
                    {invoice?.feeAmt && currencyConverter(invoice?.feeAmt)}
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  margin="0.25rem 0"
                >
                  <Typography variant="body2">Diskon</Typography>
                  <Typography variant="body2">
                    {invoice?.discAmt && currencyConverter(invoice?.discAmt)}
                  </Typography>
                </Stack>
              </Box>

              <Divider variant="middle" />

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body1" fontWeight="500">
                  Total
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {invoice?.totalAmt && currencyConverter(invoice?.totalAmt)}
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
                {invoice?.productName}{" "}
              </Typography>{" "}
              berhasil dikirim ke akun{" "}
              <Typography component="span" fontWeight={800} color="white">
                {" "}
                {invoice?.game}{" "}
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

      <Container className="my-16 lg:my-20">
        <>
          <Typography
            variant="h4"
            textAlign="center"
            marginBottom={{ xs: "1rem", md: "4rem" }}
          >
            Invoice
          </Typography>
          <Grid container spacing={6}>
            {invoice && (
              <>
                <Grid item xs={12} md={7}>
                  <Card sx={{ position: "relative" }}>
                    <CardContent>
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
                            gap: 2,
                            alignItems: "center",
                          }}
                        >
                          <Avatar
                            src={invoice?.logoGame}
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
                              {invoice?.productName}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                letterSpacing: "0.25px",
                                fontWeight: 600,
                                marginTop: 1.5,
                              }}
                            >
                              {invoice?.game}
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
                            {currencyConverter(invoice?.totalAmt)}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ marginTop: 4 }}>
                        {(invoice?.detail?.userId ||
                          invoice?.detail?.serverId ||
                          invoice?.detail?.username) && (
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            Data game :
                          </Typography>
                        )}
                      </Box>
                      <Box>
                        {invoice?.detail?.userId && (
                          <Stack direction="row" justifyContent="space-between">
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, marginTop: 2 }}
                            >
                              User ID
                            </Typography>
                            {invoice?.detail?.userId && (
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600, marginTop: 2 }}
                              >
                                {invoice?.detail?.userId}
                              </Typography>
                            )}
                          </Stack>
                        )}
                        {invoice?.detail?.serverId && (
                          <Stack direction="row" justifyContent="space-between">
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, marginTop: 2 }}
                            >
                              Server ID
                            </Typography>
                            {invoice?.detail?.serverId && (
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600, marginTop: 2 }}
                              >
                                {invoice?.detail?.serverId}
                              </Typography>
                            )}
                          </Stack>
                        )}
                        {invoice?.detail?.username && (
                          <Stack direction="row" justifyContent="space-between">
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, marginTop: 2 }}
                            >
                              Username
                            </Typography>
                            {invoice?.detail?.username && (
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600, marginTop: 2 }}
                              >
                                {invoice?.detail?.username}
                              </Typography>
                            )}
                          </Stack>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                  <Card sx={{ position: "relative", marginTop: 4 }}>
                    {/* <CardHeader title='Informasi Pembayaran' titleTypographyProps={{ fontSize: 40 }} /> */}
                    <CardContent>
                      <Box sx={{ marginBottom: 4 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          Informasi Pembayaran
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
                          {invoice?.productName}
                        </Typography>
                        <Typography variant="body2">
                          {currencyConverter(
                            invoice?.detail ? invoice?.detail.amount : 0
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
                          {invoice?.detail?.quantity}
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
                          {invoice?.detail?.amount && invoice?.detail?.quantity
                            ? currencyConverter(
                                invoice?.detail.amount *
                                  invoice?.detail.quantity
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
                          {currencyConverter(invoice?.feeAmt)}
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
                          {currencyConverter(invoice?.discAmt)}
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
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          Total
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {currencyConverter(invoice?.totalAmt)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Card>
                    <CardContent>
                      <Box sx={{ marginBottom: 4 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          Pembayaran
                        </Typography>
                      </Box>
                      <Box>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          sx={{ marginBottom: 2 }}
                        >
                          <Typography variant="body2" fontWeight="400">
                            Status
                          </Typography>
                          <Chip
                            label="Success"
                            sx={{
                              backgroundColor: "#38e08b",
                              color: "white",
                            }}
                          />
                        </Stack>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          sx={{ marginBottom: 2 }}
                        >
                          <Typography variant="body2" fontWeight="400">
                            Nomor Invoice
                          </Typography>
                          <Typography
                            noWrap
                            variant="body2"
                            sx={{ fontWeight: 400 }}
                          >
                            {invoice?.invoiceId}
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          sx={{ marginBottom: 2 }}
                        >
                          <Typography variant="body2" fontWeight="400">
                            Tanggal Order
                          </Typography>
                          <Typography
                            noWrap
                            variant="body2"
                            sx={{ fontWeight: 400 }}
                          >
                            {dayjs(invoice?.createdAt).format(
                              "DD MMM YYYY HH:mm:ss"
                            )}
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          sx={{ marginBottom: 2 }}
                        >
                          <Typography variant="body2" fontWeight="400">
                            Metode Pembayaran
                          </Typography>
                          <Typography
                            noWrap
                            variant="body2"
                            sx={{ fontWeight: 400 }}
                          >
                            {invoice?.paymentMethods?.name}
                          </Typography>
                        </Stack>
                        {invoice?.cd === "ID_OVO" && (
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            sx={{ marginBottom: 2 }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 400 }}
                            >
                              Nomor OVO
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 400 }}
                            >
                              {invoice?.payment?.mobileNumber.replace(
                                "+62",
                                "0"
                              )}
                            </Typography>
                          </Stack>
                        )}
                        {invoice?.cd === "ID_JENIUSPAY" && (
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            sx={{ marginBottom: 2 }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 400 }}
                            >
                              Nomor OVO
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 400 }}
                            >
                              {invoice?.cashtag}
                            </Typography>
                          </Stack>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            )}
          </Grid>
        </>
      </Container>
    </>
  );
}
