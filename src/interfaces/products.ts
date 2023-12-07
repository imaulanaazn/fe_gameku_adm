interface IProductsGame {
    id: string;
    name: string;
    price: number;
    logoDenom: string;
    gameId: string;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;

    priceBuy?: number;
    code: string;

    gameName?: string;
    totalSold?: number;
    logoUrl?: string;
    isActive: boolean;
}

interface IProductDetail extends IGame {
    products: IProductsGame[];
}

interface IProductPagination extends IPagination {
    data: IProductsGame[];
}

interface IProductPaginationWithSearch extends IProductPagination {
    keySearch: string;
}
