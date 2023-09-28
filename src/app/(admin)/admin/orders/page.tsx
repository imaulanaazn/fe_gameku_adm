import Header from "@/components/admin/Header";
import TableOrders from "@/components/admin/Orders/TableOrders";
import TablePromoCode from "@/components/admin/PromoCode/TablePromoCode";
import TableUser from "@/components/admin/User/TableUser";
import { IPromotionPagination } from "@/interfaces/promotion";
import sendRequest from "@/lib/baseApi";
import React from "react";

const Orders = async () => {
    const promoCode = await sendRequest<IOrderHistoryState>("/api/v1/orders", { cache: "no-cache" });
    return (
        <>
            <Header title="Kode Promo" />
            <TableOrders data={promoCode.data} />
        </>
    );
};

export default Orders;
