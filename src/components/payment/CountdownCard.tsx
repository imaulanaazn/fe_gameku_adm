"use client";

import { invoiceState } from "@/atom/invoice";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

dayjs.extend(duration);

// THIS COMPONENT IS UNUSED ANYWHERE IN THE CODE
const Countdown: React.FC<{ invoice: IInvoice }> = ({ invoice }) => {
  return <></>;
  // const [days, setDays] = useState<number>(0);
  // const [hours, setHours] = useState<number>(0);
  // const [minutes, setMinutes] = useState<number>(0);
  // const [seconds, setSeconds] = useState<number>(0);
  // const [payment, setPayment] = useRecoilState(invoiceState);

  // useEffect(() => {
  //     const interval = setInterval(() => {
  //         const now = dayjs();
  //         const target = dayjs(invoice.expiredAt);
  //         const diff = target.diff(now);
  //         if (diff <= 0) {
  //             clearInterval(interval);
  //             setDays(0);
  //             setHours(0);
  //             setMinutes(0);
  //             setSeconds(0);
  //             setPayment({ ...payment, isExpired: true });
  //         } else {
  //             const duration = dayjs.duration(diff);
  //             setDays(duration.days());
  //             setHours(duration.hours());
  //             setMinutes(duration.minutes());
  //             setSeconds(duration.seconds());
  //         }
  //     }, 1000);

  //     return () => {
  //         clearInterval(interval);
  //     };
  // }, [invoice.status, invoice.expiredAt]);

  // return (
  //     <div className="flex gap-1 text-center mt-3 md:mt-0">
  //         {days > 0 && (
  //             <div className="border-2 h-fit rounded-lg shadow-lg min-w-[5rem]">
  //                 <p className="text-lg font-bold">{days < 10 ? "0" + days : days}</p>
  //                 <p>Hari</p>
  //             </div>
  //         )}
  //         {(days > 0 || hours > 0) && (
  //             <div className="border-2 h-fit rounded-lg shadow-lg min-w-[5rem]">
  //                 <p className="text-lg font-bold">{hours < 10 ? "0" + hours : hours}</p>
  //                 <p>Jam</p>
  //             </div>
  //         )}
  //         {(days > 0 || hours > 0 || minutes > 0) && (
  //             <div className="border-2 h-fit rounded-lg shadow-lg min-w-[5rem]">
  //                 <p className="text-lg font-bold">{minutes < 10 ? "0" + minutes : minutes}</p>
  //                 <p>Menit</p>
  //             </div>
  //         )}
  //         <div className="border-2 h-fit rounded-lg shadow-lg min-w-[5rem]">
  //             <p className="text-lg font-bold">{seconds < 10 ? "0" + seconds : seconds}</p>
  //             <p>Detik</p>
  //         </div>
  //     </div>
  // );
};

export default Countdown;
