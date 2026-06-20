import BooksPage, { generateMetadata as booksMetadata } from "../books/page";
import { Metadata } from "next";

export async function generateMetadata(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}): Promise<Metadata> {
  const newSearchParams = props.searchParams.then((params) => ({
    ...params,
    category: "best-sellers",
  }));
  return booksMetadata({ searchParams: newSearchParams });
}

const Page = async (props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const newSearchParams = props.searchParams.then((params) => ({
    ...params,
    category: "best-sellers",
  }));
  return <BooksPage searchParams={newSearchParams} />;
};

export default Page;
