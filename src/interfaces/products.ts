interface IProductsGame {
    id: string;
    name: string;
    price: number;
    cd: string;
    logoDenom: string;
    gameId: string;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    unit?: number;
    unitBonus?: number;

    gameName?: string;
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
