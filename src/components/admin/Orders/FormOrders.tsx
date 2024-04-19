"use client";

import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import id from "date-fns/locale/id";
import dayjs from "dayjs";
import formatter from "@/lib/formatter";
import { toast } from "react-toastify";
registerLocale("id", id);
import { Tooltip as ReactTooltip } from "react-tooltip";
interface IForm {
    handleShowForm: (defaultValue: boolean) => void;
    getNewData: () => void;
    type?: string;
    data?: IOrderHistoryWithDetail;
}

const FormOrders: React.FC<IForm> = ({ handleShowForm, getNewData, type, data }) => {
    const [loading, setLoading] = useState(false);
    const [newData, setNewData] = useState<IOrderHistoryWithDetail>({
        id: "",
        invoiceId: "",
        customerId: "",
        paymentMethodId: "",
        game: "",
        productName: "",
        paymentMethod: "",
        totalAmt: 0,
        feeAmt: 0,
        discAmt: 0,
        promoCd: "",
        status: "",
        completedAt: "",
        createdAt: "",
        updatedAt: "",
        mobileNumber: "",
        productId: "",
        logoUrl: "",
        quantity: 0,
        custName: "",
        isError: false,
        isCanResend: false,
        remark: "",
        detail: {
            id: "",
            orderId: "",
            productId: "",
            userId: "",
            serverId: "",
            gameVoucher: "",
            amount: 0,
            quantity: 0,
            username: "",
        },
    });

    const [typeForm, setTypeForm] = useState("");

    useEffect(() => {
        if (type !== "add" && data) {
            setNewData({
                id: data.id,
                invoiceId: data.invoiceId,
                customerId: data.customerId,
                paymentMethodId: data.paymentMethodId,
                game: data.game,
                productName: data.productName,
                paymentMethod: data.paymentMethod,
                totalAmt: data.totalAmt,
                feeAmt: data.feeAmt,
                discAmt: data.discAmt,
                promoCd: data.promoCd,
                status: data.status,
                completedAt: dayjs(data.completedAt).toDate(),
                createdAt: dayjs(data.createdAt).toDate(),
                updatedAt: dayjs(data.updatedAt).toDate(),
                mobileNumber: data.mobileNumber,
                productId: data.productId,
                logoUrl: data.logoUrl,
                quantity: data.quantity,
                custName: data.custName,
                isError: data.isError,
                isCanResend: data.isCanResend,
                remark: data.remark,
                detail: {
                    id: data.detail.id,
                    orderId: data.detail.orderId,
                    productId: data.detail.productId,
                    userId: data.detail.userId,
                    serverId: data.detail.serverId,
                    gameVoucher: data.detail.gameVoucher,
                    amount: data.detail.amount,
                    quantity: data.detail.quantity,
                    username: data.detail.username,
                },
            });
        }

        setTypeForm(type || "");
    }, []);

    const checkStatus = (status: string) => {
        if (status === "1") {
            return "Belum Dibayar";
        } else if (status === "2") {
            return "Belum diproses game";
        } else if (status === "3") {
            return "Berhasil";
        } else if (status === "4") {
            return "Gagal";
        } else if (status === "5") {
            return "Kadaluarsa";
        } else if (status === "6") {
            return "Sedang Diproses";
        }
    };

    const handleClickPaid = async () => {
        setLoading(true);
        const toastId = toast.loading("Sedang menyimpan data promo...");
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/order/" + newData.id, {
            cache: "no-cache",
            method: "PUT",
            credentials: "include",
            headers: {
                "content-type": "application/json",
            },
        });

        if (req.ok) {
            getNewData();
            toast.update(toastId, {
                render: "Berhasil menyelesaikan status order",
                type: "success",
                isLoading: false,
                position: "top-right",
                autoClose: 3000,
            });
        } else {
            const res = await req.json();
            toast.update(toastId, {
                render: res.message,
                type: "error",
                isLoading: false,
                position: "top-right",
                autoClose: 3000,
            });
        }
        setLoading(false);
        handleShowForm(false);
    };

    const handleClickCopyTrx: any = () => {
        navigator.clipboard.writeText(
            `${data?.invoiceId}${data?.username ? `\n${data.username}` : ""}${
                data?.detail.userId ? `\n${data.detail.userId}` : ""
            }${data?.detail.serverId ? ` ${data.detail.serverId}` : ""}\n${data?.productName} (${data?.quantity}x)\n${
                data?.game
            }`,
        );
    };

    const handleResendOrder = async () => {
        setLoading(true);
        const toastId = toast.loading("Sedang mengirim ulang transaksi...");
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/order/resend", {
            cache: "no-cache",
            method: "POST",
            credentials: "include",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                orderId: newData.id,
            }),
        });

        if (req.ok) {
            getNewData();
            toast.update(toastId, {
                render: "Berhasil mengirim ulang transaksi",
                type: "success",
                isLoading: false,
                position: "top-right",
                autoClose: 3000,
            });
        } else {
            const res = await req.json();
            toast.update(toastId, {
                render: res.message,
                type: "error",
                isLoading: false,
                position: "top-right",
                autoClose: 3000,
            });
        }
        setLoading(false);
        handleShowForm(false);
    };

    return (
        <div className="w-full h-screen bg-gray-800 bg-opacity-30 absolute top-0 left-0 flex items-center justify-center z-[10] font-montserrat py-10">
            <div className="md:w-3/4 md:max-h-full w-full bg-white shadow p-4 rounded overflow-y-auto relative">
                <div className="flex justify-between border-b-2 py-2 border-gray-300 items-center">
                    <h1 className="text-xl">Detail Order</h1>
                    <div
                        className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-400 rounded-full"
                        onClick={() => handleShowForm(false)}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
                <form>
                    <div className="mt-3 w-full">
                        <label htmlFor="invoiceId">Akun</label>
                        <div className="w-full mt-2">
                            <input
                                disabled={typeForm === "detail"}
                                required
                                type="text"
                                name="invoiceId"
                                id="invoiceId"
                                autoComplete="off"
                                defaultValue={newData.custName}
                                className={`cursor-not-allowed bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
                            />
                        </div>
                    </div>
                    <div className="mt-3 flex gap-3">
                        <div className="w-1/2">
                            <label htmlFor="invoiceId">Nomor Transaksi</label>
                            <div className="w-full mt-2">
                                <input
                                    disabled={typeForm === "detail"}
                                    required
                                    type="text"
                                    name="invoiceId"
                                    id="invoiceId"
                                    autoComplete="off"
                                    defaultValue={newData.invoiceId}
                                    className={`cursor-not-allowed bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
                                />
                            </div>
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="mobileNumber">Nomor Handphone</label>
                            <div className="w-full mt-2">
                                <input
                                    disabled={typeForm === "detail"}
                                    required
                                    type="text"
                                    name="mobileNumber"
                                    id="mobileNumber"
                                    autoComplete="off"
                                    defaultValue={newData.mobileNumber}
                                    className={`cursor-not-allowed bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 flex gap-3">
                        <div className="w-1/2">
                            <label htmlFor="game">Produk</label>
                            <div className="w-full mt-2">
                                <input
                                    disabled={typeForm === "detail"}
                                    required
                                    type="text"
                                    name="game"
                                    id="game"
                                    autoComplete="off"
                                    defaultValue={newData.game}
                                    className={`cursor-not-allowed bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
                                />
                            </div>
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="productName">Denom</label>
                            <div className="w-full mt-2">
                                <input
                                    disabled={typeForm === "detail"}
                                    required
                                    type="text"
                                    name="productName"
                                    id="productName"
                                    autoComplete="off"
                                    defaultValue={newData.productName}
                                    className={`cursor-not-allowed bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 flex gap-3">
                        <div className="w-1/2">
                            <label htmlFor="quantity">Kuantitas</label>
                            <div className="w-full mt-2">
                                <input
                                    disabled={typeForm === "detail"}
                                    required
                                    type="text"
                                    name="quantity"
                                    id="quantity"
                                    autoComplete="off"
                                    defaultValue={data?.quantity ? data.quantity : newData.quantity}
                                    className={`cursor-not-allowed bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
                                />
                            </div>
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="totalAmt">Total Pembayaran</label>
                            <div className="w-full mt-2">
                                <input
                                    disabled={typeForm === "detail"}
                                    required
                                    type="text"
                                    name="totalAmt"
                                    id="totalAmt"
                                    autoComplete="off"
                                    defaultValue={formatter(data?.totalAmt ? data.totalAmt : newData.totalAmt)}
                                    className={`cursor-not-allowed bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 flex gap-3">
                        <div className="w-1/2">
                            <label htmlFor="feeAmt">Biaya admin</label>
                            <div className="w-full mt-2">
                                <input
                                    disabled={typeForm === "detail"}
                                    required
                                    type="text"
                                    name="feeAmt"
                                    id="feeAmt"
                                    autoComplete="off"
                                    defaultValue={formatter(data?.feeAmt ? data.feeAmt : newData.feeAmt)}
                                    className={`cursor-not-allowed bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
                                />
                            </div>
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="discAmt">Total Diskon</label>
                            <div className="w-full mt-2">
                                <input
                                    disabled={typeForm === "detail"}
                                    required
                                    type="text"
                                    name="discAmt"
                                    id="discAmt"
                                    autoComplete="off"
                                    defaultValue={formatter(data?.discAmt ? data.discAmt : newData.discAmt)}
                                    className={`cursor-not-allowed bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 flex gap-3">
                        <div className="w-1/2">
                            <label htmlFor="paymentMethod">Metode Pembayaran</label>
                            <div className="w-full mt-2">
                                <input
                                    disabled={typeForm === "detail"}
                                    required
                                    type="text"
                                    name="paymentMethod"
                                    id="paymentMethod"
                                    autoComplete="off"
                                    defaultValue={newData.paymentMethod}
                                    className={`cursor-not-allowed bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
                                />
                            </div>
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="promoCd">Kode Promo</label>
                            <div className="w-full mt-2">
                                <input
                                    disabled={typeForm === "detail"}
                                    required
                                    type="text"
                                    name="promoCd"
                                    id="promoCd"
                                    autoComplete="off"
                                    defaultValue={newData.promoCd}
                                    className={`cursor-not-allowed bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 flex gap-3">
                        <div className="w-1/2">
                            <label htmlFor="userId">User Id</label>
                            <div className="w-full mt-2">
                                <input
                                    disabled={typeForm === "detail"}
                                    required
                                    type="text"
                                    name="userId"
                                    id="userId"
                                    autoComplete="off"
                                    defaultValue={newData.detail.userId}
                                    className={`cursor-not-allowed bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
                                />
                            </div>
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="serverId">Server Id</label>
                            <div className="w-full mt-2">
                                <input
                                    disabled={typeForm === "detail"}
                                    required
                                    type="text"
                                    name="serverId"
                                    id="serverId"
                                    autoComplete="off"
                                    defaultValue={newData.detail.serverId}
                                    className={`cursor-not-allowed bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 w-full">
                        <label htmlFor="gameVoucher">Game Voucher</label>
                        <textarea
                            name="gameVoucher"
                            id="gameVoucher"
                            cols={30}
                            rows={10}
                            defaultValue={
                                newData.detail.gameVoucher && JSON.parse(newData.detail.gameVoucher).join("\n")
                            }
                            disabled={true}
                            className={`cursor-not-allowed bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full resize-none`}
                        />
                    </div>
                    {newData?.detail.username && (
                        <div className="mt-3 w-full">
                            <label htmlFor="username">Username Game</label>
                            <div className="w-full mt-2">
                                <input
                                    disabled={typeForm === "detail"}
                                    required
                                    type="text"
                                    name="username"
                                    id="username"
                                    autoComplete="off"
                                    defaultValue={newData?.detail.username}
                                    className={`cursor-not-allowed bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
                                />
                            </div>
                        </div>
                    )}
                    <div className="mt-3 w-full">
                        <label htmlFor="serverId">Status</label>
                        <div className="w-full mt-2">
                            <input
                                disabled={typeForm === "detail"}
                                required
                                type="text"
                                name="serverId"
                                id="serverId"
                                autoComplete="off"
                                defaultValue={checkStatus(newData.status)}
                                className={`cursor-not-allowed bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
                            />
                        </div>
                    </div>
                    {newData.status === "6" && newData.isError && (
                        <div className="mt-3 w-full">
                            <label htmlFor="serverId">Error</label>
                            <div className="w-full mt-2">
                                <input
                                    disabled={typeForm === "detail"}
                                    required
                                    type="text"
                                    name="serverId"
                                    id="serverId"
                                    autoComplete="off"
                                    defaultValue={newData.remark}
                                    className={`cursor-not-allowed bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none rounded-md py-3 px-2 w-full`}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-2 sticky -bottom-4 bg-white py-5">
                        <div className="relative flex gap-2">
                            {newData.status === "6" && newData.isError && newData.isCanResend && (
                                <button
                                    type="button"
                                    disabled={false}
                                    onClick={handleResendOrder}
                                    className={`hover:bg-green-400 bg-green-600 text-white font-semibold py-3 px-5 rounded-md`}
                                >
                                    Resend Order
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={handleClickCopyTrx}
                                className="hover:bg-green-400 bg-green-600 text-white font-semibold py-3 px-5 rounded-md"
                                data-tooltip-id="tooltip-unpopular"
                                data-tooltip-content="Berhasil dicopy"
                            >
                                Copy Data Trx
                                <ReactTooltip
                                    id="tooltip-unpopular"
                                    style={{
                                        fontSize: "12px",
                                        padding: "10px",
                                    }}
                                    openOnClick
                                    delayHide={1000}
                                />
                            </button>
                        </div>
                        {newData.status === "2" && (
                            <>
                                {loading ? (
                                    <div className="bg-gray-300 text-gray-800 font-semibold w-24 text-center py-3 rounded-md cursor-not-allowed">
                                        <FontAwesomeIcon icon={faSpinner} spin />
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        disabled={false}
                                        onClick={handleClickPaid}
                                        className={`${
                                            false
                                                ? "bg-opacity-50 cursor-not-allowed"
                                                : "bg-opacity-100 hover:bg-green-400"
                                        } bg-green-600 text-white font-semibold py-3 px-5 rounded-md`}
                                    >
                                        Selesaikan
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormOrders;
