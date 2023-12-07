export interface INewsVideos {
    id: string;
    title: string;
    author: string;
    authorUrl: string;
    url: string;
    videoId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface NewsVideoProps {
    videos: INewsVideos[];
}

export interface INewsVideosPagination extends IPagination {
    data: INewsVideos[];
}

export interface INewsVideosPaginationWithSearch extends INewsVideosPagination {
    keySearch: string;
}
