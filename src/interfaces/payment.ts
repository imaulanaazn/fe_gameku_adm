interface IPaymentDetail {
    desktopWebCheckoutUrl: string | null;
    mobileWebCheckoutUrl: string | null;
    mobileDeeplinkCheckoutUrl: string;
    qrCheckoutString: string;
    qrString: string;
    prefix: string;
    paymentCode: string;
    name: string;
    accountNumber: string;
    bankCode: string;
    merchantCode: string;
}

interface IInvoice {
    id: string;
    invoiceId: string;
    game: string;
    paymentMethod: string;
    paymentMethodId: string;
    productName: string;
    totalAmt: number;
    feeAmt: number;
    discAmt: number;
    promoCd: string;
    status: string;
    amt: number;
    quantity: number;
    logoGame: string;
    logoPaymentMethod: string;
    payment: IPaymentDetail;
    expiredAt: string | Date;
    category: string;
    createdAt: string | Date;
    cd: string;

    detail?: IOrderDetail;
}
