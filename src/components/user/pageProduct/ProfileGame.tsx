import {
  faBolt,
  faCreditCard,
  faHeadphones,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CardContent, Typography, Card, Box, Stack } from "@mui/material";
import Image from "next/image";

const ProfileGame = ({ denoms }: { denoms: IGameDetail }) => {
  return (
    <Card
      sx={{
        position: "relative",
        borderRadius: "0.75rem",
        backgroundColor: "white",
      }}
    >
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
            <Stack
              direction="row"
              gap={2}
              alignItems="center"
              sx={{
                backgroundColor: "grey.200",
                padding: 2,
                borderRadius: 10,
                justifyContent: "center",
              }}
            >
              <FontAwesomeIcon
                fontSize="0.75rem"
                className="text-neutral-600"
                icon={faHeadphones}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "#4B5563",
                  fontWeight: 500,
                  fontSize: "0.725rem",
                }}
              >
                Layanan Pelanggan 24/7
              </Typography>
            </Stack>
            <Stack
              direction="row"
              gap={2}
              alignItems="center"
              sx={{
                backgroundColor: "grey.200",
                padding: 2,
                borderRadius: 10,
                justifyContent: "center",
              }}
            >
              <FontAwesomeIcon
                fontSize="0.75rem"
                className="text-neutral-600"
                icon={faUserShield}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "#4B5563",
                  fontWeight: 500,
                  fontSize: "0.725rem",
                }}
              >
                Garansi Layanan
              </Typography>
            </Stack>
          </Stack>
          <Stack gap={2}>
            <Stack
              direction="row"
              gap={2}
              alignItems="center"
              sx={{
                backgroundColor: "grey.200",
                padding: 2,
                borderRadius: 10,
                justifyContent: "center",
              }}
            >
              <FontAwesomeIcon
                fontSize="0.75rem"
                className="text-neutral-600"
                icon={faCreditCard}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "#4B5563",
                  fontWeight: 500,
                  fontSize: "0.725rem",
                }}
              >
                Pembayaran yang Aman
              </Typography>
            </Stack>
            <Stack
              direction="row"
              gap={2}
              alignItems="center"
              sx={{
                backgroundColor: "grey.200",
                padding: 2,
                borderRadius: 10,
                justifyContent: "center",
              }}
            >
              <FontAwesomeIcon
                fontSize="0.75rem"
                className="text-neutral-600"
                icon={faBolt}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "#4B5563",
                  fontWeight: 500,
                  fontSize: "0.725rem",
                }}
              >
                Pengiriman Instan
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <h1 className="text-base font-semibold text-gray-700 my-2">
          Top Up {denoms.name}
        </h1>

        <Typography
          variant="body2"
          sx={{ letterSpacing: "0.25px", marginTop: 1.5, color: "#4B5563" }}
          dangerouslySetInnerHTML={{ __html: denoms.description }}
        ></Typography>
      </CardContent>
    </Card>
  );
};

export default ProfileGame;
