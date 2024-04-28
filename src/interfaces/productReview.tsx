interface IReview {
  message: string;
  rating: string;
  mobileNumber: string;
  product: string;
  createdAt: string;
}

interface IRatingSummary {
  rating: string;
  totalRating: number;
}

interface IReviewsResponse {
  reviews: IReview[];
  ratings: IRatingSummary[];
  averageRating: number;
  totalRating: number;
}
