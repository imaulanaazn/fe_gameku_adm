interface IGame {
    id: string;
    categoryId: string;
    name: string;
    logoUrl: string;
    logoDenom: string;
    isPopular: boolean;
    popSequence?: number;
    slug: string;
    deleted: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
}

interface ListGameProps {
    backgroundColor: string;
    title: string;
    data: IGame[];
}

interface IGameDetail extends IGame {
    products: IProductsGame[];
}
