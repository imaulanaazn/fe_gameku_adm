"use client";

import { userAdmin } from "@/atom/userAdminState";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import FormAddUser from "./FormAddUser";
import Loading from "./loading";
import { IAdmin, IAdminRoles } from "../page";
import { toast } from "react-toastify";

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;

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
      response.status === 403 &&
        toast.error("Kamu tidak memiliki izin untuk mengakses sumber daya ini");
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch admin menu:", error);
    return null;
  }
}

const TableRole: React.FC<{
  allAdminData: IAdmin[];
  adminRoles: IAdminRoles[];
}> = ({ allAdminData, adminRoles }) => {
  const [loading, setLoading] = useState(false);
  const [typeForm, setTypeForm] = useState<"edit" | "add">("add");
  const [showForm, setShowForm] = useState(false);
  const [adminData, setAdminData] = useState(allAdminData);

  async function handleRoleChange({
    adminId,
    role,
  }: {
    adminId: string;
    role: IAdminRoles;
  }) {
    let tempAdmin = adminData.map((admin) => {
      if (admin.id === adminId) {
        const roleIndex = admin.roles.findIndex(
          (adminRole) => adminRole.id === role.id
        );

        if (roleIndex !== -1) {
          return {
            ...admin,
            roles: admin.roles.filter((roleAdmin) => roleAdmin.id !== role.id),
          };
        } else {
          return {
            ...admin,
            roles: [...admin.roles, { ...role }],
          };
        }
      }
      return admin;
    });
    setAdminData(tempAdmin);

    try {
      const newRoles = tempAdmin
        .find((admin) => admin.id === adminId)
        ?.roles.map((role) => role.id);

      const response = await fetch(`${BASEURL}/v1/role`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "content-type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ adminId, roleIds: newRoles }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to fetch admin menu:", error);
      toast.error("gagal mengupdate admin. silahkan coba lagi");
    }
  }

  async function handleDeleteAdmin(adminId: string) {
    try {
      const response = await fetch(`${BASEURL}/v1/admin/admin?id=${adminId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      toast.success("berhasil menghapus admin");
      getAllAdminData();
    } catch (error) {
      console.error("Failed to fetch admin menu:", error);
      toast.error("gagal menghapus admin. silahkan coba lagi");
    }
  }

  const getAllAdminData = async () => {
    setLoading(true);
    const allAdminData = await fetchAllAdminData();
    setAdminData(allAdminData.data);
    setLoading(false);
  };

  return (
    <>
      {showForm && (
        <FormAddUser
          adminRoles={adminRoles}
          onFormSubmit={() => {
            getAllAdminData();
          }}
          type={typeForm}
          handleShowForm={() => {
            setShowForm(false);
          }}
        />
      )}
      <div className="w-full overflow-x-scroll md:overflow-x-auto overflow-y-hidden bg-white rounded-2xl p-6 lg:p-8">
        <div>
          <div className="flex gap-6 lg:gap-8 items-center justify-between">
            <h1 className="font-medium text-xl md:text-2xl text-neutral-800">
              Manage Admin
            </h1>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setTypeForm("add");
              }}
              className="shrink-0 flex justify-between py-2 px-3 md:py-3 md:px-4 gap-2 md:gap-4 items-center bg-primary-900 hover:bg-red-600 text-white rounded-md cursor-pointer"
            >
              <p>Admin Baru</p>
              <FontAwesomeIcon icon={faPlus} size="lg" />
            </button>
          </div>
          {loading && <Loading />}
          {!loading && (
            <div className="flex flex-col mt-6">
              <div className="overflow-x-auto">
                <div className="w-max sm:w-full inline-block align-middle">
                  <div className="overflow-hidden overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="px-4 py-4 bg-slate-100">
                        <tr>
                          <th
                            scope="col"
                            className="p-4 lg:py-4 lg:py-5 text-xs font-bold text-neutral-600 uppercase text-left"
                          >
                            Nama
                          </th>
                          {adminRoles.map((role) => (
                            <th
                              key={role.id}
                              scope="col"
                              className="p-4 lg:py-4 lg:py-5 text-xs font-bold text-neutral-600 uppercase text-center"
                            >
                              {role.name}
                            </th>
                          ))}
                          <th
                            scope="col"
                            className="p-4 lg:py-4 lg:py-5 text-xs font-bold text-neutral-600 uppercase text-center"
                          >
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      {adminData.length > 0 && (
                        <tbody className="divide-y divide-gray-200">
                          {adminData.map((admin) => (
                            <tr
                              key={admin.id}
                              className={`bg-white hover:bg-gray-100`}
                            >
                              <td className="px-4 py-4 text-base text-gray-800  whitespace-nowrap text-left">
                                {admin.name}
                              </td>
                              {adminRoles.map((role) => (
                                <td
                                  key={role.id}
                                  className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-center"
                                >
                                  <input
                                    type="checkbox"
                                    name=""
                                    id=""
                                    onChange={() =>
                                      handleRoleChange({
                                        adminId: admin.id,
                                        role: role,
                                      })
                                    }
                                    defaultChecked={
                                      admin.roles.find(
                                        (adminRole) => adminRole.id === role.id
                                      )
                                        ? true
                                        : false
                                    }
                                    className="rounded text-primary-900 border-primary-900 focus:ring-primary-900"
                                  />
                                </td>
                              ))}
                              <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-center flex gap-4 items-center justify-center">
                                {/* <button
                                  className="text-lg text-primary-900"
                                  onClick={() => {
                                    setShowForm(true);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </button> */}
                                <button
                                  type="button"
                                  className="text-lg text-primary-900"
                                  onClick={() => {
                                    handleDeleteAdmin(admin.id);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      )}
                    </table>
                    {adminData.length < 0 && (
                      <h1 className="text-center text-lg font-medium text-slate-600 mx-auto my-12">
                        No Data Found
                      </h1>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* <Pagination
          onPageChange={handlePageClick}
          page={user.page}
          limit={user.limit}
          total={user.total}
          totalPage={user.totalPage}
        /> */}
        </div>
      </div>
    </>
  );
};

export default TableRole;
