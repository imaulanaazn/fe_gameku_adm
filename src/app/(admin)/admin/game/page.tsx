import TableGame from "@/components/admin/Game/TableGame";
import Header from "@/components/admin/Header";
import sendRequest from "@/lib/baseApi";

const Game = async () => {
    const games = await sendRequest<IGamePagination>("/api/v1/game", { cache: "no-cache" });
    return (
        <>
            <Header title="Game" />
            <TableGame game={games.data} />
        </>
    );
};

export default Game;
