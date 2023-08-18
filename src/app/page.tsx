import Carousel from "@/components/home/carousel/Carousel";
import ListGames from "@/components/home/listGame/ListGames";
import NewsPost from "@/components/home/newsPost/NewsPost";
import NewsVideo from "@/components/home/newsVideo/NewsVideo";
import { IImageCarousel } from "@/interfaces/carousels";
import sendRequest from "@/lib/baseApi";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Gasskeun TOPUP - Beli Voucher Game Online di Gasskeun Topup - Cepat dan Mudah!",
    description:
        "Gasskeun Top Up adalah sebuah website topup game online terpercaya di Indonesia mulai dari Mobile Legends, PUBG Mobile, Free Fire, dan masih banyak lainnya. untuk mempermudah pembayaran anda disini kami juga menyediokan metode pembayaran Alfamart, Bank BCA, Bank Mandiri, Bank BNI DANA, OVO, dll",
};

const Home = async () => {
    // const getMe = await fetch("http://localhost:3001/api/v1/customer", {
    //     credentials: "include",
    // });
    // console.log(getMe.ok);
    // if (!getMe.ok) {
    //     return <NotFound />;
    // }
    const slides = await sendRequest<IImageCarousel[]>("/api/v1/banners");
    const popularGames = await sendRequest<IGame[]>("/api/v1/games-by?category=popular");
    const pcGames = await sendRequest<IGame[]>("/api/v1/games-by?category=pc");
    const mobileGames = await sendRequest<IGame[]>("/api/v1/games-by?category=mobile");
    const posts = await sendRequest<INewsPost[]>("/api/v1/newest-articles");
    const youtubeVideo = await sendRequest<INewsVideos[]>("/api/v1/videos");

    return (
        <div>
            <Carousel slides={slides.data} />
            <ListGames backgroundColor="bg-white" title="POPULER" data={popularGames.data} />
            <ListGames backgroundColor="bg-[#F4F4F4]" title="Game Mobile" data={mobileGames.data} />
            <ListGames backgroundColor="bg-white" title="Game PC" data={pcGames.data} />
            <NewsPost posts={posts.data} />
            <NewsVideo videos={youtubeVideo.data} />
        </div>
    );
};

export default Home;

