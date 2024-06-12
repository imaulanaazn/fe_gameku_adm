import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import {
  faCircleDollarToSlot,
  faCogs,
  faContactCard,
  faCreditCard,
  faCube,
  faDiagramProject,
  faGamepad,
  faHistory,
  faHome,
  faHouse,
  faImage,
  faScrewdriverWrench,
  faTicket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

export const links = [
  {
    id: 1,
    name: "Beranda",
    url: "/",
    icon: faHouse,
  },
  {
    id: 2,
    name: "Layanan",
    url: "/layanan",
    icon: faScrewdriverWrench,
  },
  {
    id: 3,
    name: "Cek transaksi",
    url: "/cek-pesanan",
    icon: faCreditCard,
  },
  {
    id: 4,
    name: "Reseller",
    url: "https://reseller.gasskeuntopup.com/",
    icon: faCircleDollarToSlot,
  },
];

export const SIDEBAR_MENU = [
  {
    name: "Admin",
    icon: faHome,
    link: "/admin/admin",
    quote: "temukan ringkasan bisnismu disini",
  },
  {
    name: "Dashboard",
    icon: faHome,
    link: "/admin",
    quote: "temukan ringkasan bisnismu disini",
  },
  {
    name: "Konfigurasi",
    icon: faCogs,
    link: "/admin/configuration",
    quote: "kelola website kamu sesuai kebutuhanmu",
  },
  {
    name: "Banner",
    icon: faImage,
    link: "/admin/banner",
    quote: "buat banner untuk menarik lebih banyak pelanggan",
  },
  {
    name: "Kode Promo",
    icon: faTicket,
    link: "/admin/promo-code",
    quote: "kelola kebutuhan kode promo layananmu disini",
  },
  {
    name: "User",
    icon: faUser,
    link: "/admin/user",
    quote: "pantau informasi mengenai pelangganmu disini",
  },
  {
    name: "Reseller",
    icon: faDiagramProject,
    link: "/admin/reseller",
    quote: "pantau informasi mengenai reseller disini",
  },
  {
    name: "Game",
    icon: faGamepad,
    link: "/admin/game",
    quote: "kelola segala jenis produkmu disini",
  },
  {
    name: "Denom",
    icon: faCube,
    link: "/admin/denom",
    quote: "kelola item produkmu disini",
  },
  // {
  //     name: "Kategori Denom",
  //     icon: faCube,
  //     link: "/admin/product-category",
  //
  {
    name: "Voucher Game",
    icon: faGamepad,
    link: "/admin/game-voucher",
    quote: "buat voucher untuk menarik lebih banyak pelanggan",
  },
  {
    name: "Metode Pembayaran",
    icon: faCreditCard,
    link: "/admin/payment-method",
    quote: "kelola bagaimana pembayaran produkmu dilakukan",
  },
  // {
  //     name: "Postingan",
  //     icon: faGlobeAsia,
  //     link: "/admin/posts",
  //
  {
    name: "Media Sosial",
    icon: faContactCard,
    link: "/admin/social-media",
    quote: "kelola social media agar pelanggan lebih mengenalmu",
  },
  {
    name: "Youtube Video",
    icon: faYoutube,
    link: "/admin/youtube",
    quote: "buat video menarik agar bisa mendapatkan perhatian pelanggan",
  },
  {
    name: "Riwayat Pesanan",
    icon: faHistory,
    link: "/admin/orders",
    quote: "pantau riwayat pesanan pelangganmu disini",
  },
  {
    name: "Riwayat Deposit",
    icon: faHistory,
    link: "/admin/deposit-history",
    quote: "pantau riwayat deposit pelangganmu disini",
  },
];
