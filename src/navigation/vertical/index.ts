// ** Icon imports
import HomeOutline from "mdi-material-ui/HomeOutline";

import NintendoGameBoy from "mdi-material-ui/NintendoGameBoy";
import HistoryIcon from "mdi-material-ui/History";
import WalletIcon from "mdi-material-ui/Wallet";
// ** Type import
import { VerticalNavItemsType } from "@/@core/layouts/types";
import { AccountSettings, Logout } from "mdi-material-ui";

const navigation = (): VerticalNavItemsType => {
    const path = "/dashboard";
    return [
        // {
        //     title: "Dashboard",
        //     icon: HomeOutline,
        //     path: path,
        // },
        // {
        //     title: "Topup Center",
        //     icon: NintendoGameBoy,
        //     path: "/topup-center",
        // },
        // {
        //     title: "Fund",
        //     icon: WalletIcon,
        //     path: "/fund",
        // },
        // {
        //     title: "Order History",
        //     icon: HistoryIcon,
        //     path: "/orders",
        // },
        // {
        //     sectionTitle: "Account",
        // },
        // {
        //     title: "Settings",
        //     icon: AccountSettings,
        //     path: "/setting",
        // },
        // {
        //     title: "Logout",
        //     icon: Logout,
        //     path: "/logout",
        // },
    ];
};

export default navigation;

