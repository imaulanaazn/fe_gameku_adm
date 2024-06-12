"use client";

import { faCopy, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import QRCode from "react-qr-code";

interface IActionPaymentProps {
  invoice: IInvoice;
}

//THIS COMPONENT IS UNUSED ANYWHERE IN THE CODE
const ActionPayment: React.FC<IActionPaymentProps> = ({ invoice }) => {
  return <></>;
  //   const [copied, setCopied] = useState(false);

  //   const handleClickCopy = () => {
  //     navigator.clipboard.writeText(
  //       invoice.category === "3"
  //         ? invoice.payment.accountNumber
  //         : invoice.payment.paymentCode
  //     );
  //     setCopied(true);
  //     setTimeout(() => setCopied(false), 2000);
  //   };

  //   const Action = () => {
  //     if (invoice.cd === "ID_SHOPEEPAY") {
  //       return (
  //         <div className="flex justify-center my-5 flex-col items-center gap-4">
  //           <div className="text-center">
  //             <h1 className="mb-2">Scan QR dibawah ini</h1>
  //             <QRCode
  //               value={
  //                 invoice.cd === "ID_SHOPEEPAY"
  //                   ? invoice.payment.qrCheckoutString
  //                   : invoice.payment.qrString
  //               }
  //             />
  //           </div>
  //           <Link
  //             href={
  //               invoice.payment.mobileWebCheckoutUrl ||
  //               invoice.payment.desktopWebCheckoutUrl ||
  //               invoice.payment.mobileDeeplinkCheckoutUrl
  //             }
  //             className="w-full text-center bg-green-600 hover:bg-green-400 text-white inline-block py-3 rounded-lg"
  //           >
  //             Atau Bayar Disini
  //           </Link>
  //         </div>
  //       );
  //     }
  //     if (invoice.category === "2") {
  //       return (
  //         <div className="flex justify-center my-5">
  //           <QRCode value={invoice.payment.qrString} />
  //         </div>
  //       );
  //     } else if (invoice.category === "1") {
  //       if (invoice.cd === "ID_OVO") {
  //         return (
  //           <div
  //             className={`bg-blue-200 text-blue-800 p-4 h-fit w-full rounded-lg flex gap-3 items-center text-sm mt-3`}
  //           >
  //             <FontAwesomeIcon icon={faInfoCircle} />
  //             <p>
  //               Silahkan cek notifikasi yang masuk ke aplikasi OVOmu untuk
  //               melanjutkan pembayaran!
  //             </p>
  //           </div>
  //         );
  //       } else if (invoice.cd === "ID_JENIUSPAY") {
  //         return (
  //           <div
  //             className={`bg-blue-200 text-blue-800 p-4 h-fit w-full rounded-lg flex gap-3 items-center text-sm mt-3`}
  //           >
  //             <FontAwesomeIcon icon={faInfoCircle} />
  //             <p>
  //               Silahkan cek notifikasi yang masuk ke aplikasi JENIUSmu untuk
  //               melanjutkan pembayaran!
  //             </p>
  //           </div>
  //         );
  //       } else {
  //         return (
  //           <Link
  //             href={
  //               invoice.payment.mobileWebCheckoutUrl ||
  //               invoice.payment.desktopWebCheckoutUrl ||
  //               invoice.payment.mobileDeeplinkCheckoutUrl
  //             }
  //             className="w-full text-center bg-green-600 hover:bg-green-400 text-white inline-block py-3 rounded-lg mt-3"
  //           >
  //             Bayar Disini
  //           </Link>
  //         );
  //       }
  //     } else if (invoice.category === "3" || invoice.category === "4") {
  //       return (
  //         <div
  //           className={`bg-blue-200 text-blue-800 p-4 h-fit w-full rounded-lg flex gap-3 items-center text-sm mt-3`}
  //         >
  //           {invoice.category === "3" ? (
  //             <p>Nomor Virtual Account : </p>
  //           ) : (
  //             <p>Kode Pembayaran : </p>
  //           )}
  //           {invoice.category === "3" ? (
  //             <p>{invoice.payment.accountNumber}</p>
  //           ) : (
  //             invoice.payment.paymentCode
  //           )}
  //           <div className="relative">
  //             {copied && <p className="absolute -top-5">Disalin</p>}
  //             <FontAwesomeIcon
  //               icon={faCopy}
  //               className="cursor-pointer"
  //               onClick={handleClickCopy}
  //             />
  //           </div>
  //         </div>
  //       );
  //     }
  //   };

  //   return (
  //     <div className="mt-3">
  //       <div className="text-base font-extrabold flex gap-3 items-center">
  //         <h1>Pembayaran via</h1>
  //         <div className=" w-16">
  //           <Image
  //             src={invoice.logoPaymentMethod}
  //             alt="Logo Metode Pembayaran Gasskeun Topup"
  //             width="0"
  //             height="0"
  //             sizes="100vw"
  //             style={{ width: "100%", height: "100%" }}
  //           />
  //         </div>
  //       </div>
  //       <Action />
  //     </div>
  //   );
};

export default ActionPayment;
