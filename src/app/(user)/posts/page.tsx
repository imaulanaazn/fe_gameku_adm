import Maintenance from "@/components/maintenance/Maintenance";
import ListPosts from "@/components/posts/ListPosts";
import sendRequest from "@/lib/baseApi";
import { redirect } from "next/navigation";

const Posts = async () => {
    const statusWebsite = await sendRequest<{ value: string }[]>("/v1/config?type=website_status");
    if (statusWebsite.data[0].value === "maintenance") {
        return <Maintenance />;
    }
    const limit = 3;
    const blogs = await sendRequest<{ data: INewsPost[]; totalData: number }>("/v1/newest-articles?limit=" + limit);

    return (
        <div className="mx-auto font-monstserrat">
            <div className="bg-[#F4F4F4] py-10 px-2">
                <div className="mx-auto text-center max-w-lg">
                    <h1 className="lg:text-2xl text-xl font-semibold">Temukan Informasi Game di Sini</h1>
                    <p className="mt-5 font-sm">
                        Selamat datang di halaman pusat informasi game! Jelajahi berbagai artikel menarik, ulasan
                        mendalam, dan tips bermain yang akan memperkaya pengalaman gaming Anda.
                    </p>
                </div>
            </div>
            <div className="container mx-auto lg:p-8 p-2">
                {blogs.data.data.length === 0 ? (
                    <div className="h-60 flex items-center justify-center">
                        <p className="font-bold text-xl opacity-30">Belum ada postingan</p>
                    </div>
                ) : (
                    <ListPosts blogs={blogs.data} limit={limit} />
                )}
            </div>
        </div>
    );
};

export const generateMetadata = () => {
    return {
        title: "Eksplorasi Artikel: Semua Posting di GasskeunTopup",
        description: "Test",
    };
};

export default Posts;
