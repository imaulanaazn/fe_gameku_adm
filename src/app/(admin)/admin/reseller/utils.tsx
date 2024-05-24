const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const optionsSortBy: { label: string; value: string }[] = [
  {
    label: "Created At",
    value: "createdAt",
  },
  {
    label: "Name",
    value: "name",
  },
  {
    label: "Email",
    value: "email",
  },
  {
    label: "Mobile Number",
    value: "mobileNumber",
  },
];

export const optionsOrder: { label: string; value: string }[] = [
  {
    label: "ASCENDING",
    value: "ASC",
  },
  {
    label: "DESCENDING",
    value: "DESC",
  },
];

async function notifyReseller({
  resellerId,
  onSuccess,
  onError,
}: {
  resellerId: string;
  onSuccess: () => void;
  onError: () => void;
}) {
  try {
    const req = await fetch(
      BASE_URL + "/v1/notify-balance-reseller?userId=" + resellerId,
      {
        cache: "no-cache",
        method: "GET",
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    if (!req.ok) {
      throw new Error(`HTTP error! status: ${req.status}`);
    }
    onSuccess();
  } catch (error) {
    onError();
    console.error(error);
  }
}

export { notifyReseller };
