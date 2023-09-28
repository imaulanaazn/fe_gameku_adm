import Header from "@/components/admin/Header";
import TablePaymentMethod from "@/components/admin/Payment Method/TablePaymentMethode";
import TableUser from "@/components/admin/User/TableUser";
import sendRequest from "@/lib/baseApi";
import React from "react";

const User = async () => {
    const data = await sendRequest<IPaymentMethodPagination>("/api/v1/payment-method", { cache: "no-cache" });
    return (
        <>
            <Header title="Metode Pembayaran" />
            <TablePaymentMethod data={data.data} />
        </>
    );
};

export default User;
