import { Metadata } from "next";
import sendRequest from "@/lib/baseApi";
import NotFound from "./not-found";
import Invoices from "@/components/user/payment/Invoices";
import Maintenance from "@/components/global/maintenance/Maintenance";
import Container from "@/components/global/Container/Container";
import { Box } from "@mui/material";

interface IParams {
  params: {
    invoiceId: string;
  };
}

const Payment = async ({ params }: IParams) => {
  const statusWebsite = await sendRequest<{ value: string }[]>(
    "/v1/config?type=website_status"
  );
  if (statusWebsite.data[0].value === "maintenance") {
    return <Maintenance />;
  }
  const invoice = await sendRequest<IInvoice>(
    "/v2/order-detail/" + params.invoiceId,
    { cache: "no-cache" }
  );
  if (!invoice.ok) {
    return <NotFound />;
  }

  return (
    <Box sx={{ backgroundColor: "#FFF3F3", pb: 20, pt: 10 }}>
      <Container>
        <Invoices invoice={invoice.data} />
      </Container>
    </Box>
  );
};

export default Payment;

export const generateMetadata = async ({ params }: IParams) => {
  const meta = await sendRequest<IMeta>("/v1/meta?path=/payment", {}, 3600);
  if (!meta.ok) {
    return;
  }
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_HOST || "https://gasskeuntopup.com"
    ),
    title: `[${params.invoiceId}] ${meta.data.title}`,
    icons: meta.data.icon,
    openGraph: {
      url: process.env.NEXT_PUBLIC_HOST + "/register",
      type: "website",
      siteName: "Gasskeun Topup",
      images: meta.data.image,
    },
    twitter: {
      card: meta.data.image,
    },
  } as Metadata;
};
