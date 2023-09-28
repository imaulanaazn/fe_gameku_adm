import { cartState } from "@/atom/cartState";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const Quantity = () => {
    const [quantity, setQuantity] = useState("");
    const [cart, setCart] = useRecoilState(cartState);

    const handleChangeQuantity = (qty: string) => {
        if (qty) {
            const value = parseInt(qty);
            if (value > 100) {
                setQuantity("100");
            } else if (value < 1) {
                setQuantity("1");
            } else {
                setQuantity(qty);
            }

            setCart({
                ...cart,
                pricesAfterDiscount: 0,
                discount: 0,
            });
        } else {
            setQuantity("");
        }
    };

    useEffect(() => {
        const valueQty = isNaN(parseInt(quantity)) ? 0 : parseInt(quantity);
        const productPrice = cart.product && cart.product.price ? cart.product.price : 0;
        const totalAmount = cart.product && cart.paymentMethod && valueQty * productPrice + cart.fee;
        setCart({
            ...cart,
            quantity: valueQty,
            prices: valueQty * productPrice,
            totalAmount,
            promoCode: "",
        });
    }, [quantity, cart.prices, cart.fee]);

    return (
        <div className="bg-slate-200 shadow-md rounded-lg lg:p-7 p-4 mb-4">
            <div className="py-2 px-8 text-white rounded-lg shadow-lg shadow-slate-400 bg-[#B72025] w-fit text-sm">
                Jumlah Pembelian
            </div>
            <div className="grid grid-cols-1 mt-5">
                <input
                    type="text"
                    name="quantity"
                    id="quantity"
                    className="p-4 rounded-md text-sm"
                    value={quantity}
                    onChange={(e) => handleChangeQuantity(e.target.value.replace(/[^0-9]/g, ""))}
                />
            </div>
        </div>
    );
};

export default Quantity;
