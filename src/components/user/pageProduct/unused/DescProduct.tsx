interface IDescProductProps {
    products: IProductDetail;
}

const DescProduct: React.FC<IDescProductProps> = ({ products }) => {
    return (
        <div className="lg:w-1/3 w-full bg-slate-200 shadow-md rounded-lg mt-5 lg:p-7 p-4 h-fit">
            <div className="flex gap-5">
                <div
                    style={{
                        backgroundImage: `url('${products.logoUrl}')`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                    }}
                    className="w-20 h-20"
                ></div>
                <h1 className="text-base font-bold">{products.name}</h1>
            </div>
            <div className="mt-4 text-sm" dangerouslySetInnerHTML={{ __html: products.description || "" }}></div>
        </div>
    );
};

export default DescProduct;
