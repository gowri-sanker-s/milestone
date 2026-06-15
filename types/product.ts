

  
  export type ProductType = {
    id: string;
    name: string;
    title: string;
    slug: string;
    description: string;

    price: number;   
    images: string[];
    genres: string[];
    author: string | null;
    language: string | null;
    pages: number | null;
    stock: number;
    rating: number;
    reviewsCount: number;
    isFeatured: boolean;
    banner: string | null;
    createdAt: string; // or Date if you parse it
    kind?: string;
    height?: number | null;
    width?: number | null;
    bookIds?: string[];
  };
  