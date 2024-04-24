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
  Chip,
} from "@mui/material";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Divider from "@mui/material/Divider";
import Link from "next/link";
import { currencyConverter } from "@/@core/utils/currencyConverter";
import dayjs from "dayjs";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { OrderStatuses } from "@/enum";

interface IParams {
  params: {
    invoiceId: string;
  };
}

export default async function PaymentSuccess({ params }: IParams) {
  const invoice = await sendRequest<IInvoice>(
    "/v1/order-detail/" + params.invoiceId,
    { cache: "no-cache" }
  );
  if (!invoice.ok || invoice.status.toString() !== OrderStatuses.SUCCESS) {
    return <NotFound />;
  }

  return (
    <>
      <Container className="lg:my-20 bg-[#38e08b] lg:bg-white">
        <>
          <Stack
            sx={{
              width: "100%",
              textAlign: "center",
              marginBottom: "2rem",
              borderRadius: "1rem",
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
              sx={{ textAlign: "center", display: { xs: "flex", md: "none" } }}
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
                  Top Up {invoice.data.game}
                </Typography>

                <Box>
                  <Typography variant="body1" fontWeight="500">
                    Item Detail
                  </Typography>
                  {invoice.data.detail?.userId && (
                    <Stack
                      direction="row"
                      margin="0.25rem 0"
                      justifyContent="space-between"
                    >
                      <Typography variant="body2" sx={{ fontWeight: 400 }}>
                        User ID
                      </Typography>
                      {invoice.data.detail?.userId && (
                        <Typography variant="body2" sx={{ fontWeight: 400 }}>
                          {invoice.data.detail?.userId}
                        </Typography>
                      )}
                    </Stack>
                  )}
                  {invoice.data.detail?.serverId && (
                    <Stack
                      direction="row"
                      margin="0.25rem 0"
                      justifyContent="space-between"
                    >
                      <Typography variant="body2" sx={{ fontWeight: 400 }}>
                        Server ID
                      </Typography>
                      {invoice.data.detail?.serverId && (
                        <Typography variant="body2" sx={{ fontWeight: 400 }}>
                          {invoice.data.detail?.serverId}
                        </Typography>
                      )}
                    </Stack>
                  )}
                  {invoice.data.detail?.username && (
                    <Stack
                      direction="row"
                      margin="0.25rem 0"
                      justifyContent="space-between"
                    >
                      <Typography variant="body2" sx={{ fontWeight: 400 }}>
                        Username
                      </Typography>
                      {invoice.data.detail?.username && (
                        <Typography variant="body2" sx={{ fontWeight: 400 }}>
                          {invoice.data.detail?.username}
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
                      {invoice.data.invoiceId}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    margin="0.25rem 0"
                  >
                    <Typography variant="body2">Tanggal Order</Typography>
                    <Typography variant="body2">
                      {dayjs(invoice.data.createdAt).format("DD MMM YYYY")}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    margin="0.25rem 0"
                  >
                    <Typography variant="body2">Product</Typography>
                    <Typography variant="body2">
                      {invoice.data.productName}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    margin="0.25rem 0"
                  >
                    <Typography variant="body2">Kuantitas</Typography>
                    <Typography variant="body2">
                      {invoice.data.quantity}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    margin="0.25rem 0"
                  >
                    <Typography variant="body2">Sub Total</Typography>
                    <Typography variant="body2">
                      {invoice.data.detail?.amount &&
                      invoice.data.detail?.quantity
                        ? currencyConverter(
                            invoice.data.detail.amount *
                              invoice.data.detail.quantity
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
                      {currencyConverter(invoice.data.feeAmt)}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    margin="0.25rem 0"
                  >
                    <Typography variant="body2">Diskon</Typography>
                    <Typography variant="body2">
                      {currencyConverter(invoice.data.discAmt)}
                    </Typography>
                  </Stack>
                </Box>

                <Divider variant="middle" />

                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body1" fontWeight="500">
                    Total
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {currencyConverter(invoice.data.totalAmt)}
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
                  {invoice.data.productName}{" "}
                </Typography>{" "}
                berhasil dikirim ke akun{" "}
                <Typography component="span" fontWeight={800} color="white">
                  {" "}
                  {invoice.data.game}{" "}
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
            {invoice.ok && (
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
                          sx={{ display: "flex", gap: 2, alignItems: "center" }}
                        >
                          <Avatar
                            src={invoice.data.logoGame}
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
                              {invoice.data.productName}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                letterSpacing: "0.25px",
                                fontWeight: 600,
                                marginTop: 1.5,
                              }}
                            >
                              {invoice.data.game}
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
                            {currencyConverter(invoice.data.totalAmt)}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ marginTop: 4 }}>
                        {(invoice.data.detail?.userId ||
                          invoice.data.detail?.serverId ||
                          invoice.data.detail?.username) && (
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            Data game :
                          </Typography>
                        )}
                      </Box>
                      <Box>
                        {invoice.data.detail?.userId && (
                          <Stack direction="row" justifyContent="space-between">
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, marginTop: 2 }}
                            >
                              User ID
                            </Typography>
                            {invoice.data.detail?.userId && (
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600, marginTop: 2 }}
                              >
                                {invoice.data.detail?.userId}
                              </Typography>
                            )}
                          </Stack>
                        )}
                        {invoice.data.detail?.serverId && (
                          <Stack direction="row" justifyContent="space-between">
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, marginTop: 2 }}
                            >
                              Server ID
                            </Typography>
                            {invoice.data.detail?.serverId && (
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600, marginTop: 2 }}
                              >
                                {invoice.data.detail?.serverId}
                              </Typography>
                            )}
                          </Stack>
                        )}
                        {invoice.data.detail?.username && (
                          <Stack direction="row" justifyContent="space-between">
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, marginTop: 2 }}
                            >
                              Username
                            </Typography>
                            {invoice.data.detail?.username && (
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600, marginTop: 2 }}
                              >
                                {invoice.data.detail?.username}
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
                          {invoice.data.productName}
                        </Typography>
                        <Typography variant="body2">
                          {currencyConverter(
                            invoice.data.detail ? invoice.data.detail.amount : 0
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
                          {invoice.data.detail?.quantity}
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
                          {invoice.data.detail?.amount &&
                          invoice.data.detail?.quantity
                            ? currencyConverter(
                                invoice.data.detail.amount *
                                  invoice.data.detail.quantity
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
                          {currencyConverter(invoice.data.feeAmt)}
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
                          {currencyConverter(invoice.data.discAmt)}
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
                          {currencyConverter(invoice.data.totalAmt)}
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
                            {invoice.data.invoiceId}
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
                            {dayjs(invoice.data.createdAt).format(
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
                            {invoice.data.paymentMethods?.name}
                          </Typography>
                        </Stack>
                        {invoice.data.cd === "ID_OVO" && (
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
                              {invoice.data.payment?.mobileNumber.replace(
                                "+62",
                                "0"
                              )}
                            </Typography>
                          </Stack>
                        )}
                        {invoice.data.cd === "ID_JENIUSPAY" && (
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
                              {invoice.data.cashtag}
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

// {
//     data: {
//       id: '990dba58-e558-45b9-936f-f33e4f0aa2cc',
//       invoiceId: 'INV1713878150244',
//       game: 'PUBG Mobile',
//       paymentMethod: 'Bank Syariah Indonesia (BSI)',
//       paymentMethodId: '0b2905ed-9010-4caa-ba7d-ed17f779e42c',
//       productName: '30 UC',
//       totalAmt: 10137,
//       feeAmt: 4000,
//       discAmt: 0,
//       promoCd: '',
//       status: '1',
//       createdAt: '2024-04-23T13:15:50.000Z',
//       amt: 6137,
//       quantity: 1,
//       logoGame: 'https://firebasestorage.googleapis.com/v0/b/gasskeun-topup.appspot.com/o/assets%2Fgame%2F61db1a5d-f34c-472a-9266-d39993d12f44.png?alt=media&token=5a291742-1094-427e-8cbf-4d680ac22e5b',
//       logoPaymentMethod: 'https://firebasestorage.googleapis.com/v0/b/gasskeun-topup.appspot.com/o/assets%2Fpayments_method%2Fbsi.png?alt=media&token=ff51d83e-35d3-4df5-b16a-aedfffa5055c',
//       payment: {
//         accountNumber: '934799996940373',
//         bankCode: 'BSI',
//         merchantCode: '9347',
//         name: 'Mahbul Apparel'
//       },
//       expiredAt: '2024-04-23T20:15:50.000Z',
//       category: '3',
//       cd: 'BSI',
//       detail: {
//         id: 'e7b86bfd-4698-4463-9cec-be993395fb93',
//         orderId: '990dba58-e558-45b9-936f-f33e4f0aa2cc',
//         productId: '5565edbc-2c89-418b-8a02-1e437f759f40',
//         userId: '123',
//         serverId: '',
//         gameVoucher: null,
//         amount: 6137,
//         quantity: 1,
//         webhookCount: 0,
//         username: null
//       }
//     },
//     ok: true,
//     status: 200
//   }
