interface INewsPost {
    id: string;
    slug: string;
    title: string;
    img: string;
    isExternal: boolean;
    externalUrl: string;
    totalComments: number;
    publishDate: Date;
}

interface INewsPostProps {
    blog: INewsPost;
}
