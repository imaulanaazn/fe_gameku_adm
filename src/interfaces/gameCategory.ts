interface IGameCategory {
    id: string;
    name: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

interface IGameCategoryWithGame extends IGameCategory {
    games: IGame[];
}
