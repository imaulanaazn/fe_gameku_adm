interface IOrderDetail {
    id: string;
    orderId: string;
    productId: string;
    userId: string;
    serverId: string;
    gameVoucher: string;
    amount: number;
    quantity: number;
    username?: string;
}
