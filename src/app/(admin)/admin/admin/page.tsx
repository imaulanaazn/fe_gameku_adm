"use client";
import { useEffect, useState } from "react";
import Loading from "./components/loading";
import AdminHeader from "@/components/admin/AdminHeader";
import TableRole from "./components/TableRole";
import AdminNavbar from "@/components/admin/dashboard/AdminNavbar";
import { LargeNumberLike } from "crypto";

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
  roles: string[];
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
  }, []);

  console.log({ allAdminData, rolesData });

  const myData = JSON.parse(localStorage.getItem("admin") || "");
  if (!myData.roles.includes("owner"))
    return <div>you&squo;re not authorized to access this page</div>;

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
