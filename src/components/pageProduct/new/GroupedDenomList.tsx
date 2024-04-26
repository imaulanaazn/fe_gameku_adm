import { currencyConverter } from "@/lib/currencyConverter";
import { getTitleByGamesCategory } from "@/lib/getTitleCategoryId";
import { TabContext, TabPanel } from "@mui/lab";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React from "react";

const GroupedDenomList = ({ position, data, onChange, value }: any) => {
  const { titleCardHeader } = getTitleByGamesCategory(data);
  return (
    <Card
      sx={{
        marginTop: data.type === "topup" && position > 1 ? { xs: 6, md: 8 } : 0,
        borderRadius: "0.75rem",
        background:
          "#ffffff url(/images/topup-form-step-2.svg) no-repeat right top",
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
            color: "#1F2937",
            fontWeight: "800",
          },
        }}
      />
      <CardContent
        sx={{
          pt: (theme) => `${theme.spacing(3)} !important`,
          pb: "1.25rem",
          pr: "1.25rem",
          pl: "1.25rem",
        }}
      >
        <TabContext value={value.tabActive}>
          <Tabs
            value={value.tabActive}
            onChange={(e, val) => onChange("tabActive", val)}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
            sx={{
              backgroundColor: "white",
              marginTop: -6,
            }}
          >
            {data.groupedDenoms?.length > 0 &&
              data.groupedDenoms?.map((category: any) => (
                <Tab
                  key={category.id}
                  label={category.name}
                  value={category.id}
                />
              ))}
          </Tabs>
          {data.groupedDenoms?.length > 0 &&
            data.groupedDenoms?.map((category: any) => (
              <TabPanel
                id={category.id}
                value={category.id}
                key={category.id}
                sx={{ marginTop: 4, padding: "0px" }}
              >
                <Grid container spacing={4}>
                  {category.denoms.map((item: any) => (
                    <Grid key={item.id} item xs={6} md={4}>
                      <Card
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          height: "100%",
                          position: "relative",
                          cursor: "pointer",
                          outline: "1px solid #B72025",
                          ...(item.id === value.productId && {
                            outline: "2px solid #B72025",
                            backgroundColor: "#FFE4E5",
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
                                color: "#B72025",
                                ...(item.id === value.productId && {
                                  fontWeight: 800,
                                }),
                              }}
                            >
                              {item.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                letterSpacing: "0.25px",
                                fontWeight: 400,
                                color: "#1F2937",
                                ...(item.id === value.productId && {
                                  fontWeight: 600,
                                }),
                              }}
                            >
                              {currencyConverter(item.price)}
                            </Typography>
                          </Box>
                          <Avatar
                            src={
                              item.logoDenom || data.logoDenom || data.logoUrl
                            }
                            variant="rounded"
                            sx={{ width: 30, height: 30 }}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>
            ))}
        </TabContext>
      </CardContent>
    </Card>
  );
};

export default GroupedDenomList;
