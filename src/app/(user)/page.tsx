import Carousel from "@/components/home/carousel/Carousel";
import ListGames from "@/components/home/listGame/ListGames";
import NewsPost from "@/components/home/newsPost/NewsPost";
import NewsVideo from "@/components/home/newsVideo/NewsVideo";
import { IImageCarousel } from "@/interfaces/carousels";
import sendRequest from "@/lib/baseApi";
import { Metadata } from "next";

const Home = async () => {
    const slides = await sendRequest<IImageCarousel[]>("/api/v1/banners");
    const popularGames = await sendRequest<IGame[]>("/api/v1/games?isPopular=true");
    const gameCategories = await sendRequest<IGameCategoryWithGame[]>("/api/v1/games-category?limit=3&withGame=true");
    const posts = await sendRequest<{ data: INewsPost[]; totalData: number }>("/api/v1/newest-articles?limit=3");
    const youtubeVideo = await sendRequest<INewsVideos[]>("/api/v1/videos");
    return (
        <div>
            {slides.data.length > 0 && <Carousel slides={slides.data} />}
            {popularGames.data.length > 0 && (
                <ListGames backgroundColor={"bg-[#F4F4F4]"} title="Game Popular" data={popularGames.data} />
            )}
            {gameCategories.data.map((data, index) => (
                <ListGames
                    key={index}
                    backgroundColor={index % 2 === 0 ? "bg-white" : "bg-[#F4F4F4]"}
                    title={data.name}
                    data={data.games}
                />
            ))}
            <NewsPost posts={posts.data.data} />
            <NewsVideo videos={youtubeVideo.data} />
        </div>
    );
};

export default Home;

export const generateMetadata = ({ params }: { params: string }) => {
    return {
        title: "Gasskeun TOPUP - Beli Voucher Game Online di Gasskeun Topup Cepat dan Mudah!",
        description:
            "Gasskeun Top Up adalah sebuah website topup game online terpercaya di Indonesia mulai dari Mobile Legends, PUBG Mobile, Free Fire, dan masih banyak lainnya. untuk mempermudah pembayaran anda disini kami juga menyediokan metode pembayaran Alfamart, Bank BCA, Bank Mandiri, Bank BNI DANA, OVO, dll",
    } as Metadata;
};

