import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IMsgProps {
    icon: IconProp;
    msg: string;
    divClasses: string;
    fontAwesomeclass: string;
    // width: number;
    time: number;
}

const Msg: React.FC<IMsgProps> = ({ icon, msg, divClasses, fontAwesomeclass, time }) => {
    console.log(time);
    return (
        time !== 0 && (
            <div
                className={`${divClasses} w-[24rem] px-6 py-2 rounded-lg flex gap-5 shadow-md shadow-gray-600 font-montserrat overflow-hidden`}
            >
                <FontAwesomeIcon icon={icon} size="1x" className={`${fontAwesomeclass} mt-1.5`} />
                <div>
                    <h1 className="font-bold">{msg}</h1>
                </div>
                {/* <div className="absolute h-1 bg-slate-400 bottom-0 right-0" style={{ width: `${width}%` }}></div> */}
            </div>
        )
    );
};

export default Msg;
