interface IGame {
    id: string;
    categoryId: string;
    name: string;
    logoUrl: string;
    isPopular: boolean;
    popSequence?: number;
    slug: string;
    logoDenom: string;
    deleted: boolean;
    needServerId: boolean;
    typeServerId: string;
    type: string;
    voucherType: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    description: string;
    categoryName?: string;

    listServer?: IServer[];
    keywords?: string;
}

interface ListGameProps {
    backgroundColor: string;
    title: string;
    data: IGame[];
}

interface IGameDetail extends IGame {
    products: IProductsGame[];
    servers?: IServer[];
    isGrouped: boolean;
    groupedDenoms: IProductCategoryWithDenoms[];
}

interface IGamePagination extends IPagination {
    data: IGame[];
}

interface IGamePaginationWithSearch extends IGamePagination {
    keySearch: string;
}
