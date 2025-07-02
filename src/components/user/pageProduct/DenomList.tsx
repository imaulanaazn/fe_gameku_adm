import { currencyConverter } from "@/lib/currencyConverter";
import { getTitleByGamesCategory } from "@/lib/getTitleCategoryId";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React from "react";

const DenomList = ({ position, data, onChange, value }: any) => {
  const { titleCardHeader } = getTitleByGamesCategory(data);

  return (
    <Card
      sx={{
        borderRadius: "0.75rem",
        background: `#161721 url(/images/topup-form-step-${position}.svg) no-repeat right top`,
        backgroundSize: "150px",
      }}
    >
      <CardHeader
        title={titleCardHeader}
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: "2rem !important",
            letterSpacing: "0.15px !important",
            color: "#ffffff",
            fontWeight: "800",
          },
        }}
      />
      <CardContent
        sx={{
          pt: (theme) => `${theme.spacing(3)} !important`,
        }}
      >
        <Grid container spacing={3}>
          {data.products.map((item: any) => (
            <Grid key={item.id} item xs={6} md={4}>
              <a href="#quantity">
                <Card
                  elevation={0}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                    position: "relative",
                    cursor: "pointer",
                    backgroundColor: "#ffffff0a",
                    ...(item.id === value.productId && {
                      outline: "2px solid #fb923ce6",
                      backgroundColor: "#ffffff1a",
                    }),
                  }}
                  onClick={(e) => {
                    onChange("productId", item.id);
                    onChange("amount", item.price);
                    onChange("product", item);
                    onChange("promoCode", "");
                    onChange("promo", "");
                  }}
                >
                  <CardContent
                    sx={{
                      padding: 4,
                      display: "flex",
                      gap: 2,
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.25rem",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          letterSpacing: "0.25px",
                          fontWeight: 600,
                          color: "#fb923ce6",
                          ...(item.id === value.productId && {
                            fontWeight: 800,
                          }),
                        }}
                      >
                        {item.name.includes("(")
                          ? item.name
                              .substring(0, item.name.indexOf("("))
                              .trim()
                          : item.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          letterSpacing: "0.25px",
                          fontWeight: 400,
                          color: "#ffffff",
                          ...(item.id === value.productId && {
                            fontWeight: 600,
                          }),
                        }}
                      >
                        {currencyConverter(item.price)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </a>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DenomList;
