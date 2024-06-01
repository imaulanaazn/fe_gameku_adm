import Container from "@/components/global/Container/Container";
import Maintenance from "@/components/maintenance/Maintenance";
import ChangeEmail from "@/components/profile/ChangeEmail";
import ChangeName from "@/components/profile/ChangeName";
import ChangePassword from "@/components/profile/ChangePassword";
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
    <div className="bg-primary-50">
      <Container>
        <h1 className="font-semibold text-2xl lg:text-3xl py-10 lg:pt-16 lg:pb-14 text-center">
          Edit Profile
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-4 gap-8 md:gap-6 lg:gap-8 pb-20 ">
          <ChangeName />
          <ChangeEmail />
          <ChangePassword />
        </div>
      </Container>
    </div>
  );
}
