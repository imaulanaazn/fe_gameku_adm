import TableBanner from "@/components/admin/Banner/TableBanner";
import Header from "@/components/admin/Header";
import { IImageCarouselPagination } from "@/interfaces/carousels";
import sendRequest from "@/lib/baseApi";

const Banner = async () => {
    const banner = await sendRequest<IImageCarouselPagination>("/api/v1/banner", { cache: "no-cache" });
    return (
        <>
            <Header title="Banner" />
            <TableBanner banner={banner.data} />
        </>
    );
};

export default Banner;
