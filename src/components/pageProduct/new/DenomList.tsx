import { currencyConverter } from "@/lib/currencyConverter";
import { getTitleByGamesCategory } from "@/lib/getTitleCategoryId";
import { Avatar, Box, Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import React from "react";

const DenomList = ({ position, data, onChange, value }: any) => {
    const { titleCardHeader } = getTitleByGamesCategory(data);

    return (
        <Card sx={{ marginTop: data.type === "topup" && position > 1 ? 4 : 0 }}>
            <CardHeader
                title={titleCardHeader}
                titleTypographyProps={{
                    sx: {
                        mb: 2.5,
                        lineHeight: "2rem !important",
                        letterSpacing: "0.15px !important",
                    },
                }}
            />
            <CardContent sx={{ pt: (theme) => `${theme.spacing(3)} !important` }}>
                <Grid container spacing={4}>
                    {data.denoms.map((item: any) => (
                        <Grid key={item.id} item xs={6} md={4}>
                            <Card
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    height: 96,
                                    position: "relative",
                                    cursor: "pointer",
                                    ...(item.id === value.productId && { outline: "2px solid blueviolet" }),
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
                                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                                        <Typography variant="caption" sx={{ letterSpacing: "0.25px", fontWeight: 800 }}>
                                            {item.name}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{ letterSpacing: "0.25px", fontWeight: 600, color: "GrayText" }}
                                        >
                                            {currencyConverter(item.price)}
                                        </Typography>
                                    </Box>
                                    <Avatar
                                        src={item.logoDenom || data.logoDenom || data.logoUrl}
                                        variant="rounded"
                                        sx={{ width: 30, height: 30 }}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    );
};

export default DenomList;
