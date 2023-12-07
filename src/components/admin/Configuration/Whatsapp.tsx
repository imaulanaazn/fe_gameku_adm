"use client";

import React, { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import QRCode from "react-qr-code";
import { Id, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import FormTestWhatsapp from "./FormTestWhatsapp";

interface IWhatsappCheckStatus {
    status: "CONNECTED" | "DISCONNECTED" | "CONNECTING" | "CHECKING" | "SCANQR";
    args?: any;
}

const Whatsapp = () => {
    const [qrCode, setQrCode] = useState("");
    const [socket, setSocket] = useState<Socket | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [statuses, setStatuses] = useState<IWhatsappCheckStatus>({
        status: "CHECKING",
        args: "",
    });
    const [argsStyle, setArgsStyle] = useState({
        color: "",
        text: "",
    });

    const handleLogoutWhatsapp = () => {
        socket?.emit("whatsapp:logout");
    };

    useEffect(() => {
        const socket = io(process.env.NEXT_PUBLIC_SOCKET_BASE_URL || "http://localhost:3001", {
            extraHeaders: {
                "ngrok-skip-browser-warning": "true",
            },
        });
        socket?.emit("qrcode:check");
        setSocket(socket);

        socket?.on("qrcode:get", (qr: string) => {
            setQrCode(qr);
        });

        socket?.on("qrcode:status", (data: IWhatsappCheckStatus) => {
            setStatuses(data);
            if (data.status !== "SCANQR") {
                setQrCode("");
            }
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (statuses.status === "DISCONNECTED" || statuses.status === "SCANQR") {
            setArgsStyle({
                color: "bg-red-600",
                text: "Tidak Terhubung",
            });
        } else if (statuses.status === "CONNECTING") {
            setArgsStyle({
                color: "bg-blue-600",
                text: "Menghubungkan",
            });
        } else if (statuses.status === "CONNECTED") {
            setArgsStyle({
                color: "bg-green-600",
                text: "Terhubung",
            });
        } else {
            setArgsStyle({
                color: "bg-yellow-600",
                text: "Mengecek sesi",
            });
        }
    }, [statuses.args, statuses.status]);

    return (
        <>
            {showForm && <FormTestWhatsapp handleShowForm={(value: boolean) => setShowForm(value)} />}
            <div className="mt-4">
                <div className="flex space-x-5 bg-white">
                    <div className="flex items-center justify-center w-[200px] h-[200px] bg-gray-100 rounded=lg shadow-md max-w-[200px]">
                        {qrCode && <QRCode size={200} value={qrCode} viewBox={`0 0 256 256`} />}
                        {statuses.status !== "CONNECTED" && !qrCode && (
                            <div className="h-full w-[200px] flex flex-col items-center gap-2 justify-center">
                                <FontAwesomeIcon icon={faSpinner} spin size="xl" />
                                <p>{statuses.args}</p>
                            </div>
                        )}
                        {statuses.status === "CONNECTED" && (
                            <div className="h-full w-[200px]">
                                <Image
                                    src="https://firebasestorage.googleapis.com/v0/b/gasskeun-topup.appspot.com/o/assets%2Fconfig%2Fwhatsapp.png?alt=media&token=86744128-86e2-4c2c-9bf4-2d1d3334d612&_gl=1*1red0dx*_ga*NDI2MzY2MjI3LjE2OTg3NTc4MDc.*_ga_CW55HF8NVT*MTY5OTAwODgyNS4yLjEuMTY5OTAwODg4NS42MC4wLjA."
                                    alt={`Banner Carousel`}
                                    width="0"
                                    height="0"
                                    sizes="100vw"
                                    style={{ width: "100%", height: "100%" }}
                                    className="rounded-lg object-cover"
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col justify-between w-full">
                        <div>
                            {statuses.status === "DISCONNECTED" ||
                                (statuses.status === "SCANQR" && (
                                    <h1>Scan QRCODE untuk menghubungkan dengan whatsapp</h1>
                                ))}
                            <div className="flex items-center gap-2 mt-2">
                                <div className={`${argsStyle.color} w-4 h-4 rounded-full`}></div>
                                <p>{argsStyle.text}</p>
                            </div>
                        </div>
                        {statuses.status === "CONNECTED" && (
                            <div className="flex flex-col w-1/6 gap-2 text-xs">
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="bg-gray-600 text-white p-4 rounded-md shadow-lg hover:bg-gray-400"
                                >
                                    Test Whatsapp
                                </button>
                                <button
                                    onClick={handleLogoutWhatsapp}
                                    className="bg-red-600 text-white p-4 rounded-md shadow-lg hover:bg-red-400"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Whatsapp;
