import { Metadata } from "next";
import sendRequest from "@/lib/baseApi";
import NotFound from "./not-found";
import Invoices from "@/components/payment/Invoices";
import Maintenance from "@/components/maintenance/Maintenance";
import { Container } from "@/lib/mui";

interface IParams {
    params: {
        invoiceId: string;
    };
}

const Payment = async ({ params }: IParams) => {
    const statusWebsite = await sendRequest<{ value: string }[]>("/v1/config?type=website_status");
    if (statusWebsite.data[0].value === "maintenance") {
        return <Maintenance />;
    }
    const invoice = await sendRequest<IInvoice>("/v1/order-detail/" + params.invoiceId, { cache: "no-cache" });
    if (!invoice.ok) {
        return <NotFound />;
    }

    return (
        <Container maxWidth="lg" sx={{ paddingBottom: 4 }}>
            <Invoices invoice={invoice.data} />
        </Container>
    );
};

export default Payment;

export const generateMetadata = async ({ params }: IParams) => {
    const meta = await sendRequest<IMeta>("/v1/meta?path=/payment", {}, 3600);
    if (!meta.ok) {
        return;
    }
    return {
        metadataBase: new URL(process.env.NEXT_PUBLIC_HOST || "https://gasskeuntopup.com"),
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
