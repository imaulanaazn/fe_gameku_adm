import FormTopup from "@/components/pageProduct/FormTopup";
import { Metadata } from "next";
import NotFound from "./not-found";
import sendRequest from "@/lib/baseApi";

interface IParams {
    params: {
        productKey: string;
    };
}

const page = async ({ params }: IParams) => {
    const gameDetail = await sendRequest<IGameDetail>("/api/v1/game-detail?slug=" + params.productKey);
    if (!gameDetail.ok) {
        return <NotFound />;
    }
    const paymentsMethod = await sendRequest<IPaymentMethod[]>("/api/v1/payments-method");
    return (
        <div className="mx-auto font-pulse">
            <FormTopup products={gameDetail.data} paymentsMethod={paymentsMethod.data} />
        </div>
    );
};

export const generateMetadata = ({ params }: IParams) => {
    return {
        title: params.productKey,
        description: undefined,
    } as Metadata;
};

export default page;
