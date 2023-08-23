import ListPosts from "@/components/posts/ListPosts";
import sendRequest from "@/lib/baseApi";

const Posts = async () => {
    const limit = 3;
    const blogs = await sendRequest<{ data: INewsPost[]; totalData: number }>("/api/v1/newest-articles?limit=" + limit);

    return (
        <div className="mx-auto font-monstserrat">
            <div className="bg-[#F4F4F4] py-10">
                <div className="mx-auto text-center max-w-lg">
                    <h1 className="text-2xl font-semibold">Temukan Informasi Game di Sini</h1>
                    <p className="mt-5">
                        Selamat datang di halaman pusat informasi game! Jelajahi berbagai artikel menarik, ulasan
                        mendalam, dan tips bermain yang akan memperkaya pengalaman gaming Anda.
                    </p>
                </div>
            </div>
            <div className="container mx-auto p-8">
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

export default Posts;
