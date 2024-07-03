"use client";

import { IImageCarousel } from "@/interfaces/carousels";
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DragEvent, FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { IAdmin, IAdminRoles } from "../page";

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;

interface IFormAddUser {
  handleShowForm: (value: boolean) => void;
  type?: string;
  onFormSubmit: () => void;
  adminRoles: IAdminRoles[];
}

interface IAdminData {
  name: string;
  username: string;
  password: string;
  roleIds: string[];
}

const FormAddUser: React.FC<IFormAddUser> = ({
  handleShowForm,
  type,
  adminRoles,
  onFormSubmit,
}) => {
  const [typeForm, setTypeForm] = useState(type);
  const [loading, setLoading] = useState(false);
  const [disabledButton, setDisabledButton] = useState(false);
  const [adminData, setAdminData] = useState<IAdminData>({
    name: "",
    username: "",
    password: "",
    roleIds: [],
  });

  const handleAddAdmin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleShowForm(false);
    try {
      const response = await fetch(`${BASEURL}/v1/admin/admin`, {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(adminData),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.message);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      toast.success("berhasil menambahkan admin baru");
      onFormSubmit();
    } catch (error) {
      console.error("Failed to add admin:", error);
      return null;
    }
  };

  if (typeForm !== "add") {
    setDisabledButton(true);
  }

  const handleRoles = (roleId: string) => {
    setAdminData((prev) => {
      const roleIndex = prev.roleIds.indexOf(roleId);
      if (roleIndex >= 0) {
        return { ...prev, roleIds: prev.roleIds.filter((id) => id !== roleId) };
      } else {
        return { ...prev, roleIds: [...prev.roleIds, roleId] };
      }
    });
  };

  return (
    <div
      onDrop={(e) => e.preventDefault()}
      onDragOver={(e) => e.preventDefault()}
      className="w-full h-screen bg-gray-800 bg-opacity-70 absolute top-0 left-0 flex items-center justify-center z-50"
    >
      <div className="md:w-96 h-screen md:h-max lg:h-auto md:max-h-screen w-full bg-white p-8  md:rounded-xl">
        <div className="flex justify-between mb-6 lg:mb-8 items-center">
          <h1 className="font-medium text-xl md:text-2xl text-neutral-800">
            {typeForm === "add" ? "Tambah Admin Baru" : `Ubah Admin`}
          </h1>
          <div
            className="group w-8 h-8 flex items-center justify-center cursor-pointer bg-primary-100 hover:bg-primary-900 rounded-full transition-all"
            onClick={() => handleShowForm(false)}
          >
            <FontAwesomeIcon
              icon={faTimes}
              className="text-primary-900 group-hover:text-white text-xl"
            />
          </div>
        </div>
        <form onSubmit={handleAddAdmin}>
          <div className="">
            <div className="mt-6">
              <div>
                <label
                  htmlFor="name"
                  className="font-medium text-base text-neutral-900 inline-block"
                >
                  Name
                  {typeForm === "add" && (
                    <span className="text-red-800 font-bold">*</span>
                  )}
                </label>
                <div className="w-full">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required={true}
                    placeholder="Nama"
                    autoComplete="off"
                    value={adminData.name}
                    readOnly={typeForm === "detail"}
                    onChange={(e) =>
                      setAdminData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className={`${
                      typeForm === "detail"
                        ? "cursor-not-allowed text-neutral-700"
                        : "text-primary-900"
                    } py-3 px-2 w-full border mt-2 rounded-md border-primary-900 focus:border-primary-900 focus:bg-primary-50 text-sm placeholder:text-sm`}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="username"
                  className="font-medium text-base text-neutral-900 inline-block"
                >
                  Username
                  {typeForm === "add" && (
                    <span className="text-red-800 font-bold">*</span>
                  )}
                </label>
                <div className="w-full">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    required={true}
                    placeholder="Username"
                    autoComplete="off"
                    value={adminData.username}
                    readOnly={typeForm === "detail"}
                    onChange={(e) =>
                      setAdminData((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    className={`${
                      typeForm === "detail"
                        ? "cursor-not-allowed text-neutral-700"
                        : "text-primary-900"
                    } py-3 px-2 w-full border mt-2 rounded-md border-primary-900 focus:border-primary-900 focus:bg-primary-50 text-sm placeholder:text-sm`}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="password"
                  className="font-medium text-base text-neutral-900 inline-block"
                >
                  Password
                </label>
                <div className="w-full">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    required={true}
                    placeholder="password"
                    autoComplete="off"
                    value={adminData.password}
                    readOnly={typeForm === "detail"}
                    onChange={(e) =>
                      setAdminData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className={`${
                      typeForm === "detail"
                        ? "cursor-not-allowed bg-gray-100"
                        : "text-primary-900"
                    } py-3 px-2 w-full border mt-2 rounded-md border-primary-900 focus:border-primary-900 focus:bg-primary-50 text-sm placeholder:text-sm`}
                  />
                </div>
              </div>
              <div className="mt-4">
                <span className="font-medium text-base text-neutral-900 inline-block">
                  Admin Role
                </span>

                <div className="flex mt-3 gap-4 items-center">
                  {adminRoles.map((role) => (
                    <div key={role.id} className="flex gap-2 items-center">
                      <input
                        type="checkbox"
                        id={role.id}
                        className="rounded text-primary-900 focus:ring-primary-900"
                        onChange={() => {
                          handleRoles(role.id);
                        }}
                      />{" "}
                      <label htmlFor={role.id}>{role.name}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {typeForm === "detail" && (
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setTypeForm("edit")}
                type="button"
                className="bg-primary-900 hover:bg-red-600 text-white font-semibold w-24 py-3 rounded-md"
              >
                Edit
              </button>
            </div>
          )}
          {typeForm !== "detail" && (
            <div className="mt-4 flex justify-end gap-4">
              {loading ? (
                <>
                  <div className="bg-gray-300 text-gray-800 font-semibold w-24 text-center py-3 rounded-md cursor-not-allowed">
                    <FontAwesomeIcon icon={faSpinner} spin />
                  </div>
                  <div className="bg-gray-300 text-gray-800 font-semibold w-24 text-center py-3 rounded-md cursor-not-allowed">
                    <FontAwesomeIcon icon={faSpinner} spin />
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleShowForm(false)}
                    type="button"
                    className="hover:bg-primary-900 hover:text-white text-primary-900 font-medium w-24 py-3 rounded-md border border-primary-900 transition-all"
                  >
                    Batalkan
                  </button>
                  <button
                    type="submit"
                    disabled={disabledButton}
                    className={`${
                      disabledButton
                        ? "bg-opacity-50 cursor"
                        : "bg-opacity-100 hover:bg-red-600"
                    } bg-primary-900 text-white font-medium w-24 py-3 rounded-md transition-all`}
                  >
                    Simpan
                  </button>
                </>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormAddUser;
