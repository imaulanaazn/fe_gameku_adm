interface IDetailPembayaranProps {
  invoice: IInvoice;
}

// THIS COMPONENT IS UNUSED ANYWHERE IN THE CODE
const DetailPembayaran: React.FC<IDetailPembayaranProps> = ({ invoice }) => {
  return <></>;
  // const totalAmount = new Intl.NumberFormat("id-ID", {
  //     style: "currency",
  //     currency: "IDR",
  //     minimumFractionDigits: 0,
  //     maximumFractionDigits: 0,
  // }).format(invoice.totalAmt);

  // const amount = new Intl.NumberFormat("id-ID", {
  //     style: "currency",
  //     currency: "IDR",
  //     minimumFractionDigits: 0,
  //     maximumFractionDigits: 0,
  // }).format(invoice.amt);

  // const discount = new Intl.NumberFormat("id-ID", {
  //     style: "currency",
  //     currency: "IDR",
  //     minimumFractionDigits: 0,
  //     maximumFractionDigits: 0,
  // }).format(invoice.discAmt);

  // const fee = new Intl.NumberFormat("id-ID", {
  //     style: "currency",
  //     currency: "IDR",
  //     minimumFractionDigits: 0,
  //     maximumFractionDigits: 0,
  // }).format(invoice.feeAmt);

  // return (
  //     <div className="border-gray-300 border-2 shadow-lg rounded-lg mt-5 lg:p-7 p-4 h-fit">
  //         <h1 className="text-base font-extrabold">Detail Pembayaran</h1>
  //         <table className="w-full text-start text-sm font-semibold mt-3">
  //             <tbody>
  //                 <tr>
  //                     <td className="py-1">Harga</td>
  //                     <td className="py-1">:</td>
  //                     <td className="py-1 font-bold">{amount}</td>
  //                 </tr>
  //                 <tr>
  //                     <td className="py-1">Jumlah</td>
  //                     <td className="py-1">:</td>
  //                     <td className="py-1 font-bold">{invoice.quantity}</td>
  //                 </tr>
  //                 <tr>
  //                     <td className="py-1">Biaya admin</td>
  //                     <td className="py-1">:</td>
  //                     <td className="py-1 font-bold">{fee}</td>
  //                 </tr>
  //                 <tr>
  //                     <td className="py-1">Diskon</td>
  //                     <td className="py-1">:</td>
  //                     <td className="py-1 font-bold">{invoice.discAmt === 0 ? invoice.discAmt : discount}</td>
  //                 </tr>
  //                 <tr>
  //                     <td className="text-base font-extrabold py-1">Total Pembayaran</td>
  //                     <td className="text-base font-extrabold py-1">:</td>
  //                     <td className="text-base font-extrabold py-1 ">{totalAmount}</td>
  //                 </tr>
  //             </tbody>
  //         </table>
  //     </div>
  // );
};

export default DetailPembayaran;
