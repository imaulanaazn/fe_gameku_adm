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
import NewPayment from "./newPayment";
import { Box, Breadcrumbs, Typography } from "@/lib/mui";

interface IInvoicesProps {
    invoice: IInvoice;
}

const Invoices: React.FC<IInvoicesProps> = ({ invoice }) => {
    return (
        <>
            <Box sx={{ py: 5 }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link href="/" className=" text-blue-800">
                        Home
                    </Link>
                    <Typography color="text.primary">{invoice.invoiceId}</Typography>
                </Breadcrumbs>
            </Box>
            <NewPayment invoices={invoice} />
        </>
    );
    // return (
    //     <div className="container mx-auto px-5">
    //         <p className="font-semibold text-sm lg:text-base">
    //             <Link href="/" className="text-blue-800">
    //                 Home
    //             </Link>{" "}
    //             / {data.invoiceId}
    //         </p>
    //         <div className="flex lg:gap-10 flex-wrap lg:flex-nowrap">
    //             <DetailPembelian invoice={data} />
    //             <div className="lg:w-2/3 w-full">
    //                 <div className="border-gray-300 border-2 shadow-lg rounded-lg mt-5 lg:p-7 p-4 h-fit">
    //                     <DetailInformation invoice={data} />
    //                     {data.status === "1" && <ActionPayment invoice={data} />}
    //                 </div>
    //                 <InfoTransaksi invoice={data} />
    //                 <DetailPembayaran invoice={data} />
    //             </div>
    //         </div>
    //     </div>
    // );
};

export default Invoices;
