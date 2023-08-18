import FormTopup from "@/components/pageProduct/FormTopup";
import ListDenom from "@/components/pageProduct/listDenom/ListDenom";
import { GetServerSideProps } from "next";
import ErrorPage from "next/error";
import NotFound from "./not-found";

interface IParams {
    params: {
        slug: string;
    };
}

const getProductsGame = async (slug: string): Promise<IProductDetail> => {
    const res = await fetch("http://localhost:3001/api/v1/bannerss", {
        cache: "no-cache",
    });
    const jsonRes = await res.json();
    return jsonRes as IProductDetail;
};

const getPaymentsMethod = async (): Promise<IPaymentMethod[]> => {
    const res = await fetch("http://localhost:3002/payments", {
        cache: "no-cache",
    });
    const jsonRes = await res.json();
    return jsonRes as IPaymentMethod[];
};

const page: React.FC<IParams> = async ({ params }) => {
    const resProducts = await fetch("http://localhost:3001/api/v1/bannerss", {
        cache: "no-cache",
    });
    if (!resProducts.ok) {
        return <NotFound />;
    }
    // const paymentsMethod = await getPaymentsMethod();

    return (
        <div className="mx-auto mt-10 font-pulse">
            {/* <FormTopup products={products} paymentsMethod={paymentsMethod} /> */}
        </div>
    );
};

interface IProps {
    products: IProductDetail;
    paymentsMethod: IPaymentMethod[];
}

export default page;
