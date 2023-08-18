import Image from "next/image";

interface IListDenomProps {
    products: IProductsGame[];
    handleClick: (product: IProductsGame) => void;
    choosenProduct: IProductsGame;
}

const ListDenom: React.FC<IListDenomProps> = ({ products, handleClick, choosenProduct }) => {
    return (
        <div className="bg-slate-200 shadow-md rounded-lg p-7 mb-4">
            <div className="py-2 px-8 text-white rounded-lg shadow-lg shadow-slate-400 bg-[#B72025] w-fit text-sm">
                Pilih Denom
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                {products.map((prod, index) => (
                    <div
                        key={index}
                        className={`rounded-lg shadow-lg overflow-hidden cursor-pointer bg-white border-2 ${
                            choosenProduct.id === prod.id ? "border-2 border-[#B72025]" : "border-transparent"
                        }`}
                        onClick={() => handleClick(prod)}
                    >
                        <Image
                            src={prod.logo}
                            alt={prod.name}
                            className="w-full lg:h-24 h-16 object-cover"
                            width="0"
                            height="0"
                            sizes="100vw"
                            style={{ width: "100%", height: "100%" }}
                        />
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
