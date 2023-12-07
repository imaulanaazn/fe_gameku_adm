import Link from "next/link";

import styles from "./Header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import Image from "next/image";

interface SideMenuProps {
    onClose: () => void;
    currentPath: string;
    logo: string;
}

const links = [
    {
        id: 1,
        name: "HOME",
        url: "/",
    },
    {
        id: 2,
        name: "LAYANAN",
        url: "/layanan",
    },
    {
        id: 3,
        name: "CEK PESANAN",
        url: "/cek-pesanan",
    },
];

const SideMenu: React.FC<SideMenuProps> = ({ onClose, currentPath, logo }) => {
    return (
        <div className={`absolute top-0 left-0 h-screen w-52 bg-[#B72025] z-50 shadow-lg shadow-gray-600`}>
            <div className="mt-5 flex items-center flex-col relative">
                <div className="w-28 h-28 rounded-lg">
                    <Image
                        src={logo}
                        alt="Logo Gasskeun Topup"
                        className="rounded-lg object-contain"
                        width="0"
                        height="0"
                        sizes="100vw"
                        style={{ width: "100%", height: "100%" }}
                    />
                </div>
                <div className="flex flex-col mt-5">
                    {links.map((link, index) => (
                        <Link
                            onClick={() =>
                                setTimeout(() => {
                                    onClose();
                                }, 1000)
                            }
                            key={link.id}
                            href={link.url}
                            className={`mx-4 px-10 py-5 ${styles.nav_link} ${
                                currentPath === link.url ? styles.nav_active : ""
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>
            <div className="absolute right-2 top-4">
                <FontAwesomeIcon icon={faTimes} size="2xl" className="text-white cursor-pointer" onClick={onClose} />
            </div>
        </div>
    );
};

export default SideMenu;
