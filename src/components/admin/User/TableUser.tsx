"use client";

import { userAdmin } from "@/atom/userAdminState";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const TableUser: React.FC<{ user: IUserPagination }> = ({ user }) => {
    const [customer, setCustomer] = useRecoilState(userAdmin);

    useEffect(() => {
        setCustomer({ ...customer, ...user });
    }, []);

    return (
        <table className="w-full text-sm text-left text-gray-500 table-auto">
            <thead className="text-xs text-gray-700 uppercase bg-white border-b-2 border-gray-300">
                <tr>
                    <th scope="col" className="py-3">
                        Nama
                    </th>
                    <th scope="col" className="py-3">
                        Email
                    </th>
                    <th scope="col" className="py-3">
                        Nomor Whatsapp
                    </th>
                    <th scope="col" className="py-3">
                        Status
                    </th>
                </tr>
            </thead>
            <tbody>
                {customer.data.map((user) => (
                    <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th
                            scope="row"
                            className="py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white flex gap-3 items-center"
                        >
                            <div className="w-12 h-12 object-cover">
                                <Image
                                    src="/images/IconUser.png"
                                    alt={`Logo User`}
                                    width="0"
                                    height="0"
                                    sizes="100vw"
                                    style={{ width: "100%", height: "100%" }}
                                    className="rounded-lg object-cover"
                                />
                            </div>
                            <p>{user.name}</p>
                        </th>
                        <th scope="row" className="py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {user.email}
                        </th>
                        <td className="py-4">{user.mobileNumber}</td>
                        <td className="py-4">{user.isActive ? "Active" : "Banned"}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TableUser;
