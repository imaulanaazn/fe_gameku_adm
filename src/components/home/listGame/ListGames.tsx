import Link from "next/link";
import Image from "next/image";

const ListGames: React.FC<ListGameProps> = ({ backgroundColor, title, data }) => {
    return (
        <div className={`${backgroundColor} font-pulse px-5 py-20 text-center`}>
            <div className="container max-w-screen-xl flex flex-col items-center">
                <div className="flex flex-col items-center gap-3">
                    <p className="font-mostserrat font-light text-xs tracking-widest">LAYANAN</p>
                    <h1 className="font-pulse font-semibold text-3xl">{title}</h1>
                    <div className="h-px bg-[#B72025] w-10"></div>
                </div>
                <div className="mt-10 flex justify-center items-center gap-4 flex-wrap lg:w-2/3">
                    {data.map((data) => (
                        <Link
                            key={data.id}
                            href={data.slug}
                            className="flex flex-col w-36 h-52 bg-white shadow-lg transform transition-transform hover:scale-105 rounded-md hover:shadow-gray-600"
                        >
                            {/* <div
                                className="w-36 h-36 mx-auto rounded-md"
                                style={{
                                    backgroundImage: `url('${data.logoUrl}')`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                }}
                            ></div> */}
                            <div className="w-36 h-36 mx-auto rounded-md">
                                <Image
                                    src={data.logoUrl}
                                    alt={data.name}
                                    className="w-full lg:h-24 h-16 object-cover"
                                    width="0"
                                    height="0"
                                    sizes="100vw"
                                    style={{ width: "100%", height: "100%" }}
                                />
                            </div>
                            <div className="py-2 px-1">
                                <div className="font-bold text-sm ">{data.name}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ListGames;
