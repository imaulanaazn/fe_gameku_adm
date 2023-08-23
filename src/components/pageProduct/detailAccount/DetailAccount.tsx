import { cartState } from "@/atom/cartState";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const DetailAccount = () => {
    const [cart, setCart] = useRecoilState(cartState);
    const [detailAccount, setDetailAccount] = useState({
        userId: "",
        serverId: "",
    });

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
        <div className="bg-slate-200 shadow-md rounded-lg p-7 mb-4">
            <div className="py-2 px-8 text-white rounded-lg shadow-lg shadow-slate-400 bg-[#B72025] w-fit  text-sm">
                Detail Account
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3  gap-4 mt-5">
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
                <div className="flex flex-col">
                    <label className="mb-2 text-sm" htmlFor="serverID">
                        Server ID
                    </label>
                    <input
                        onChange={(e) => setDetailAccount({ ...detailAccount, serverId: e.target.value })}
                        type="text"
                        name="serverID"
                        id="serverID"
                        className="p-4 rounded-md  text-sm"
                        value={detailAccount.serverId}
                    />
                </div>
            </div>
        </div>
    );
};

export default DetailAccount;
