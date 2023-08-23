import Payment from "./Payment";

interface IListPaymentsMethodProps {
    paymentsMethod: IPaymentMethod[];
}

const ListPaymentsMethod: React.FC<IListPaymentsMethodProps> = ({ paymentsMethod }) => {
    return (
        <div className="bg-slate-200 shadow-md rounded-lg p-7 mb-4">
            <div className="py-2 px-8 text-white rounded-lg shadow-lg shadow-slate-400 bg-[#B72025] w-fit text-sm">
                Pilih Pembayaran
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
                {paymentsMethod.map((method) => (
                    <Payment payment={method} key={method.id} />
                ))}
            </div>
        </div>
    );
};

export default ListPaymentsMethod;
