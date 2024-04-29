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
        <Stack direction="row" gap={4} alignItems="center">
          <Box sx={{ display: "flex", gap: 2 }}>
            <Avatar
              src={denoms.logoUrl}
              variant="rounded"
              sx={{ width: 80, height: 80, borderRadius: 2 }}
            />
          </Box>
          <Typography
            variant="h6"
            sx={{
              letterSpacing: "0.25px",
              marginTop: 1.5,
              color: "#1F2937",
              fontWeight: "800",
            }}
          >
            {denoms.name}
          </Typography>
        </Stack>
        <Stack justifyContent="space-between" direction="row" my={5} gap={2}>
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
