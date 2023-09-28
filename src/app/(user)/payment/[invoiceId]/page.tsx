import { Metadata } from "next";
import sendRequest from "@/lib/baseApi";
import NotFound from "./not-found";
import Invoices from "@/components/payment/Invoices";

interface IParams {
    params: {
        invoiceId: string;
    };
}

const Payment = async ({ params }: IParams) => {
    const invoice = await sendRequest<IInvoice>("/api/v1/order-detail/" + params.invoiceId, { cache: "no-cache" });
    if (!invoice.ok) {
        return <NotFound />;
    }

    return (
        <div className="mx-auto font-pulse mt-10">
            <Invoices invoice={invoice.data} />
        </div>
    );
};

export default Payment;

export const generateMetadata = ({ params }: IParams) => {
    return {
        title: params.invoiceId,
        description: undefined,
    } as Metadata;
};
