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
                <h1 className="text-xl lg:text-xl">{products.name}</h1>
            </div>
            <div className="mt-5">
                {/* // TODO DESC PRODUCT */}
                {/* <h1>Cara TopUp</h1>
                <ol className="list-decimal list-inside text-sm mt-2">
                    <li>Masukkan User ID dan Zone ID anda Contoh: 1234567 (1234)</li>
                    <li>Pilih Nominal Diamond yang kamu inginkan</li>
                    <li>Selesaikan Pembayaran</li>
                    <li>Diamond akan di tambahkan ke akun Mobile Legends Kamu</li>
                </ol> */}
            </div>
        </div>
    );
};

export default DescProduct;
