interface INewsVideos {
    id: string;
    url: string;
    videoId: string;
    createdAt: Date;
    updatedAt: Date;
}

interface NewsVideoProps {
    videos: INewsVideos[];
}
