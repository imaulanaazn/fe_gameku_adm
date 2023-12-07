export interface ISocialMedia {
    id: string;
    name: string;
    icon: string;
    url: string;
    createdAt: string;
    updatedAt: string;
}

export interface ISocialMediaPagination extends IPagination {
    data: ISocialMedia[];
}

export interface ISocialMediaPaginationWithSearch extends ISocialMediaPagination {
    keySearch: string;
}
