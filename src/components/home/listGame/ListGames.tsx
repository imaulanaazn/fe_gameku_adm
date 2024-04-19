import Game from "@/components/global/game/Game";

const ListGames: React.FC<ListGameProps> = ({
  backgroundColor,
  title,
  data,
}) => {
  return (
    <div
      className={`${backgroundColor}  px-5 py-20 text-center w-full flex items-center justify-center`}
    >
      <div className="container max-w-screen-xl flex flex-col items-center">
        <div className="w-full flex justify-center items-center">
          <div className="mt-10 flex justify-center items-center gap-4 flex-wrap lg:w-2/3">
            {data.map((data) => (
              <Game data={data} key={data.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListGames;
