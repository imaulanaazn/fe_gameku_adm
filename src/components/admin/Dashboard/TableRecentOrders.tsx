import dayjs from "dayjs";
import Image from "next/image";

const recentOrders = [
    {
        id: "d5c26841-93d0-4d83-9ef4-11f923016f0f",
        invoiceId: "INV1693281983607",
        customerId: "5cf3398b-0714-435c-90a3-5b39a425be89",
        paymentMethodId: "09b826af-a755-42e3-bc45-c61d8a8bdc26",
        game: "Point Blank",
        productName: "24000 PB Cash",
        paymentMethod: "QRIS",
        totalAmt: 20200,
        feeAmt: 200,
        discAmt: 0,
        promoCd: "",
        status: "3",
        createdAt: "2023-08-29T04:06:23.000Z",
        updatedAt: "2023-08-29T04:06:23.000Z",
        completedAt: null,
        logoUrl: "https://crm.vcgamers.com/uploads/product/20220302175358produk00.jpg",
        quantity: 1,
    },
    {
        id: "316aff37-2085-4f82-94dc-b48381e56820",
        invoiceId: "INV1693279889968",
        customerId: "5cf3398b-0714-435c-90a3-5b39a425be89",
        paymentMethodId: "09b826af-a755-42e3-bc45-c61d8a8bdc26",
        game: "Point Blank",
        productName: "24000 PB Cash",
        paymentMethod: "QRIS",
        totalAmt: 20200,
        feeAmt: 200,
        discAmt: 0,
        promoCd: "",
        status: "3",
        createdAt: "2023-08-29T03:31:30.000Z",
        updatedAt: "2023-08-29T03:31:30.000Z",
        completedAt: null,
        logoUrl: "https://crm.vcgamers.com/uploads/product/20220302175358produk00.jpg",
        quantity: 1,
    },
    {
        id: "36dd9fb0-8209-4c27-b912-af3ab4348cfd",
        invoiceId: "INV1693279845336",
        customerId: "5cf3398b-0714-435c-90a3-5b39a425be89",
        paymentMethodId: "09b826af-a755-42e3-bc45-c61d8a8bdc26",
        game: "Ace Racer",
        productName: "6530 Tokens",
        paymentMethod: "QRIS",
        totalAmt: 1313000,
        feeAmt: 13000,
        discAmt: 0,
        promoCd: "",
        status: "3",
        createdAt: "2023-08-29T03:30:45.000Z",
        updatedAt: "2023-08-29T03:31:13.000Z",
        completedAt: null,
        logoUrl:
            "https://cdnb.artstation.com/p/assets/covers/images/041/763/767/large/scott-shi-scott-shi-scott-shi-1-2.jpg?1632626626",
        quantity: 1,
    },
    {
        id: "f270d46e-b5ef-494d-8e1b-f296e96b98d4",
        invoiceId: "INV1693279787376",
        customerId: "5cf3398b-0714-435c-90a3-5b39a425be89",
        paymentMethodId: "09b826af-a755-42e3-bc45-c61d8a8bdc26",
        game: "Mobile Legend Bang Bang",
        productName: "355 Diamond",
        paymentMethod: "QRIS",
        totalAmt: 80800,
        feeAmt: 800,
        discAmt: 0,
        promoCd: "",
        status: "4",
        createdAt: "2023-08-29T03:29:47.000Z",
        updatedAt: "2023-08-29T03:31:13.000Z",
        completedAt: null,
        logoUrl:
            "https://play-lh.googleusercontent.com/UELcKakJhwKhdDJIwpdvd1RjE3ClRXiG0nhChs69fBv-nn5ZkgSp2EkkRTnJYFtYoZyu",
        quantity: 1,
    },
    {
        id: "0432e925-adf2-49d1-96fe-335ba5464676",
        invoiceId: "INV1693279767411",
        customerId: "5cf3398b-0714-435c-90a3-5b39a425be89",
        paymentMethodId: "09b826af-a755-42e3-bc45-c61d8a8bdc26",
        game: "Mobile Legend Bang Bang",
        productName: "355 Diamond",
        paymentMethod: "QRIS",
        totalAmt: 240800,
        feeAmt: 800,
        discAmt: 0,
        promoCd: "",
        status: "2",
        createdAt: "2023-08-29T03:29:27.000Z",
        updatedAt: "2023-08-29T03:31:13.000Z",
        completedAt: null,
        logoUrl:
            "https://play-lh.googleusercontent.com/UELcKakJhwKhdDJIwpdvd1RjE3ClRXiG0nhChs69fBv-nn5ZkgSp2EkkRTnJYFtYoZyu",
        quantity: 3,
    },
];

const TableRecentOrders = () => {
    return (
        <>
            <h1 className="mb-5 font-semibold text-xl">Pesanan Terkini</h1>
            <table className="w-full text-sm text-left text-gray-500 table-auto">
                <thead className="text-xs text-gray-700 uppercase bg-white border-b-2 border-gray-300">
                    <tr>
                        <th scope="col" className="py-3">
                            Produk
                        </th>
                        <th scope="col" className="py-3">
                            Nomor Whatsapp
                        </th>
                        <th scope="col" className="py-3">
                            Quantity
                        </th>
                        <th scope="col" className="py-3">
                            Status
                        </th>
                        <th scope="col" className="py-3">
                            Tanggal Pembelian
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {recentOrders.map((data) => (
                        <tr key={data.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th
                                scope="row"
                                className="py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white flex gap-3 items-center"
                            >
                                <div className="w-12 h-12 object-cover">
                                    <Image
                                        src={data.logoUrl}
                                        alt={`Logo ${data.game}`}
                                        width="0"
                                        height="0"
                                        sizes="100vw"
                                        style={{ width: "100%", height: "100%" }}
                                        className="rounded-lg"
                                    />
                                </div>
                                <p>{`${data.game} (${data.productName})`}</p>
                            </th>
                            <th
                                scope="row"
                                className="py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                                089662944001
                            </th>
                            <td className="py-4">{data.quantity}</td>
                            <td className="py-4 uppercase">Belum Dibayar</td>
                            <td className="py-4">{dayjs(data.createdAt).format("YYYY-MM-DD HH:mm:ss")}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default TableRecentOrders;
