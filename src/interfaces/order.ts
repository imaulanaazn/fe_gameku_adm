interface IOrder {
    id: string;
    invoiceId: string;
    customerId: string;
    paymentMethodId: string;
    game: string;
    productName: string;
    paymentMethod: string;
    totalAmt: number;
    feeAmt: number;
    discAmt: number;
    promoCd: string;
    status: string;
    completedAt?: Date | string;
    createdAt: string | Date;
    updatedAt: string | Date;
}

interface IOrderHistory extends IOrder {
    logoUrl: string;
    quantity: number;
    status: string;
}

interface IOrderHistoryState extends IPagination {
    data: IOrderHistory[];
}

interface ICheckOrder extends IOrderHistoryState {
    keySearch: string;
}
