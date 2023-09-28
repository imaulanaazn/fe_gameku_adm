"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import advanced from "dayjs/plugin/advancedFormat";
import { useRecoilValue } from "recoil";
import CountdownCard from "./CountdownCard";
import { invoiceState } from "@/atom/invoice";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advanced);

interface IDetailInformationProps {
    invoice: IInvoice;
}

const DetailInformation: React.FC<IDetailInformationProps> = ({ invoice }) => {
    const payment = useRecoilValue(invoiceState);
    const { status, expiredAt } = invoice;

    let infoMessage = "";
    let bgColor = "";
    let textColor = "";

    if (status === "1") {
        infoMessage = `Bayar Sebelum ${dayjs(expiredAt).tz("Asia/Jakarta").format("DD MMMM YYYY HH:mm:ss")}`;
        bgColor = "yellow";
        textColor = "yellow";
    } else if (status === "2") {
        infoMessage = "Pembayaran sudah berhasil";
        bgColor = "green";
        textColor = "green";
    } else if (status === "3" || status === "4" || payment.isExpired) {
        infoMessage = "Pembayaran sudah kadaluarsa atau gagal, Silahkan checkout kembali";
        bgColor = "red";
        textColor = "red";
    }

    return (
        <div className={`flex justify-center flex-wrap md:justify-between text-sm`}>
            <div
                className={`bg-${bgColor}-200 text-${textColor}-800 p-4 h-fit w-full ${
                    invoice.status === "1" && "md:w-fit"
                } rounded-lg flex gap-3 items-center`}
            >
                <FontAwesomeIcon icon={faInfoCircle} />
                <p>{infoMessage}</p>
            </div>
            {status === "1" && <CountdownCard invoice={invoice} />}
        </div>
    );
};

export default DetailInformation;
