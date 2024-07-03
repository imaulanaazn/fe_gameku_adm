"use client";
import { useEffect, useState } from "react";
import Loading from "./components/loading";
import AdminHeader from "@/components/admin/AdminHeader";
import TableRole from "./components/TableRole";
import AdminNavbar from "@/components/admin/dashboard/AdminNavbar";
import { LargeNumberLike } from "crypto";
import Unauthorized from "@/components/global/401";
import { toast } from "react-toastify";

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;

export interface IAdminRoles {
  cd: string;
  id: string;
  name: string;
}

interface IAllAdminPaginationResponse {
  data: IAdmin[];
  page: number;
  total: number;
  totalPage: number;
  order: string;
  sort: string;
  limit: number;
}

export interface IAdmin {
  id: string;
  name: string;
  username: string;
  roles: IAdminRoles[];
}

async function fetchAdminRoles() {
  try {
    const response = await fetch(`${BASEURL}/v1/role`, {
      method: "GET",
      credentials: "include",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch admin menu:", error);
    return null;
  }
}

async function fetchAllAdminData() {
  try {
    const response = await fetch(`${BASEURL}/v1/admin/admin`, {
      method: "GET",
      credentials: "include",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch admin menu:", error);
    return null;
  }
}

const Manage = () => {
  const [allAdminData, setAllAdminData] =
    useState<IAllAdminPaginationResponse>();
  const [rolesData, setRolesData] = useState<IAdminRoles[]>();
  const [myData, setMyData] = useState<{ roles: string[] }>({ roles: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAllAdminData = async () => {
      setLoading(true);
      const allAdminData = await fetchAllAdminData();
      setAllAdminData(allAdminData);
      setLoading(false);
    };

    const getAllAdminRoles = async () => {
      setLoading(true);
      const adminRoles = await fetchAdminRoles();
      setRolesData(adminRoles);
      setLoading(false);
    };

    getAllAdminData();
    getAllAdminRoles();

    if (typeof window !== "undefined") {
      try {
        const storedAdminData = localStorage.getItem("admin");
        if (storedAdminData) {
          setMyData(JSON.parse(storedAdminData));
        } else {
          console.error("No admin data found in localStorage");
        }
      } catch (err) {
        console.error("Failed to parse admin data from localStorage", err);
      }
    }
  }, []);

  if (!myData.roles?.includes("owner")) {
    if (myData.roles?.includes("admin")) {
      return <Unauthorized redirect={"/admin"} />;
    } else if (myData.roles?.includes("writer")) {
      return <Unauthorized redirect={"/admin/article"} />;
    }
  }

  return (
    <>
      {loading && <Loading />}
      {!loading && (
        <>
          <AdminNavbar />
          <AdminHeader />
          <div className="stats-wrapper pb-6 lg:pb-8 px-6 lg:px-8 mt-6 lg:-mt-12">
            {allAdminData && rolesData && (
              <TableRole
                allAdminData={allAdminData.data}
                adminRoles={rolesData}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Manage;
