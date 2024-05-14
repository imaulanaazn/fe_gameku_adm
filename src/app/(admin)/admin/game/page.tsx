"use client";

import TableGame from "@/components/admin/Game/TableGame";
import Header from "@/components/admin/Header";
import { useState, useEffect } from "react";
import Loading from "./loading";
import AdminNavbar from "@/app/(admin)/admin/(dashboard)/components/AdminNavbar";

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
          <div className="iq-navbar-header h-48 bg-[url('/images/bg-header-abstract.jpg')] bg-cover rounded-b-3xl text-white px-12 pt-10">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-semibold">Halo Admin</h1>
                <p className="text-base mt-2">
                  Selamat datang di dashboard, semoga bisnis anda berjalan
                  lancar dan terus berkembang.
                </p>
              </div>
            </div>
          </div>
          <div className="stats-wrapper w-full px-8 -mt-10 mb-8">
            {!loading && <>{games && <TableGame game={games} />}</>}
          </div>
        </>
      )}
    </>
  );
};

export default AdminGame;
