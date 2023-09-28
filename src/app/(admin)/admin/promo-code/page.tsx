import Header from "@/components/admin/Header";
import TablePromoCode from "@/components/admin/PromoCode/TablePromoCode";
import TableUser from "@/components/admin/User/TableUser";
import { IPromotionPagination } from "@/interfaces/promotion";
import sendRequest from "@/lib/baseApi";
import React from "react";

const PromoCode = async () => {
    const promoCode = await sendRequest<IPromotionPagination>("/api/v1/promo-code", { cache: "no-cache" });
    return (
        <>
            <Header title="Kode Promo" />
            <TablePromoCode data={promoCode.data} />
        </>
    );
};

export default PromoCode;
