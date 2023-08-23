import FormLogin from "@/components/login/FormLogin";
import { Metadata } from "next";
import Link from "next/link";

const Login = () => {
    return (
        <div
            style={{
                // backgroundImage: `url('https://via.placeholder.com/1000x1000')`,
                backgroundColor: "black",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
            }}
            className="w-full h-fit mx-auto grid align-middle"
        >
            <div className="mx-auto pt-10 h-fit min-h-screen text-center w-full p-5 font-pulse text-white flex flex-col items-center">
                <div className="flex flex-col items-center gap-3 mb-10">
                    <p className="font-pulse font-light text-xs tracking-widest">GASSKEUN TOPUP</p>
                    <h1 className="font-pulse font-semibold text-3xl">Masuk</h1>
                </div>
                <FormLogin />
                <p className="font-pulse text-sm mt-5">
                    Belum punya akun? Silahkan untuk{" "}
                    <Link href="/register" className=" underline">
                        Daftar
                    </Link>
                </p>
            </div>
        </div>
    );
};

export const generateMetadata = () => {
    return {
        title: "Login Akun - Gasskeun Topup: Akses Cepat ke Layanan Topup Game",
        description: undefined,
    } as Metadata;
};

export default Login;
