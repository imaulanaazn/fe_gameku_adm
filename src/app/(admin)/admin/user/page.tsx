import Header from "@/components/admin/Header";
import TableUser from "@/components/admin/User/TableUser";
import sendRequest from "@/lib/baseApi";
import React from "react";

const User = async () => {
    const users = await sendRequest<IUserPagination>("/api/v1/user", { cache: "no-cache" });
    return (
        <>
            <Header title="User" />
            <div className="w-full p-5 bg-white rounded-lg shadow-lg">
                <TableUser user={users.data} />
            </div>
        </>
    );
};

export default User;
