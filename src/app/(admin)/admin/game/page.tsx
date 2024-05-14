"use client";

import { useState, useEffect } from "react";
import Loading from "./loading";
import AdminNavbar from "@/app/(admin)/admin/(dashboard)/components/AdminNavbar";
import TableGame from "./components/TableGame";
import AdminHeader from "@/components/admin/AdminHeader";

const AdminGame = () => {
  const [games, setGames] = useState<IGamePagination>();
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
  }, []);

  return (
    <>
      {loading && <Loading />}

      {!loading && (
        <>
          <AdminNavbar />
          <AdminHeader />
          <div className="wrapper w-full pb-6 lg:pb-8 px-6 lg:px-8 mt-6 lg:-mt-12 mb-6 lg:mb-8">
            {!loading && <>{games && <TableGame game={games} />}</>}
          </div>
        </>
      )}
    </>
  );
};

export default AdminGame;
