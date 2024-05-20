import {
  faBolt,
  faCreditCard,
  faHeadphones,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  CardContent,
  Avatar,
  Typography,
  Card,
  Box,
  Stack,
} from "@mui/material";
import Image from "next/image";

const ProfileGame = ({ denoms }: { denoms: IGameDetail }) => {
  return (
    <Card sx={{ position: "relative", borderRadius: "0.75rem" }}>
      <CardContent>
        <Stack
          direction={{ xs: "row", sm: "column", lg: "row" }}
          gap={4}
          alignItems="center"
        >
          <Box
            width={{ xs: 70, md: 80, lg: 100 }}
            height={{ xs: 70, md: 80, lg: 100 }}
            borderRadius={{ xs: 1, lg: 2 }}
            overflow={"hidden"}
            position={"relative"}
          >
            <Image
              src={denoms.logoUrl}
              fill={true}
              alt="denom image"
              quality={60}
            />
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: "#1F2937",
              fontWeight: "800",
              fontSize: { sm: "1.2rem" },
            }}
          >
            {denoms.name}
          </Typography>
        </Stack>
        <Stack
          justifyContent="space-between"
          direction={{ xs: "row", sm: "column", lg: "row" }}
          my={5}
          gap={2}
        >
          <Stack gap={2}>
            <Stack direction="row" gap={2} alignItems="center">
              <FontAwesomeIcon fontSize="0.75rem" icon={faHeadphones} />
              <Typography variant="caption">Layanan Pelanggan 24/7</Typography>
            </Stack>
            <Stack direction="row" gap={2} alignItems="center">
              <FontAwesomeIcon fontSize="0.75rem" icon={faUserShield} />
              <Typography variant="caption">Jaminan Layanan</Typography>
            </Stack>
          </Stack>
          <Stack gap={2}>
            <Stack direction="row" gap={2} alignItems="center">
              <FontAwesomeIcon fontSize="0.75rem" icon={faCreditCard} />
              <Typography variant="caption">Pembayaran yang Aman</Typography>
            </Stack>
            <Stack direction="row" gap={2} alignItems="center">
              <FontAwesomeIcon fontSize="0.75rem" icon={faBolt} />
              <Typography variant="caption">Pengiriman Instan</Typography>
            </Stack>
          </Stack>
        </Stack>
        <Typography
          variant="body2"
          sx={{ letterSpacing: "0.25px", marginTop: 1.5 }}
          dangerouslySetInnerHTML={{ __html: denoms.description }}
        ></Typography>
      </CardContent>
    </Card>
  );
};

export default ProfileGame;
