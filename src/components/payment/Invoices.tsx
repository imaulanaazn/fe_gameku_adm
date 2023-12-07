"use client";

import Link from "next/link";
import DetailPembelian from "./DetailPembelian";
import DetailInformation from "./DetailInformation";
import ActionPayment from "./ActionPayment";
import DetailPembayaran from "./DetailPembayaran";
import InfoTransaksi from "./InfoTransaksi";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { invoiceState } from "@/atom/invoice";
import { msgState } from "@/atom/msgState";
import { toast } from "react-toastify";

interface IInvoicesProps {
    invoice: IInvoice;
}

const Invoices: React.FC<IInvoicesProps> = ({ invoice }) => {
    const [payment, setPayment] = useRecoilState(invoiceState);
    const [data, setData] = useState(invoice);
    const [num, setNum] = useState(0);

    useEffect(() => {
        if (invoice.status === "3") {
            setPayment({ ...payment, isExpired: true });
        } else {
            setPayment({ ...payment, isExpired: false });
        }
    }, []);

    const getInvoice = async () => {
        const request = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/order-detail/" + invoice.invoiceId, {
            method: "GET",
            cache: "no-cache",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
            credentials: "include",
        });

        const res = await request.json();
        if (request.ok) {
            setData(res);
        } else {
            toast.error(res.message, {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (data.status !== "1") {
                clearInterval(interval);
            } else {
                getInvoice();
            }
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, [data.status]);

    return (
        <div className="container mx-auto px-5">
            <p className="font-semibold text-sm lg:text-base">
                <Link href="/" className="text-blue-800">
                    Home
                </Link>{" "}
                / {data.invoiceId}
            </p>
            <div className="flex lg:gap-10 flex-wrap lg:flex-nowrap">
                <DetailPembelian invoice={data} />
                <div className="lg:w-2/3 w-full">
                    <div className="border-gray-300 border-2 shadow-lg rounded-lg mt-5 lg:p-7 p-4 h-fit">
                        <DetailInformation invoice={data} />
                        {data.status === "1" && <ActionPayment invoice={data} />}
                    </div>
                    <InfoTransaksi invoice={data} />
                    <DetailPembayaran invoice={data} />
                </div>
            </div>
        </div>
    );
};

export default Invoices;
