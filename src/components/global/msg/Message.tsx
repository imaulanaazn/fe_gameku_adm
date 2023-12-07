import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { msgState } from "@/atom/msgState";
import { faCheckCircle, faInfoCircle, faTimesCircle, faWarning } from "@fortawesome/free-solid-svg-icons";
import Msg from "./Msg";

const Message = () => {
    const [msgs, setMsgs] = useRecoilState(msgState);
    const [msgId, setMsgId] = useState<string[]>([]);

    useEffect(() => {
        let timeoutId: any;

        if (msgs.length > 0) {
            const lastMsg = msgs[msgs.length - 1];
            setMsgId([...msgId, lastMsg.id]);
            if (lastMsg.time !== 0) {
                timeoutId = setTimeout(() => {
                    setMsgs((prevMsgs) => prevMsgs.slice(0, -1));
                }, lastMsg.time * 1000);
            }
        }
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [msgs]);

    return (
        <div className="absolute top-10 right-10 flex flex-col gap-2">
            {msgs.map((msg, index) => (
                <Msg
                    key={index}
                    icon={
                        msg.type === "success"
                            ? faCheckCircle
                            : msg.type === "error"
                            ? faTimesCircle
                            : msg.type === "warning"
                            ? faWarning
                            : faInfoCircle
                    }
                    divClasses={
                        msg.type === "success"
                            ? "bg-green-50 text-green-800"
                            : msg.type === "error"
                            ? "bg-red-50 text-red-800"
                            : msg.type === "warning"
                            ? "bg-yellow-50 text-yellow-800"
                            : "bg-blue-50 text-blue-800"
                    }
                    fontAwesomeclass={
                        msg.type === "success"
                            ? "text-green-400"
                            : msg.type === "error"
                            ? "text-red-400"
                            : msg.type === "warning"
                            ? "text-yellow-400"
                            : "text-blue-400"
                    }
                    msg={msg.msg}
                    time={msg.time}
                />
            ))}
        </div>
    );
};

export default Message;
