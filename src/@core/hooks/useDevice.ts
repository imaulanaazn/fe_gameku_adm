import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/system";

const useDevice = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.only("xs"));

    return isMobile;
};

export default useDevice;
