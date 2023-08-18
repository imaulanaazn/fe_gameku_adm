import ButtonSocialMedia from "./ButtonSocialMedia";
import { faWhatsapp, faInstagram, faTiktok, faYoutube } from "@fortawesome/free-brands-svg-icons";
import styles from "./Footer.module.css";
import Link from "next/link";
import Image from "next/image";

const socialMedia = [
    {
        title: "Whatsapp",
        icon: faWhatsapp,
        to: "https://api.whatsapp.com/send",
    },
    {
        title: "Instagram",
        icon: faInstagram,
        to: "https://instagram.com/",
    },
    {
        title: "Tiktok",
        icon: faTiktok,
        to: "https://tiktok.com/",
    },
    {
        title: "Youtube",
        icon: faYoutube,
        to: "https://youtube.com",
    },
];

const Footer = () => {
    return (
        <div className="mx-auto">
            <div className="flex px-5 lg:px-0 justify-center items-center gap-10 py-10 bg-white flex-wrap">
                <div className="flex flex-col items-center gap-3 lg:items-start">
                    <p className="font-montserrat font-light text-xs tracking-widest">OFFICIAL</p>
                    <h1 className="font-pulse font-semibold text-xl">Social Media</h1>
                    <div className="h-px bg-[#B72025] w-10"></div>
                </div>
                <div className="flex items-start gap-3 flex-wrap justify-between">
                    {socialMedia.map((value, i) => (
                        <ButtonSocialMedia title={value.title} icon={value.icon} to={value.to} key={i} />
                    ))}
                </div>
            </div>
            <div className="flex flex-col px-5 sm:px-10 md:flex-row justify-center items-start gap-10 bg-[#B72025] mx-auto py-10 text-white font-montserrat text-sm flex-wrap">
                <Link href="/" className="h-24 w-24">
                    <Image
                        src="/images/logo_gasskeun.jpg"
                        alt="Logo Jokiku gasskeun"
                        width="0"
                        height="0"
                        sizes="100vw"
                        style={{ width: "100%", height: "100%" }}
                    />
                </Link>
                <div className=" max-w-xs">
                    <p className="pb-2 font-bold text-lg">About us</p>
                    <p className="font-semibold text-sm">
                        Gasskeun Top Up adalah sebuah website topup game online terpercaya di Indonesia mulai dari
                        Mobile Legends, PUBG Mobile, Free Fire, dan masih banyak lainnya. untuk mempermudah pembayaran
                        anda disini kami juga menyediokan metode pembayaran Alfamart, Bank BCA, Bank Mandiri, Bank BNI
                        DANA, OVO, dll
                    </p>
                </div>
                <div className="lg:h-36 lg:w-px md:w-full md:bg-white md:border-1 md:h-px"></div>
                <div className="max-w-sm">
                    <p className="pb-2 font-bold text-lg">Kategori</p>
                    <ul className={`${styles["custom-list"]} font-semibold text-sm`}>
                        <li>Mobile Legend(Fast) - Diamond Fast 1-15 Menit</li>
                        <li>Free Fire via Login</li>
                        <li>PUBG Mobile INDO - Uknown Cash (UC)</li>
                    </ul>
                    <div className="flex pt-10 justify-center items-center gap-5 font-bold text-lg">
                        <p>
                            MAU JOIN <br></br>RESELLER?
                        </p>
                        <Link
                            href="https://api.whatsapp.com/send?phone=628112065672"
                            className="sm:py-4 sm:px-8 py-2 px-3 bg-white text-[#B72025] rounded-lg"
                        >
                            GABUNG SEKARANG!
                        </Link>
                    </div>
                </div>
            </div>
            <div className="bg-black text-sm text-white font-pulse text-center">
                <p className="p-2">Gasskeun Topup 2021</p>
            </div>
        </div>
    );
};

export default Footer;
