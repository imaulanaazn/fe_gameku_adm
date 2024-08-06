export const carouselBreakpoints = {
  0: {
    slidesPerView: 1,
  },
  640: {
    slidesPerView: 1.25,
  },
  768: {
    slidesPerView: 1.5,
  },
  1024: {
    slidesPerView: 2.25,
  },
  1280: {
    slidesPerView: 2.75,
  },
  1536: {
    slidesPerView: 4.25,
  },
};

export const optionsStatsDate = [
  { value: "today", label: "Hari Ini" },
  { value: "yesterday", label: "Kemarin" },
  { value: "thisWeek", label: "Minggu Ini" },
  { value: "thisMonth", label: "Bulan Ini" },
  { value: "lastMonth", label: "Bulan Lalu" },
  { value: "last30days", label: "Sebulan Terakhir" },
];

export const initialStatusCounts = {
  pending: {
    total: 0,
    totalBefore: 0,
    percentageChange: 0,
  },
  success: {
    total: 0,
    totalBefore: 0,
    percentageChange: 0,
  },
  failed: {
    total: 0,
    totalBefore: 0,
    percentageChange: 0,
  },
  expired: {
    total: 0,
    totalBefore: 0,
    percentageChange: 0,
  },
};

export const bgColorsInitState = {
  orders: "bg-white",
  ordersFailed: "bg-white",
  ordersPending: "bg-white",
  ordersExpired: "bg-white",
  ordersSuccess: "bg-white",
  registration: "bg-white",
};
