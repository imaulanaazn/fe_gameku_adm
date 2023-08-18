"use client";

import { useEffect, useState } from "react";
import ListDenom from "./listDenom/ListDenom";
import Quantity from "./Quantity/Quantity";
import ListPaymentsMethod from "./listPaymentsMethod/ListPaymentsMethod";
import DetailAccount from "./detailAccount/DetailAccount";
import NomorWhatsapp from "./nomorWhatsapp/NomorWhatsapp";
import CodePromo from "./codePromo/CodePromo";
import TotalPayments from "./totalPayments/TotalPayments";
import DescProduct from "./descProduct/DescProduct";

interface IFormProps {
    products: IProductDetail;
    paymentsMethod: IPaymentMethod[];
}

const FormTopup: React.FC<IFormProps> = ({ products, paymentsMethod }) => {
    const [choosenProduct, setChoosenProduct] = useState<Partial<IProductsGame>>({});
    const [valueQuantity, setValueQuantity] = useState("1");
    const [choosenPayment, setChoosenPayment] = useState({});
    const [allHidePayments, setAllHidePayments] = useState(true);
    const [productPrices, setProductPrices] = useState(0);
    const [userID, setUserID] = useState("");
    const [serverID, setServerID] = useState("");

    const handleClickDenom = (prod: IProductsGame) => {
        if (prod.id === choosenProduct.id) {
            setChoosenProduct({});
        } else {
            setChoosenProduct(prod);
        }
    };
    const handleChangeValueQuantity = (quantity: string) => {
        if (parseInt(quantity) < 1) {
            setValueQuantity("1");
        } else {
            setValueQuantity(quantity);
        }
    };
    const handleClickPaymentsMethod = (choosenPayment: Partial<IPaymentMethod>) => {
        setChoosenPayment(choosenPayment);
    };

    const handleChangeUserID = (userID: string) => {
        setUserID(userID);
    };

    const handleChangeServerID = (serverID: string) => {
        setServerID(userID);
    };

    useEffect(() => {
        if (!Object.keys(choosenProduct).length || !valueQuantity) {
            setAllHidePayments(true);
            if (Object.keys(choosenProduct).length) {
                setProductPrices(choosenProduct.price as number);
            } else {
                setProductPrices(0);
            }
        } else {
            setProductPrices((choosenProduct.price as number) * parseInt(valueQuantity));
            setAllHidePayments(false);
        }
    }, [choosenProduct, valueQuantity]);
    return (
        <>
            {products && (
                <>
                    <div className="lg:px-10 px-5 container mx-auto">
                        <p className="font-bold text-x">Home / {products.name}</p>
                        <div className="flex gap-10 flex-wrap lg:flex-nowrap">
                            <DescProduct products={products} />
                            <div className="lg:w-2/3 w-full flex flex-wrap flex-col mt-10">
                                <div>
                                    <ListDenom
                                        products={products.products}
                                        handleClick={handleClickDenom}
                                        choosenProduct={choosenProduct as IProductsGame}
                                    />
                                    <Quantity value={valueQuantity} setValue={handleChangeValueQuantity} />
                                    <ListPaymentsMethod
                                        paymentsMethod={paymentsMethod}
                                        allHide={allHidePayments}
                                        productPrice={productPrices}
                                        setChoosenPayment={handleClickPaymentsMethod}
                                        choosenPayment={choosenPayment as IPaymentMethod}
                                    />
                                    <DetailAccount
                                        handleUserID={handleChangeUserID}
                                        handleServerID={handleChangeServerID}
                                    />
                                    <NomorWhatsapp />
                                    <CodePromo />
                                </div>
                            </div>
                        </div>
                    </div>
                    <TotalPayments />
                </>
            )}
        </>
    );
};

export default FormTopup;
