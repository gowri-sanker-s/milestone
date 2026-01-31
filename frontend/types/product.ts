

  
  export type ProductType = {
    id: string;
    name: string;
    title: string;
    slug: string;
    description: string;

    price: number;   
    images: string[];
    genres: string[];
    author: string;
    language: string;
    pages: number;
    stock: number;
    rating: number;
    reviewsCount: number;
    isFeatured: boolean;
    banner: string | null;
    createdAt: string; // or Date if you parse it
  };
  