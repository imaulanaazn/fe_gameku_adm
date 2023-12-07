import { cartState } from "@/atom/cartState";
import Image from "next/image";
import { useRecoilState } from "recoil";

interface IListDenomProps {
    products: IProductsGame[];
    defaultLogo: string;
}

const ListDenom: React.FC<IListDenomProps> = ({ products, defaultLogo }) => {
    const [cart, setCart] = useRecoilState(cartState);
    const sorted = [...products].sort((a, b) => a.price - b.price);

    const handleChooseDenom = (product: IProductsGame) => {
        setCart({
            ...cart,
            product,
            prices: cart.quantity * product.price,
            promoCode: "",
            pricesAfterDiscount: 0,
            discount: 0,
        });
    };

    return (
        <div className="bg-slate-200 shadow-md rounded-lg lg:p-7 p-4 mb-4">
            <div className="py-2 px-8 text-white rounded-lg shadow-lg shadow-slate-400 bg-[#B72025] w-fit text-sm">
                Pilih Denom
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5 auto-rows-fr">
                {sorted.map((prod, index) => (
                    <div
                        key={index}
                        className={`flex flex-col justify-center items-center hover:bg-slate-300 rounded-lg shadow-lg overflow-hidden cursor-pointer bg-white border-2 ${
                            cart.product && cart.product.id === prod.id
                                ? "border-2 border-[#B72025]"
                                : "border-transparent"
                        }`}
                        onClick={() => handleChooseDenom(prod)}
                    >
                        {(prod.logoDenom || defaultLogo) && (
                            <div className="w-7 h-7 rounded-lg flex justify-center">
                                <Image
                                    src={prod.logoDenom || defaultLogo}
                                    alt="Logo Denom Gasskeun Topup"
                                    className="rounded-lg object-contain"
                                    width="0"
                                    height="0"
                                    sizes="100vw"
                                    style={{ width: "100%", height: "100%" }}
                                />
                            </div>
                        )}
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
