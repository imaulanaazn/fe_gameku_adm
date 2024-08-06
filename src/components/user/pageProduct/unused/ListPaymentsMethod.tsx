import Payment from "./Payment";

interface IListPaymentsMethodProps {
  paymentsMethod: IPaymentMethod[];
}

const ListPaymentsMethod: React.FC<IListPaymentsMethodProps> = ({
  paymentsMethod,
}) => {
  const groupedByCategory: any = {};
  for (const paymentMethod of paymentsMethod) {
    const category =
      paymentMethod.category === "1" || paymentMethod.category === "2"
        ? "1-2"
        : paymentMethod.category;

    if (!groupedByCategory[category]) {
      groupedByCategory[category] = [];
    }

    groupedByCategory[category].push(paymentMethod);
  }

  return (
    <div className="bg-slate-200 shadow-md rounded-lg lg:p-7 p-4 mb-4">
      <div className="py-2 px-8 text-white rounded-lg shadow-lg shadow-slate-400 bg-[#B72025] w-fit text-sm">
        Pilih Pembayaran
      </div>
      {Object.keys(groupedByCategory).map((key, i) => {
        let title = "";
        if (key === "1-2") {
          title = "Ewallet dan QRIS";
        } else if (key === "3") {
          title = "Virtual Account";
        } else {
          title = "Retail";
        }

        return (
          <div className="mt-5" key={i}>
            <h2>{title}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-2">
              {groupedByCategory[key].map((method: any) => (
                <Payment payment={method} key={method.id} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
  // return (
  //     <div className="bg-slate-200 shadow-md rounded-lg lg:p-7 p-4 mb-4">
  //         <div className="py-2 px-8 text-white rounded-lg shadow-lg shadow-slate-400 bg-[#B72025] w-fit text-sm">
  //             Pilih Pembayaran
  //         </div>
  // <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
  //     {paymentsMethod.map((method) => (
  //         <Payment payment={method} key={method.id} />
  //     ))}
  // </div>
  //     </div>
  // );
};

export default ListPaymentsMethod;
