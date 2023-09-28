"use client";

import { invoiceState } from "@/atom/invoice";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { useState } from "react";
import { useRecoilValue } from "recoil";

interface IInfoTransaksiProps {
    invoice: IInvoice;
}

const InfoTransaksi: React.FC<IInfoTransaksiProps> = ({ invoice }) => {
    const [copied, setCopied] = useState(false);
    const payment = useRecoilValue(invoiceState);

    let status;
    let classes;
    if (invoice.status === "1" && !payment.isExpired) {
        status = "Belum Dibayar";
        classes = "bg-yellow-200 text-yellow-800";
    } else if (invoice.status === "2") {
        status = "Sudah dibayar";
        classes = "bg-green-200 text-green-800";
    } else if (invoice.status === "3" || payment.isExpired) {
        status = "Kadaluarsa";
        classes = "bg-red-200 text-red-800";
    } else if (invoice.status === "4") {
        status = "Gagal";
        classes = "bg-red-200 text-red-800";
    } else {
        status = "N/A";
    }

    const handleClickCopy = () => {
        navigator.clipboard.writeText(invoice.invoiceId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="border-gray-300 border-2 shadow-lg rounded-lg mt-5 lg:p-7 p-4 h-fit">
            <table className="w-full text-start text-sm font-semibold">
                <tbody>
                    <tr>
                        <td className="py-1">Status Pembayaran</td>
                        <td className="py-1">:</td>
                        <td>
                            <p className={`${classes} font-bold shadow-md rounded-md w-fit py-2 px-4 `}>{status}</p>
                        </td>
                    </tr>
                    <tr>
                        <td className="py-1">No Transaksi</td>
                        <td className="py-1">:</td>
                        <td className="py-1 font-bold flex gap-1">
                            <p>{invoice.invoiceId}</p>
                            <div className="relative">
                                {copied && <p className="absolute -top-5">Disalin</p>}
                                <FontAwesomeIcon icon={faCopy} className="cursor-pointer" onClick={handleClickCopy} />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="py-1">Tanggal Pembelian</td>
                        <td className="py-1">:</td>
                        <td className="py-1 font-bold">{dayjs(invoice.createdAt).format("DD MMMM YYYY HH:mm:ss")}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default InfoTransaksi;
