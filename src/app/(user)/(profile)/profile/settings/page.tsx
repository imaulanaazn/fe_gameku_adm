import Maintenance from "@/components/global/maintenance/Maintenance";
import ChangeEmail from "@/components/user/profile/settings/ChangeEmail";
import ChangeName from "@/components/user/profile/settings/ChangeName";
import ChangePassword from "@/components/user/profile/settings/ChangePassword";
import sendRequest from "@/lib/baseApi";
import React from "react";

export default async function page() {
  const statusWebsite = await sendRequest<{ value: string }[]>(
    "/v1/config?type=website_status"
  );
  if (statusWebsite.data[0].value === "maintenance") {
    return <Maintenance />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-6 lg:gap-10 pb-20 ">
      <ChangeName />
      <ChangeEmail />
      <ChangePassword />
    </div>
  );
}
