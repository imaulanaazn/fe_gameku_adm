import { FeeType } from "@/enum";
import Image from "next/image";

interface IPaymentProps {
    payment: IPaymentMethod;
    allHide: boolean;
    productPrice: number;
    setChoosenPayment: (payment: Partial<IPaymentMethod>) => void;
    choosenPayment: IPaymentMethod;
}

const Payment: React.FC<IPaymentProps> = ({ payment, allHide, productPrice, setChoosenPayment, choosenPayment }) => {
    let fee;
    let productPriceAfterFee: number;
    if (payment.feeType === FeeType.AMOUNT) {
        fee = payment.fee;
        productPriceAfterFee = productPrice + payment.fee;
    } else {
        fee = (payment.fee / 100) * productPrice;
        productPriceAfterFee = productPrice + fee;
    }

    let paymentClasses: string = "bg-white cursor-pointer";
    let notAllowed = false;
    if (allHide || productPriceAfterFee > payment.maxAmount || productPriceAfterFee < payment.minAmount) {
        paymentClasses = "grayscale cursor-not-allowed";
        notAllowed = true;
    }

    const formatIdr = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(productPrice && productPriceAfterFee);

    const formatMin = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(payment.minAmount);

    let choosenClasses = "border-2 border-transparent";
    if (choosenPayment.id === payment.id) {
        choosenClasses = "border-2 border-[#B72025]";
    }

    return (
        <div
            onClick={() => setChoosenPayment(notAllowed ? {} : payment)}
            className={`bg-white ${paymentClasses} ${choosenClasses} rounded-lg shadow-lg overflow-hidden flex items-center p-2 justify-between font-montserrat`}
        >
            <div className="min-w-fit w-20 h-10 bg-white shadow-sm shadow-slate-700 rounded-md flex justify-center items-center overflow-hidden">
                <Image
                    src={payment.logo}
                    alt={payment.name}
                    className="w-10"
                    width="0"
                    height="0"
                    sizes="100vw"
                    style={{ width: "100%", height: "100%" }}
                />
            </div>
            {notAllowed ? (
                <p className="text-[10px] font-bold grayscale-0 text-[#B72025] text-end">
                    Tidak tersedia, Min. {formatMin}
                </p>
            ) : (
                <p className="text-xs">{formatIdr}</p>
            )}
        </div>
    );
};

export default Payment;
