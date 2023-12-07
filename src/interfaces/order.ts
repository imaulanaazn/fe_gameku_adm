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
    custName?: string;
    mobileNumber?: string;
    productId?: string;
    logoUrl: string;
    quantity: number;
    username?: string;
}

interface IOrderHistoryWithDetail extends IOrderHistory {
    detail: IOrderDetail;
}

interface IOrderWithAnalitycs {
    revenue: number;
    fee: number;
    discount: number;
    orders: number;
    countPaid: number;
    countUnpaid: number;
}

interface IOrderWithAnalitycsPagination extends IPagination {
    data: IOrderHistory[];
    analytics: IOrderWithAnalitycs;
}

interface IOrderWithAnalitycsPaginationWithSearch extends IOrderWithAnalitycsPagination {
    keySearch: string;
}

interface IOrderWithAnalitycsPaginationWithDetail extends IPagination {
    data: IOrderHistoryWithDetail[];
    analytics: IOrderWithAnalitycs;
}

interface IOrderWithAnalitycsPaginationWithDetailWithSearch extends IOrderWithAnalitycsPaginationWithDetail {
    keySearch: string;
}
