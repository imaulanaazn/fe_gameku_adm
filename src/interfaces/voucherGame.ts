interface IVoucherGame {
    id: string;
    gameId: string;
    productId: string;
    code: string;
    used: boolean;
    createdAt: string;
    updatedAt: string;

    game?: IGame;
    product?: IProductsGame;
}

interface IVoucherGamePagination extends IPagination {
    data: IVoucherGame[];
}

interface IVoucherGamePaginationWithSearch extends IVoucherGamePagination {
    keySearch: "";
}
