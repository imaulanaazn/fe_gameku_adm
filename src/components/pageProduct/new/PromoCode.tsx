import { cartState } from "@/atom/cartState";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    InputAdornment,
    InputLabel,
    OutlinedInput,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";

const PromoCode = ({ data, value, onChange, position }: any) => {
    const [cart, setCart] = useRecoilState(cartState);
    const [allowed, setAllowed] = useState(false);
    const [loading, setLoading] = useState(false);

    const checkPromoCode = async () => {
        const user = localStorage.getItem("user");
        const toastId = toast.loading("Mengecek kode promo...");
        setLoading(true);
        const request = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/check-promotion", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
            credentials: "include",
            body: JSON.stringify({
                promoCode: value.promoCode,
                gameId: value.gameId,
                quantity: value.quantity,
                productId: value.productId,
                mobileNumber: value.mobileNumber,
                ...(data.type === "topup" && { userId: value.userId }),
                ...(data.type === "topup" && data.needServerId && { serverId: value.serverId }),
                ...(user && { customerId: JSON.parse(user).id }),
            }),
        });

        const res = await request.json();
        if (request.ok) {
            toast.update(toastId, {
                render: "Kode Promo Bisa Digunakan",
                type: "success",
                isLoading: false,
                position: "top-right",
                autoClose: 3000,
            });
            onChange("promoAmount", res.discount);
            onChange("promo", { code: value.promoCode });
        } else {
            toast.update(toastId, {
                render: res.message,
                type: "error",
                isLoading: false,
                position: "top-right",
                autoClose: 3000,
            });
            onChange("promoCode", "");
        }
        setLoading(false);
    };

    const handleCheckPromoCode = (e: any) => {
        e.preventDefault();
        checkPromoCode();
    };

    useEffect(() => {
        if (
            !value.promoCode ||
            !value.product ||
            !value.quantity ||
            !value.mobileNumber ||
            (data.type === "topup" && !value.userId) ||
            (data.type === "topup" && data.needServerId && !value.serverId)
        ) {
            setAllowed(false);
        } else {
            setAllowed(true);
        }
    }, [value.promoCode, value.product, value.quantity, value.serverId, value.userId, value.mobileNumber]);
    return (
        <Card sx={{ marginTop: position > 1 ? 4 : 0 }}>
            <CardHeader
                title="Kode Promo"
                titleTypographyProps={{
                    sx: {
                        mb: 2.5,
                        lineHeight: "2rem !important",
                        letterSpacing: "0.15px !important",
                    },
                }}
            />
            <CardContent sx={{ pt: (theme) => `${theme.spacing(3)} !important` }}>
                <FormControl fullWidth>
                    <InputLabel htmlFor="promoCode">Kode Promo</InputLabel>
                    <OutlinedInput
                        label="Kode Promo"
                        value={value.promoCode}
                        id="promoCode"
                        onChange={(e) => onChange("promoCode", e.target.value)}
                        type="text"
                        endAdornment={
                            <InputAdornment position="end">
                                <Button disabled={!value.promoCode} variant="contained" onClick={handleCheckPromoCode}>
                                    Cek Kode
                                </Button>
                            </InputAdornment>
                        }
                    />
                </FormControl>
            </CardContent>
        </Card>
    );
};

export default PromoCode;
