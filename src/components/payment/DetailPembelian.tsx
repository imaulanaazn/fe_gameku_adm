import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

interface IDetailPembelianProps {
    invoice: IInvoice;
}

const DetailPembelian: React.FC<IDetailPembelianProps> = ({ invoice }) => {
    const totalAmount = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(invoice.totalAmt);

    return (
        <div className="lg:w-1/3 w-full border-gray-300 border-2 shadow-lg rounded-lg mt-5 lg:p-7 p-4 h-fit">
            <div className="flex gap-3 items-center">
                <div className="w-20 h-20">
                    <Image
                        src={invoice.logoGame}
                        alt="Logo Jokiku gasskeun"
                        width="0"
                        height="0"
                        sizes="100vw"
                        style={{ width: "100%", height: "100%" }}
                        className="rounded-lg"
                    />
                </div>
                <h1 className="text-base">{invoice.game}</h1>
            </div>
            <div className="mt-5">
                <h1 className="text-base mb-2 font-extrabold">Detail Pembelian</h1>
                <table className="w-full text-start text-sm font-semibold">
                    <tbody>
                        <tr>
                            <td className="py-1">Produk</td>
                            <td className="py-1">:</td>
                            <td className="py-1 font-bold">{invoice.game}</td>
                        </tr>
                        <tr>
                            <td className="py-1">Nominal</td>
                            <td className="py-1">:</td>
                            <td className="py-1 font-bold">{invoice.productName}</td>
                        </tr>
                        <tr>
                            <td className="py-1">Jumlah</td>
                            <td className="py-1">:</td>
                            <td className="py-1 font-bold">{invoice.quantity}</td>
                        </tr>
                        <tr>
                            <td className="text-base font-extrabold py-1">Total Pembayaran</td>
                            <td className="text-base font-extrabold py-1">:</td>
                            <td className="text-base font-extrabold py-1 ">{totalAmount}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DetailPembelian;
