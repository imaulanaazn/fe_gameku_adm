interface IGetDataGames {
    pc: IGame[];
    mobile: IGame[];
    trending: IGame[];
}

interface IGame {
    id: string;
    name: string;
    logoUrl: string;
    platform: string;
    category: string;
    isPopular: boolean;
    popSequence?: number;
    slug: string;
    deleted: boolean;
}

interface ListGameProps {
    backgroundColor: string;
    title: string;
    data: IGame[];
}
