"use client";

import { cartState } from "@/atom/cartState";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Select from "react-select";

const DetailAccount: React.FC<{ products: IGameDetail }> = ({ products }) => {
    const [cart, setCart] = useRecoilState(cartState);
    const [detailAccount, setDetailAccount] = useState({
        userId: "",
        serverId: "",
    });
    const [selectedOption, setSelectedOption] = useState("");

    let options: any[] = [];
    if (products.servers) {
        options = products.servers.map((data) => {
            return {
                label: data.label,
                value: data.value,
            };
        });
    }

    const handleSelectChange = (selected: any) => {
        setSelectedOption(selected);
        setDetailAccount({ ...detailAccount, serverId: selected.value });
    };

    useEffect(() => {
        setCart({
            ...cart,
            detailAccount: {
                userId: detailAccount.userId,
                serverId: detailAccount.serverId,
            },
        });
    }, [detailAccount.serverId, detailAccount.userId]);

    return (
        <div className="bg-slate-200 shadow-md rounded-lg lg:p-7 p-4 mb-4">
            <div className="py-2 px-8 text-white rounded-lg shadow-lg shadow-slate-400 bg-[#B72025] w-fit  text-sm">
                Detail Account
            </div>
            <div className={`grid grid-cols-1 ${products.needServerId && "md:grid-cols-3"} gap-4 mt-5`}>
                <div className="col-span-1 md:col-span-2 flex flex-col">
                    <label className="mb-2 text-sm" htmlFor="userID">
                        User ID
                    </label>
                    <input
                        onChange={(e) => setDetailAccount({ ...detailAccount, userId: e.target.value })}
                        type="text"
                        name="userID"
                        id="userID"
                        className="p-4 rounded-md  text-sm"
                        value={detailAccount.userId}
                    />
                </div>
                {products.needServerId && (
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm" htmlFor="serverID">
                            Server ID
                        </label>
                        {products.typeServerId === "input" ? (
                            <input
                                onChange={(e) => setDetailAccount({ ...detailAccount, serverId: e.target.value })}
                                type="text"
                                name="serverID"
                                id="serverID"
                                className="p-4 rounded-md text-sm"
                                value={detailAccount.serverId}
                            />
                        ) : (
                            <Select
                                id="serverID"
                                value={selectedOption}
                                onChange={(e) => handleSelectChange(e)}
                                options={options}
                                placeholder="Pilih Server"
                                styles={{
                                    control: (provided, state) => ({
                                        ...provided,
                                        borderRadius: "0.375rem",
                                        padding: "0.5rem",
                                        fontSize: "0.875rem",
                                        lineHeight: "1.25rem",
                                        outline: "0px",
                                    }),
                                    singleValue: (provided, state) => ({
                                        ...provided,
                                        color: "#333",
                                    }),
                                    option: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: state.isSelected ? "#007BFF" : "white",
                                        color: state.isSelected ? "white" : "#333",
                                        cursor: "pointer",
                                        ":hover": {
                                            backgroundColor: "#f0f0f0",
                                        },
                                    }),
                                }}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailAccount;
