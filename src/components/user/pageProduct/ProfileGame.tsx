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
        backgroundColor: "rgb(251 146 60 / 0.9)",
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
            borderRadius={{ xs: 1.5, lg: 2 }}
            overflow={"hidden"}
            position={"relative"}
            sx={{ flexShrink: "0" }}
          >
            <Image
              src={denoms.logoUrl}
              fill={true}
              alt="denom image"
              quality={60}
              objectFit={"cover"}
            />
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: "#ffffff",
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
                backgroundColor: "rgba(255,255,255,.4)",
                padding: 2,
                borderRadius: 10,
                justifyContent: "center",
              }}
            >
              <FontAwesomeIcon
                fontSize="0.7rem"
                color="#ffffff"
                icon={faHeadphones}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "#ffffff",
                  fontWeight: 400,
                  fontSize: "0.7rem",
                }}
              >
                Layanan 24/7
              </Typography>
            </Stack>
            <Stack
              direction="row"
              gap={2}
              alignItems="center"
              sx={{
                backgroundColor: "rgba(255,255,255,.4)",
                padding: 2,
                borderRadius: 10,
                justifyContent: "center",
              }}
            >
              <FontAwesomeIcon
                fontSize="0.7rem"
                color="#ffffff"
                icon={faUserShield}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "#ffffff",
                  fontWeight: 400,
                  fontSize: "0.7rem",
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
                backgroundColor: "rgba(255,255,255,.4)",
                padding: 2,
                borderRadius: 10,
                justifyContent: "center",
              }}
            >
              <FontAwesomeIcon
                fontSize="0.7rem"
                color="#ffffff"
                icon={faCreditCard}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "#ffffff",
                  fontWeight: 400,
                  fontSize: "0.7rem",
                }}
              >
                Pembayaran Aman
              </Typography>
            </Stack>
            <Stack
              direction="row"
              gap={2}
              alignItems="center"
              sx={{
                backgroundColor: "rgba(255,255,255,.4)",
                padding: 2,
                borderRadius: 10,
                justifyContent: "center",
              }}
            >
              <FontAwesomeIcon
                fontSize="0.7rem"
                color="#ffffff"
                icon={faBolt}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "#ffffff",
                  fontWeight: 400,
                  fontSize: "0.7rem",
                }}
              >
                Pengiriman Instan
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <h1 className="text-base font-semibold text-white my-2">
          Top Up {denoms.name}
        </h1>

        <Typography
          variant="body2"
          sx={{
            letterSpacing: "0.25px",
            marginTop: 1.5,
            color: "white",
            opacity: "0.9",
          }}
          dangerouslySetInnerHTML={{ __html: denoms.description }}
        ></Typography>
      </CardContent>
    </Card>
  );
};

export default ProfileGame;
