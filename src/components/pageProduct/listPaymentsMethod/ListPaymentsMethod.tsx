import Payment from "./Payment";

interface IListPaymentsMethodProps {
    paymentsMethod: IPaymentMethod[];
    allHide: boolean;
    productPrice: number;
    setChoosenPayment: (paymentId: Partial<IPaymentMethod>) => void;
    choosenPayment: IPaymentMethod;
}

const ListPaymentsMethod: React.FC<IListPaymentsMethodProps> = ({
    paymentsMethod,
    allHide,
    productPrice,
    setChoosenPayment,
    choosenPayment,
}) => {
    return (
        <div className="bg-slate-200 shadow-md rounded-lg p-7 mb-4">
            <div className="py-2 px-8 text-white rounded-lg shadow-lg shadow-slate-400 bg-[#B72025] w-fit text-sm">
                Pilih Pembayaran
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
                {paymentsMethod.map((method) => (
                    <Payment
                        payment={method}
                        allHide={allHide}
                        productPrice={productPrice}
                        key={method.id}
                        setChoosenPayment={setChoosenPayment}
                        choosenPayment={choosenPayment}
                    />
                ))}
            </div>
        </div>
    );
};

export default ListPaymentsMethod;
