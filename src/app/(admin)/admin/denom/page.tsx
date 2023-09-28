import TableDenom from "@/components/admin/Denom/TableDenom";
import Header from "@/components/admin/Header";
import sendRequest from "@/lib/baseApi";

const Denom = async () => {
    const denoms = await sendRequest<IProductPagination>("/api/v1/denom", { cache: "no-cache" });
    return (
        <>
            <Header title="Denom" />
            <TableDenom denom={denoms.data} />
        </>
    );
};

export default Denom;
