"use client";

import { useState, useEffect } from "react";
import Loading from "@/components/global/loading/CompLoading";
import AdminNavbar from "@/components/admin/dashboard/AdminNavbar";
import TableGame from "../../../../components/admin/game/TableGame";
import AdminHeader from "@/components/admin/AdminHeader";
import PopularGameModal from "../../../../components/admin/game/PopularGameModal";

const AdminGame = () => {
  const [games, setGames] = useState<IGamePagination>();
  const [showPopularGamesModal, setShowPopularGamesModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const getGames = async () => {
    const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/game", {
      cache: "no-cache",
      method: "GET",
      credentials: "include",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    const res = await req.json();
    if (req.ok) {
      setGames({ ...games, ...res });
    }
    setLoading(false);
  };
  useEffect(() => {
    getGames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading && <Loading />}
      {!loading && (
        <>
          <AdminNavbar />
          <AdminHeader />
          {showPopularGamesModal && games && (
            <PopularGameModal
              setShowPopularGamesModal={setShowPopularGamesModal}
            />
          )}
          <div className="wrapper w-full pb-6 lg:pb-8 px-6 lg:px-8 mt-6 lg:-mt-12 mb-6 lg:mb-8">
            <div className="w-full bg-white rounded-xl p-6 lg:p-8">
              {games && (
                <TableGame
                  game={games}
                  handlePopularGamesModal={(show: boolean) => {
                    setShowPopularGamesModal(show);
                  }}
                />
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AdminGame;
