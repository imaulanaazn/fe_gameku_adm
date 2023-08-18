interface IProductsGame {
    id: string;
    name: string;
    price: number;
    cd: string;
    gameId: string;
    deleted: boolean;
    logo: string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

interface IProductDetail extends IGame {
    products: IProductsGame[];
}
