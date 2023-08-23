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
}

interface IProductDetail extends IGame {
    products: IProductsGame[];
}
