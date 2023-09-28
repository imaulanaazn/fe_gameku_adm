interface IPagination {
    page: number;
    sort: string;
    order: "ASC" | "DESC";
    limit: number;
    total: number;
    totalPage: number;
}
