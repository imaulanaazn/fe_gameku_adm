export interface IImageCarousel {
    id: string;
    name: string;
    imageUrl: string;
    eventUrl: string;
    external: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IImageCarouselPagination extends IPagination {
    data: IImageCarousel[];
}

export interface IImageCarouselPaginationWithSearch extends IImageCarouselPagination {
    keySearch: string;
}
