import Game from "@/components/global/game/Game";

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
                        <Game data={data} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ListGames;
