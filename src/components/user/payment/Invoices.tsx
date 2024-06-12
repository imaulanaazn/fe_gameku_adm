"use client";

import Link from "next/link";
import DetailPembelian from "./unused/DetailPembelian";
import DetailInformation from "./unused/DetailInformation";
import ActionPayment from "./unused/ActionPayment";
import DetailPembayaran from "./unused/DetailPembayaran";
import InfoTransaksi from "./unused/InfoTransaksi";
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
      <Box maxWidth="lg" marginX={"auto"}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ pb: { xs: 0, lg: 8 } }}>
          <Link href="/" className=" text-primary-900">
            Home
          </Link>
          <Typography color="text.primary">
            {invoice.order.invoiceId}
          </Typography>
        </Breadcrumbs>
        <NewPayment invoices={invoice} />
      </Box>
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
