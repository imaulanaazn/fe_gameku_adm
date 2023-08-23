import { cartState } from "@/atom/cartState";
import Image from "next/image";
import { useRecoilState } from "recoil";

interface IListDenomProps {
    products: IProductsGame[];
    defaultLogo: string;
}

const ListDenom: React.FC<IListDenomProps> = ({ products, defaultLogo }) => {
    const [cart, setCart] = useRecoilState(cartState);

    const handleChooseDenom = (product: IProductsGame) => {
        setCart({ ...cart, product, prices: cart.quantity * product.price });
    };

    return (
        <div className="bg-slate-200 shadow-md rounded-lg p-7 mb-4">
            <div className="py-2 px-8 text-white rounded-lg shadow-lg shadow-slate-400 bg-[#B72025] w-fit text-sm">
                Pilih Denom
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                {products.map((prod, index) => (
                    <div
                        key={index}
                        className={`hover:bg-slate-300 rounded-lg shadow-lg overflow-hidden cursor-pointer bg-white border-2 ${
                            cart.product && cart.product.id === prod.id
                                ? "border-2 border-[#B72025]"
                                : "border-transparent"
                        }`}
                        onClick={() => handleChooseDenom(prod)}
                    >
                        <div
                            className="w-24 h-24 mx-auto rounded-md"
                            style={{
                                backgroundImage: `url('${prod.logoDenom || defaultLogo}')`,
                                backgroundSize: "contain",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                            }}
                        ></div>
                        <div className="p-2 text-center lg:text-sm text-xs">
                            <h2 className="font-semibold">{prod.name}</h2>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListDenom;
